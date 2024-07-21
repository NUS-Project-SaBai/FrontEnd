import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import toast from 'react-hot-toast';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsTable,
  Header,
  PatientView,
  PrescriptionsTable,
} from '@/components/records';
import { PatientModal } from '@/components/registration';
import withAuth from '@/utils/auth';
import AppWebcam from '@/utils/webcam';
import { urltoFile } from '@/utils/helpers';
import Router from 'next/router';
import { Button } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';
import { isCancel } from 'axios';

const PatientRecord = () => {
  const [noRecords, setNoRecords] = useState(true);

  const [patient, setPatient] = useState({});
  const [patientedit, setPatientedit] = useState({});
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState({});

  const [consults, setConsults] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [webcam, setWebcam] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);

  const [patientModalOpen, setPatientModalOpen] = useState(false);
  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const handleVisitChange = useCallback(event => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  // Webcam functions

  const webcamSetRef = webcam => {
    setWebcam(webcam);
  };

  const webcamCapture = () => {
    const imageSrc = webcam.getScreenshot();
    setImageDetails(imageSrc);
    setCameraIsOpen(false);
  };

  const toggleCameraOpen = () => {
    setCameraIsOpen(!cameraIsOpen);
  };

  const handlePatientChange = event => {
    const newPatientDetails = {
      ...patient,
      [event.target.name]: event.target.value,
    };
    setPatientedit(newPatientDetails);
  };

  const OnPatientEdit = async () => {
    if (!patientedit.name) {
      toast.error('Name cannot be empty.');
      return;
    }

    const updatedPatient = {
      ...patientedit,
    };

    let formData = new FormData();
    Object.keys(updatedPatient).forEach(key =>
      formData.append(key, updatedPatient[key])
    );

    if (imageDetails) {
      const pictureFile = await urltoFile(
        imageDetails,
        'patient_screenshot.jpg',
        'image/jpg'
      );
      formData.append('picture', pictureFile);
    }

    if (updatedPatient.pk) {
      try {
        await axiosInstance.patch(`/patients/${Router.query.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        toast.success('Patient Details updated!');
      } catch (error) {
        toast.error(`Encountered an error when update! ${error.message}`);
      }
    }
    togglePatientModal();
    onRefresh();
  };

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const patientID = Router.query.id;

    const { data: patient } = await axiosInstance.get(`/patients/${patientID}`);

    const { data: visits } = await axiosInstance.get(
      `/visits?patient=${patientID}`
    );

    setPatient(patient);
    setVisits(visits);

    if (visits.length > 0) {
      const visitID = visits[0].id;
      loadVisitDetails(visitID);
    }
  }

  async function loadVisitDetails(visitID) {
    const { data: consults } = await axiosInstance.get(
      `/consults?visit=${visitID}`
    );

    const prescriptions = consults
      .flatMap(consult => consult.prescriptions)
      .filter(prescription => prescription != null);

    const { data: vitals } = await axiosInstance.get(
      `/vitals?visit=${visitID}`
    );

    setNoRecords(false);
    setConsults(consults);
    setPrescriptions(prescriptions);
    setVitals(vitals[0] || {});
  }

  function toggleVitalsModal() {
    setVitalsModalOpen(!vitalsModalOpen);
  }

  function toggleConsultationModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function togglePatientModal() {
    setPatientedit(patient);
    setPatientModalOpen(!patientModalOpen);
  }

  function renderHeader() {
    return (
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
    );
  }

  function renderFirstColumn() {
    if (typeof vitals === 'undefined') {
      return (
        <div className="my-2">
          <h2>Not Done</h2>
        </div>
      );
    }

    return (
      <div className="my-2">
        <div className="grid grid-cols-2 gap-4">
          <Button
            text={'Edit Patient Details'}
            onClick={() => togglePatientModal()}
            colour="indigo"
          />
          <Button
            text={'View Vitals'}
            onClick={() => toggleVitalsModal()}
            colour="indigo"
          />
        </div>
        <PatientView content={patient} />
      </div>
    );
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationModal();
  }

  function renderSecondColumn() {
    return (
      <div className="space-y-8">
        <ConsultationsTable content={consults} buttonOnClick={selectConsult} />
        <PrescriptionsTable content={prescriptions} />
      </div>
    );
  }

  function render() {
    if (noRecords)
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <h2 style={{ color: 'black', fontSize: '1.5em' }}>
            This patient has no records currently
          </h2>
        </div>
      );

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        {
          <PatientModal
            modalIsOpen={patientModalOpen}
            closeModal={() => togglePatientModal()}
            customStyles={viewModalStyles}
            handleInputChange={handlePatientChange}
            submitNewPatient={OnPatientEdit}
            formDetails={patientedit}
            imageDetails={imageDetails}
            cameraIsOpen={cameraIsOpen}
            renderWebcam={() => (
              <AppWebcam
                webcamSetRef={webcamSetRef}
                webcamCapture={webcamCapture}
              />
            )}
            toggleCameraOpen={toggleCameraOpen}
          />
        }

        <Modal
          isOpen={vitalsModalOpen}
          onRequestClose={() => toggleVitalsModal()}
          style={viewModalStyles}
        >
          <VitalsTable content={vitals} />
        </Modal>
        <Modal
          isOpen={consultationModalOpen}
          onRequestClose={() => toggleConsultationModal()}
          style={viewModalStyles}
        >
          <ConsultationView content={selectedConsult} />
        </Modal>
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Records
        </h1>
        {renderHeader()}

        <hr className="mt-2" />

        <div className="grid grid-cols-2 gap-x-6">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
        </div>
      </div>
    );
  }

  return <>{render()}</>;
};

const viewModalStyles = {
  content: {
    left: '25%',
    right: '7.5%',
  },
  overlay: {
    zIndex: 4,
  },
};

export default withAuth(PatientRecord);
