import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsTable,
  Header,
  PatientView,
  PrescriptionsTable,
} from '@/components/records';
import withAuth from '@/utils/auth';
import Router from 'next/router';
import { Button } from '@/components/TextComponents/';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import toast from 'react-hot-toast';
import { useLoading } from '@/context/LoadingContext';

const PatientRecord = () => {
  const { setLoading } = useLoading();
  const [noRecords, setNoRecords] = useState(true);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState({});

  const [consults, setConsults] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const [prescriptions, setPrescriptions] = useState([]);

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const handleVisitChange = useCallback(event => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const patientID = Router.query.id;
    setLoading(true);
    try {
      const { data: patient } = await axiosInstance.get(
        `/patients/${patientID}`
      );
      const { data: visits } = await axiosInstance.get(
        `/visits?patient=${patientID}`
      );

      setPatient(patient);
      setVisits(visits);

      if (visits.length > 0) {
        const visitID = visits[0].id;
        loadVisitDetails(visitID);
      }
    } catch (error) {
      toast.error('Error loading patient data. Please try again later.');
      console.error('Error loading patient data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadVisitDetails(visitID) {
    setLoading(true);
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
    } catch (error) {
      toast.error('Error loading visit details. Please try again later.');
      console.error('Error loading visit details:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleVitalsModal() {
    setVitalsModalOpen(!vitalsModalOpen);
  }

  function toggleConsultationModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationModal();
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
        <div className="flex justify-center items-center h-screen">
          <h2 className="text-black text-xl">
            This patient has no records currently
          </h2>
        </div>
      );

    return (
      <div className="mt-7.5 mx-6 overflow-hidden">
        <Modal
          isOpen={vitalsModalOpen}
          onRequestClose={toggleVitalsModal}
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
            <VitalsTable content={vitals} />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={toggleVitalsModal}
            >
              Close
            </button>
          </div>
        </Modal>
        <CustomModal
          isOpen={consultationModalOpen}
          onRequestClose={toggleConsultationModal}
          content={<ConsultationView content={selectedConsult} />}
        />
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

export default withAuth(PatientRecord);
