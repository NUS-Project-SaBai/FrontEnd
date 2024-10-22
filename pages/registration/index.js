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
} from '@/components/registration';
import { Button } from '@/components/TextComponents/';
import useWithLoading from '@/utils/loading';
import CustomModal from '@/components/CustomModal';
import { PageTitle } from '@/components/TextComponents';

const Registration = () => {
  const [patientsList, setPatientsList] = useState([]);
  const [patient, setPatient] = useState({});

  const [patientModalOpen, setPatientModalOpen] = useState(false);

  const [imageDetails, setImageDetails] = useState(null);

  const [scanModalOpen, setScanModalOpen] = useState(false);

  const [scanImageDetails, setScanImageDetails] = useState(null);

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
      toast.success('New patient created!');
      onRefresh();

      setPatientModalOpen(false);
      console.log(response);
      submitNewVisit(response);
    } catch (error) {
      toast.error(`Error creating new patient: ${error.message}`);
      console.error('Error creating new patient:', error);
    }
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

      setPatient(response[0]);

      setScanImageDetails(null);

      toast.success('Patient Found!');

      setScanModalOpen(false);
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
          imageDetails={scanImageDetails}
          setImageDetails={setScanImageDetails}
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
    </div>
  );
};

export default withAuth(Registration);
