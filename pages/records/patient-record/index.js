import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsTable,
  Header,
  PatientView,
  PrescriptionsTable,
} from '@/pages/records/_components';
import withAuth from '@/utils/auth';
import Router from 'next/router';
import { Button } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';

const PatientRecord = () => {
  const [noRecords, setNoRecords] = useState(true);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState({});

  const [consults, setConsults] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const handleVisitChange = useCallback((event) => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

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
      .flatMap((consult) => consult.prescriptions)
      .filter((prescription) => prescription != null);

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
        <Button
          text={'View Vitals'}
          onClick={() => toggleVitalsModal()}
          colour="indigo"
        />
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
    left: '30%',
    right: '12.5%',
    top: '12.5%',
    bottom: '12.5%',
  },
  overlay: {
    zIndex: 4,
  },
};

export default withAuth(PatientRecord);
