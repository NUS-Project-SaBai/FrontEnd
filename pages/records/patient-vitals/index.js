import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import Modal from 'react-modal';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsForm,
  VitalsTable,
  PrescriptionsTable,
  Header,
} from '@/pages/records/_components';
import { API_URL } from '@/utils/constants';
import withAuth from '@/utils/auth';
import toast from 'react-hot-toast';
import { Button } from '@/components/TextComponents/';
import makeRequest from '@/pages/api/_make-request';

const PatientVitals = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consults, setConsults] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [vitals, setVitals] = useState({});

  const [selectedVisit, setSelectedVisit] = useState(null);
  const [selectedConsult, setSelectedConsult] = useState({});

  const [vitalsFormDetails, setVitalsFormDetails] = useState({
    // Initial form details
    height: '',
    weight: '',
    temperature: '',
    heart_rate: '',
    left_eye_degree: '',
    right_eye_degree: '',
    left_eye_pinhole: '',
    right_eye_pinhole: '',
    urine_test: '',
    hemocue_count: '',
    blood_glucose: '',
    others: '',
    systolic: '',
    diastolic: '',
    diabetes_mellitus: '',
  });

  const [consultationViewModalOpen, setConsultationViewModalOpen] =
    useState(false);

  const handleVisitChange = useCallback((event) => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const patientID = Router.query.id;

    const { data: patient } = await makeRequest(
      'get',
      `${API_URL}/patients/${patientID}`
    );

    const { data: visits } = await makeRequest(
      'get',
      `${API_URL}/visits?patient=${patientID}`
    );

    setPatient(patient);
    setVisits(visits);

    if (visits.length > 0) {
      const visitID = visits[0].id;
      loadVisitDetails(visitID);
    }
  }

  async function loadVisitDetails(visitID) {
    const { data: consults } = await makeRequest(
      'get',
      `${API_URL}/consults?visit=${visitID}`
    );

    const prescriptions = consults
      .flatMap((consult) => consult.prescriptions)
      .filter((prescription) => prescription != null);

    const { data: vitals } = await makeRequest(
      'get',
      `${API_URL}/vitals?visit=${visitID}`
    );

    setMounted(true);
    setSelectedVisit(visitID);
    setConsults(consults);
    setPrescriptions(prescriptions);
    setVitals(vitals[0] || {});
  }

  function toggleConsultationViewModal() {
    setConsultationViewModalOpen(!consultationViewModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationViewModal();
  }

  function renderConsultationViewModal() {
    return (
      <Modal
        isOpen={consultationViewModalOpen}
        onRequestClose={() => toggleConsultationViewModal()}
        style={viewModalStyles}
      >
        <ConsultationView content={selectedConsult} />;
      </Modal>
    );
  }

  async function submitVitalsForm() {
    const formPayload = {
      visit: selectedVisit,
      ...vitalsFormDetails,
    };
    const filteredFormPayload = Object.fromEntries(
      Object.entries(formPayload).filter(([_, value]) => value)
    );
    await makeRequest(
      'patch',
      `${API_URL}/vitals?visit=${selectedVisit}`,
      filteredFormPayload
    ).catch((error) => {
      console.dir(error.response);
    });
    toast.success('Vitals completed!');

    Router.push('/records');
  }

  function handleVitalsFormOnChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setVitalsFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
    return (
      <div className="space-y-4">
        {typeof vitals === 'undefined' ? (
          <>
            <label className="label">Vital Signs</label>
            <h2>Not Done</h2>
          </>
        ) : (
          <VitalsTable content={vitals} />
        )}

        <ConsultationsTable content={consults} buttonOnClick={selectConsult} />

        <PrescriptionsTable content={prescriptions} />
      </div>
    );
  }

  function renderSecondColumn() {
    return (
      <div className="space-y-2">
        <VitalsForm
          formDetails={vitalsFormDetails}
          handleOnChange={handleVitalsFormOnChange}
          patient={patient}
          onSubmit={submitVitalsForm}
        />
      </div>
    );
  }

  function render() {
    if (!mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
          overflowX: 'hidden', //remove horizontal scrollbar
          overflowY: 'hidden',
        }}
      >
        {renderConsultationViewModal()}
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Vitals
        </h1>
        {renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="grid grid-cols-2 gap-x-4 mb-4 mt-2">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
        </div>
      </div>
    );
  }
  return render();
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

export default withAuth(PatientVitals);
