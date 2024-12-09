import React, { useState, useEffect, useCallback } from 'react';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsTable,
  Header,
  PatientView,
  PrescriptionsTable,
  HeightWeightGraph,
} from '@/components/records';
import { PatientRegistrationForm } from '@/components/registration';
import Router from 'next/router';
import { Button, PageTitle } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import toast from 'react-hot-toast';
import { urltoFile } from '@/utils/helpers';
import withAuth from '@/utils/auth';
import useWithLoading from '@/utils/loading';

const PatientRecord = () => {
  const [noRecords, setNoRecords] = useState(true);

  const [patient, setPatient] = useState({});
  const [patientEdit, setPatientEdit] = useState({});
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState({});
  const [consults, setConsults] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);
  const [selectedVisitID, setSelectedVisitID] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [editPatientModalOpen, setEditPatientModalOpen] = useState(false);

  const [imageDetails, setImageDetails] = useState(null);

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = useWithLoading(async () => {
    const patientID = Router.query.id;
    try {
      const { data: patient } = await axiosInstance.get(
        `/patients/${patientID}`
      );
      const { data: visits } = await axiosInstance.get(
        `/visits?patient=${patientID}`
      );

      // patient.date_of_birth is in ISOstring YYYY-MM-DDTHH:mm:ss.sssZ
      patient.date_of_birth = patient.date_of_birth.split('T')[0];
      setImageDetails(patient.picture);
      setPatient(patient);
      setVisits(visits);

      if (visits.length > 0) {
        const visitID = visits[0].id;
        await loadVisitDetails(visitID);
      }
    } catch (error) {
      toast.error(`Error loading patient data: ${error.message}`);
      console.error('Error loading patient data:', error);
    }
  });

  const loadVisitDetails = useWithLoading(async visitID => {
    try {
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
      setSelectedVisitID(visitID);
    } catch (error) {
      toast.error(`Error loading visit details: ${error.message}`);
      console.error('Error loading visit details:', error);
    }
  });

  const submitPatientEdit = useWithLoading(async () => {
    if (!patientEdit.name) {
      toast.error('Name cannot be empty.');
      return;
    }

    const updatedPatient = {
      ...patientEdit,
    };

    const formData = new FormData();
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
    toggleEditPatientModal();
    onRefresh();
  });

  function toggleVitalsModal() {
    setVitalsModalOpen(!vitalsModalOpen);
  }

  function toggleConsultationModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function toggleEditPatientModal() {
    setPatientEdit(patient);
    setEditPatientModalOpen(!editPatientModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationModal();
  }

  const handleVisitChange = useCallback(event => {
    const visitID = Number(event.target.value);
    loadVisitDetails(visitID);
  }, []);

  const handlePatientChange = event => {
    const newPatientDetails = {
      ...patientEdit,
      [event.target.name]: event.target.value,
    };
    setPatientEdit(newPatientDetails);
  };

  function LeftColumn() {
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
            text={'View Vitals'}
            onClick={() => toggleVitalsModal()}
            colour="indigo"
          />
          <Button
            text={'Edit Patient Details'}
            onClick={() => toggleEditPatientModal()}
            colour="green"
          />
        </div>
        <PatientView patient={patient} />
      </div>
    );
  }

  function RightColumn() {
    return (
      <div className="space-y-8">
        <ConsultationsTable consults={consults} buttonOnClick={selectConsult} />
        <PrescriptionsTable prescriptions={prescriptions} />
        <HeightWeightGraph
          age={
            new Date(
              visits.find(visit => visit.id === selectedVisitID).date
            ).getFullYear() - new Date(patient.date_of_birth).getFullYear()
          }
          weight={vitals.weight}
          height={vitals.height}
          gender={patient.gender}
        />
      </div>
    );
  }

  if (noRecords) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h2 className="text-black text-xl">
          This patient has no records currently
        </h2>
      </div>
    );
  }

  return (
    <div className="mx-6 overflow-hidden">
      <CustomModal isOpen={vitalsModalOpen} onRequestClose={toggleVitalsModal}>
        <VitalsTable
          vitals={vitals}
          patient={patient}
          visit={visits.find(visit => visit.id === selectedVisitID)}
        />
      </CustomModal>

      <CustomModal
        isOpen={editPatientModalOpen}
        onRequestClose={toggleEditPatientModal}
        onSubmit={submitPatientEdit}
      >
        <PatientRegistrationForm
          formDetails={patientEdit}
          imageDetails={imageDetails}
          setImageDetails={setImageDetails}
          handleInputChange={handlePatientChange}
        />
      </CustomModal>

      <CustomModal
        isOpen={consultationModalOpen}
        onRequestClose={toggleConsultationModal}
      >
        <ConsultationView consult={selectedConsult} />
      </CustomModal>
      <PageTitle title="Patient Records" desc="" />
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
      <hr className="mt-2" />
      <div className="grid grid-cols-2 gap-x-6">
        <LeftColumn />
        <RightColumn />
      </div>
    </div>
  );
};

export default withAuth(PatientRecord);
