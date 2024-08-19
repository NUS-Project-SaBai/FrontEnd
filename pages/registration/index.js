import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import axiosInstance from '@/pages/api/_axiosInstance';

import { venueOptions } from '@/utils/constants';
import { urltoFile } from '@/utils/helpers';
import withAuth from '@/utils/auth';
import {
  PatientRegistrationForm,
  PatientInfo,
  RegistrationAutoSuggest,
} from '@/components/registration';
import { Button } from '@/components/TextComponents/';
import { useLoading } from '@/context/LoadingContext';
import CustomModal from '@/components/CustomModal';

const Registration = () => {
  const { setLoading } = useLoading();

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
    gender: 'Male',
    village_prefix: Object.keys(venueOptions)[0],
  });

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    setLoading(true);
    try {
      const { data: patients } = await axiosInstance.get('/patients');
      setPatientsList(patients);
    } catch (error) {
      toast.error(`Error fetching patients: ${error.message}`);
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  // General functions

  function togglePatientModal() {
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

  const submitNewPatient = async () => {
    let checklist = [
      'name',
      'identification_number',
      'gender',
      'contact_no',
      'date_of_birth',
      'drug_allergy',
      'village_prefix',
    ];

    if (checklist.some(item => formDetails[item].length === 0)) {
      toast.error('Please complete the form before submitting!');
      return;
    }

    if (formDetails['date_of_birth'].length !== 10) {
      toast.error('Please enter a valid date of birth!');
      return;
    }

    if (imageDetails == null) {
      toast.error('Please take a photo before submitting!');
      return;
    }

    setLoading(true);

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

      setPatientModalOpen(false);
      submitNewVisit(response);
    } catch (error) {
      toast.error(`Error creating new patient: ${error.message}`);
      console.error('Error creating new patient:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitNewVisit = async patient => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-4">
      <CustomModal
        isOpen={patientModalOpen}
        onRequestClose={togglePatientModal}
        showCloseButton={false}
      >
        <PatientRegistrationForm
          formDetails={formDetails}
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
          closeModal={togglePatientModal}
          handleInputChange={handleInputChange}
          submitNewPatient={submitNewPatient}
        />
      </CustomModal>
      <div>
        <div>
          <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
            Registration
          </h1>
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
