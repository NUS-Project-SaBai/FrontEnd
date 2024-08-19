import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsForm,
  VitalsTable,
  PrescriptionsTable,
  Header,
} from '@/components/records';
import withAuth from '@/utils/auth';
import toast from 'react-hot-toast';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import { useLoading } from '@/context/LoadingContext';

const PatientVitals = () => {
  const { setLoading } = useLoading();
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

  const [CustomModalOpen, setCustomModalOpen] = useState(false);

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
      toast.error(`Error loading patient data: ${error.message}`);
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

      setMounted(true);
      setSelectedVisit(visitID);
      setConsults(consults);
      setPrescriptions(prescriptions);
      setVitals(vitals[0] || {});
    } catch (error) {
      toast.error(`Error loading visit details: ${error.message}`);
      console.error('Error loading visit details:', error);
    } finally {
      setLoading(false);
    }
  }

  function toggleCustomModal() {
    setCustomModalOpen(!CustomModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleCustomModal();
  }

  async function submitVitalsForm() {
    const formPayload = {
      visit: selectedVisit,
      ...vitalsFormDetails,
    };
    const filteredFormPayload = Object.fromEntries(
      Object.entries(formPayload).filter(([value]) => value)
    );
    setLoading(true);
    try {
      await axiosInstance.patch(
        `/vitals?visit=${selectedVisit}`,
        filteredFormPayload
      );
      toast.success('Vitals completed!');
      Router.push('/records');
    } catch (error) {
      toast.error(`Error submitting vitals: ${error.message}`);
      console.error('Error submitting vitals:', error);
    }
    setLoading(false);
  }

  function handleVitalsFormOnChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setVitalsFormDetails(prevState => ({
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
      <div className="mt-7.5 mx-6 overflow-hidden">
        <CustomModal
          isOpen={CustomModalOpen}
          onRequestClose={toggleCustomModal}
        >
          <ConsultationView content={selectedConsult} />
        </CustomModal>
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Vitals
        </h1>
        {renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
        </div>
      </div>
    );
  }
  return render();
};

export default withAuth(PatientVitals);
