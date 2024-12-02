import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import axiosInstance from '@/pages/api/_axiosInstance';
import { urltoFile } from '@/utils/helpers';
import withAuth from '@/utils/auth';
import {
  PatientRegistrationForm,
  PatientScanForm,
  PatientInfo,
  RegistrationAutoSuggest,
  RegistrationScanSuggest,
} from '@/components/registration';
import { Button } from '@/components/TextComponents/';
import useWithLoading from '@/utils/loading';
import CustomModal from '@/components/CustomModal';
import { PageTitle } from '@/components/TextComponents';
import { useCustomFormValidation } from '@/components/CustomFormValidation';
import { FormProvider, useForm } from 'react-hook-form';
import { REGISTRATION_FORM_FIELDS } from '@/utils/constants';

const Registration = () => {
  const [patientsList, setPatientsList] = useState([]);

  const [patient, setPatient] = useState({});

  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const [imageDetails, setImageDetails] = useState(null);

  const [scanModalOpen, setScanModalOpen] = useState(false);

  const [scanImageDetails, setScanImageDetails] = useState(null);

  const [scanSuggestionsList, setScanSuggestionsList] = useState([]);

  const [formDetails, setFormDetails] = useState(REGISTRATION_FORM_FIELDS);

  const initialValidationState = {
    village_prefix: { hasError: false, message: 'Village Prefix is required' },
    imageDetails: {
      hasError: false,
      message: 'Please take a photo before submitting',
    },
  };

  const methods = useForm();
  const { control, handleSubmit, reset } = methods;

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

  function toggleScanModal() {
    setScanModalOpen(!scanModalOpen);
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
      'sabai',
    ];

    if (formDetails.name == '') {
      toast.error('Name cannot be empty.');
      return;
    }

    if (
      formDetails['date_of_birth'].length !== 10 &&
      formDetails['date_of_birth'].length !== 0
    ) {
      toast.error('Please enter a valid date of birth!');
      return;
    }

    if (formDetails.village_prefix == '') {
      toast.error('Please select a village');
      return;
    }

    let local_error_state = false; //temp fix not sure what the below code is doingl in the future can remove custom validation and use RHF properly
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
        //not sure why this is here
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
    setFormDetails(REGISTRATION_FORM_FIELDS);
  });

  const submitScan = useWithLoading(async () => {
    if (scanImageDetails == null) {
      toast.error('Please take a photo before submitting!');
      return;
    }

    try {
      const scanFormData = new FormData();
      scanFormData.append(
        'picture',
        await urltoFile(scanImageDetails, 'patient_screenshot.jpg', 'image/jpg')
      );

      const { data: response } = await axiosInstance.post(
        '/patients/search_face',
        scanFormData
      );

      console.log(response.length);
      if (response.length == 0) {
        toast.error('Patient does not exist!');
        return;
      }
      toast.success('Patient Found!');

      setScanSuggestionsList(response);

      setScanImageDetails(null);
    } catch (error) {
      toast.error(`Error scanning face: ${error.meesage}`);
      console.error('Error scanning face:', error);
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
      <FormProvider {...methods}>
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

        <CustomModal
          isOpen={scanModalOpen}
          onRequestClose={toggleScanModal}
          onSubmit={submitScan}
        >
          <PatientScanForm
            imageDetails={scanImageDetails}
            setImageDetails={setScanImageDetails}
          />
          <RegistrationScanSuggest
            setPatient={setPatient}
            setScanModalOpen={setScanModalOpen}
            suggestionList={scanSuggestionsList}
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
                onClick={togglePatientModal}
              />
              <Button
                colour="green"
                text="Scan Face"
                onClick={() => {
                  setScanModalOpen(true);
                }}
              />
            </div>
            <PatientInfo
              patient={patient}
              submitNewVisit={() => submitNewVisit(patient)}
            />
          </div>
        </div>
      </FormProvider>
    </div>
  );
};

export default withAuth(Registration);
