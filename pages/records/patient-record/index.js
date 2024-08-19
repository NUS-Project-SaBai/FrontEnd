import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import Router from 'next/router';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsTable,
  Header,
  PatientView,
  PrescriptionsTable,
} from '@/components/records';
import withAuth from '@/utils/auth';
import { Button } from '@/components/TextComponents/';
import CustomModal from '@/components/CustomModal';
import usePatientRecordController from '@/controllers/usePatientRecordController';

const PatientRecord = () => {
  const {
    noRecords,
    patient,
    visits,
    consults,
    vitals,
    prescriptions,
    selectedConsult,
    setSelectedConsult,
    loadPatientData,
    loadVisitDetails,
  } = usePatientRecordController();

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  useEffect(() => {
    const patientID = Router.query.id;
    loadPatientData(patientID);
  }, []);

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
    <div className="mt-7.5 mx-6 overflow-hidden">
      <Modal
        isOpen={vitalsModalOpen}
        onRequestClose={() => setVitalsModalOpen(false)}
        className="fixed inset-0 flex items-center justify-center z-50 p-4"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
          <VitalsTable content={vitals} />
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => setVitalsModalOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>

      <CustomModal
        isOpen={consultationModalOpen}
        onRequestClose={() => setConsultationModalOpen(false)}
      >
        <ConsultationView content={selectedConsult} />
      </CustomModal>

      <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
        Patient Records
      </h1>

      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={event => loadVisitDetails(event.target.value)}
      />

      <hr className="mt-2" />

      <div className="grid grid-cols-2 gap-x-6">
        <div className="my-2">
          {Object.keys(vitals).length === 0 ? (
            <h2>Not Done</h2>
          ) : (
            <>
              <Button
                text="View Vitals"
                onClick={() => setVitalsModalOpen(true)}
                colour="indigo"
              />
              <PatientView content={patient} />
            </>
          )}
        </div>
        <div className="space-y-8">
          <ConsultationsTable
            content={consults}
            buttonOnClick={consult => {
              setSelectedConsult(consult);
              setConsultationModalOpen(true);
            }}
          />
          <PrescriptionsTable content={prescriptions} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(PatientRecord);
