import React, { useContext, useEffect, useState } from 'react';
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
import { REGISTRATION_FORM_FIELDS } from '@/utils/constants';
import { VillageContext } from '@/context/VillageContext';
import useSaveOnWrite from '@/hooks/useSaveOnWrite';

export const submitNewVisit = async patient => {
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
};

const Registration = () => {
  const [patientsList, setPatientsList] = useState([]);

  const [patient, setPatient] = useState({});

  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const [imageDetails, setImageDetails, clearImageDetailsLocalStorage] =
    useSaveOnWrite('image', null);

  const [scanModalOpen, setScanModalOpen] = useState(false);

  const [scanSuggestionsList, setScanSuggestionsList] = useState([]);

  const [formDetails, setFormDetails, clearFormDetailsLocalStorage] =
    useSaveOnWrite('registration', REGISTRATION_FORM_FIELDS);

  const { village } = useContext(VillageContext);

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
    setPatientModalOpen(!patientModalOpen);
  }

  function presetVillageIfUnset() {
    if (!formDetails.village_prefix && village !== 'ALL') {
      setFormDetails({ ...formDetails, village_prefix: village });
    }
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

    if (formDetails['date_of_birth'].length !== 10) {
      toast.error('Please enter a valid date of birth!');
      return;
    }

    if (formDetails.gender == '') {
      toast.error('Please select a gender');
      return;
    }

    if (formDetails.village_prefix == '') {
      toast.error('Please select a village');
      return;
    }

    if (imageDetails == null) {
      toast.error('Please take a photo before submitting!');
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
      clearFormDetailsLocalStorage();
      toast.success('New patient created!');
      onRefresh();

      setPatientModalOpen(false);
      handleNewVisit(response);
      setFormDetails(REGISTRATION_FORM_FIELDS);
    } catch (error) {
      toast.error(`Error creating new patient: ${error.message}`);
      console.error('Error creating new patient:', error);
    }
  });

  const submitScan = useWithLoading(async () => {
    if (imageDetails == null) {
      toast.error('Please take a photo before submitting!');
      return;
    }

    try {
      const scanFormData = new FormData();
      scanFormData.append(
        'picture',
        await urltoFile(imageDetails, 'patient_screenshot.jpg', 'image/jpg')
      );

      const { data: response } = await axiosInstance.post(
        '/patients/search_face',
        scanFormData
      );

      if (response.length == 0) {
        toast.error('Patient does not exist!');
        return;
      }
      toast.success('Patient Found!');

      setScanSuggestionsList(response);
    } catch (error) {
      toast.error(`Error scanning face: ${error.meesage}`);
      console.error('Error scanning face:', error);
    }
  });

  const handleNewVisit = useWithLoading(async patient => {
    try {
      const { data: patient_visits } = await axiosInstance.get(
        `/visits?patient=${patient.pk}`
      );
      if (patient_visits.length > 0) {
        const mostRecentVisit = patient_visits.reduce((latest, visit) => {
          return new Date(visit.date) > new Date(latest.date) ? visit : latest;
        }, patient_visits[0]);

        const currentDate = new Date();
        const mostRecentVisitDate = new Date(mostRecentVisit.date);
        const timeDiffInMin =
          Math.abs(currentDate.getTime() - mostRecentVisitDate.getTime()) /
          (1000 * 60);

        if (timeDiffInMin < 60) {
          const isNotDuplicateVisit = confirm(
            `It's only been ${Math.floor(timeDiffInMin)} min since a visit for this patient was created.
          Are you sure you want to create a new visit?
          (Note: duplicate visits will cause unnecessary complications)
          Press CANCEL to NOT CREATE a new visit.
          Press OK to CREATE a new visit.`
          );

          if (!isNotDuplicateVisit) {
            return;
          }
        }
      }
    } catch (error) {
      toast.error(`Error fetching patient visits: ${error.message}`);
      console.error('Error fetching patient vists:', error);
    }

    submitNewVisit(patient);
  });

  return (
    <div className="mx-4">
      <CustomModal
        isOpen={patientModalOpen}
        onRequestClose={togglePatientModal}
        onSubmit={submitNewPatient}
      >
        <PatientRegistrationForm
          formDetails={formDetails}
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
          handleInputChange={handleInputChange}
        />
      </CustomModal>

      <CustomModal
        isOpen={scanModalOpen}
        onRequestClose={toggleScanModal}
        onSubmit={submitScan}
      >
        <PatientScanForm
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
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
              onClick={() => {
                presetVillageIfUnset();
                setPatientModalOpen(true);
              }}
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
            submitNewVisit={() => handleNewVisit(patient)}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(Registration);
