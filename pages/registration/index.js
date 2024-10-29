import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import axiosInstance from '@/pages/api/_axiosInstance';
import { urltoFile } from '@/utils/helpers';
import withAuth from '@/utils/auth';
import {
  PatientRegistrationForm,
  PatientInfo,
  RegistrationAutoSuggest,
} from '@/components/registration';
import { Button } from '@/components/TextComponents/';
import useWithLoading from '@/utils/loading';
import CustomModal from '@/components/CustomModal';
import { PageTitle } from '@/components/TextComponents';
import { useCustomFormValidation } from '@/components/CustomFormValidation';
import { useForm } from 'react-hook-form';

const Registration = () => {
  const [patientsList, setPatientsList] = useState([]);
  const [patient, setPatient] = useState({});

  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const [imageDetails, setImageDetails] = useState(null);

  const [formDetails, setFormDetails] = useState({
    name: '',
    identification_number: '',
    contact_no: '',
    date_of_birth: '',
    drug_allergy: '',
    gender: 'Unspecified',
    poor: 'No',
    bs2: 'No',
    village_prefix: '',
  });

  const initialValidationState = {
    village_prefix: { hasError: false, message: 'Village Prefix is required' },
    imageDetails: {
      hasError: false,
      message: 'Please take a photo before submitting',
    },
  };

  const { handleSubmit, control, reset } = useForm();
  const {
    customFormValidationState,
    resetCustomFormValidationState,
    setCustomErrorState,
    hasAnyError,
  } = useCustomFormValidation(initialValidationState);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useWithLoading(async () => {
    try {
      const { data: patients } = await axiosInstance.get('/patients');
      setPatientsList(patients);
    } catch (error) {
      toast.error(`Error fetching patients: ${error.message}`);
      console.error('Error fetching patients:', error);
    }
  });

  // General functions

  function togglePatientModal() {
    reset();
    resetCustomFormValidationState();
    setPatientModalOpen(!patientModalOpen);
  }

  const handleInputChange = event => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const inputName = target.name;

    setFormDetails(prevDetails => ({
      ...prevDetails,
      [inputName]: value,
    }));
  };

  const submitNewPatient = useWithLoading(async () => {
    let checklist = [
      'name',
      'identification_number',
      'gender',
      'contact_no',
      'date_of_birth',
      'drug_allergy',
      'village_prefix',
      'poor',
      'bs2',
    ];

    resetCustomFormValidationState();
    let local_error_state = false;
    if (formDetails.village_prefix == '') {
      setCustomErrorState('village_prefix');
      local_error_state = true;
    }

    if (imageDetails == null) {
      setCustomErrorState('imageDetails');
      local_error_state = true;
    }

    if (local_error_state) {
      return;
    }

    try {
      const payload = {
        ...formDetails,
        picture: await urltoFile(
          imageDetails,
          'patient_screenshot.jpg',
          'image/jpg'
        ),
      };
      const patientFormData = new FormData();
      Object.keys(payload).forEach(key =>
        patientFormData.append(key, payload[key])
      );

      const { data: response } = await axiosInstance.post(
        '/patients',
        patientFormData
      );

      if (typeof response.error !== 'undefined') {
        toast.error(`Please retake photo! ${response.error}`);
        return;
      }

      setPatient(response);
      setFormDetails(prevDetails => ({
        ...prevDetails,
        gender: 'Male',
        village_prefix: 'SV',
      }));
      setImageDetails(null);
      toast.success('New patient created!');
      onRefresh();

      setPatientModalOpen(false);
      submitNewVisit(response);
    } catch (error) {
      toast.error(`Error creating new patient: ${error.message}`);
      console.error('Error creating new patient:', error);
    }
  });

  const submitNewVisit = useWithLoading(async patient => {
    try {
      const payload = {
        patient: patient.pk,
        status: 'started',
        visit_date: moment().format('DD MMMM YYYY HH:mm'),
      };
      await axiosInstance.post('/visits', payload);
      toast.success('New visit created for patient!');
    } catch (error) {
      toast.error(`Error creating new visit: ${error.message}`);
      console.error('Error creating new visit:', error);
    }
  });

  return (
    <div className="mx-4">
      <CustomModal
        isOpen={patientModalOpen}
        onRequestClose={togglePatientModal}
        onSubmit={handleSubmit(submitNewPatient, submitNewPatient)}
      >
        <PatientRegistrationForm
          formDetails={formDetails}
          formValidationState={customFormValidationState}
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
          handleInputChange={handleInputChange}
          form_control={control}
        />
      </CustomModal>
      <div>
        <div>
          <PageTitle title="Registration" desc="" />
          <div className="flex items-center justify-center mb-2 w-full">
            <RegistrationAutoSuggest
              patientsList={patientsList}
              setPatient={setPatient}
            />
          </div>
          <div className="flex items-center justify-center mb-6 gap-3">
            <Button
              colour="green"
              text="New Patient"
              onClick={() => {
                setPatientModalOpen(true);
              }}
            />
          </div>
          <PatientInfo
            patient={patient}
            submitNewVisit={() => submitNewVisit(patient)}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Registration);
