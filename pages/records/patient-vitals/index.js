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
import { PageTitle } from '@/components/TextComponents';
import useWithLoading from '@/utils/loading';

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

  const [CustomModalOpen, setCustomModalOpen] = useState(false);

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

      setPatient(patient);
      setVisits(visits);

      if (visits.length > 0) {
        const visitID = visits[0].id;
        loadVisitDetails(visitID);
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

      setMounted(true);
      setSelectedVisit(visitID);
      setConsults(consults);
      setPrescriptions(prescriptions);
      setVitals(vitals[0] || {});
    } catch (error) {
      toast.error(`Error loading visit details: ${error.message}`);
      console.error('Error loading visit details:', error);
    }
  });

  const handleVisitChange = useCallback(event => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  function toggleCustomModal() {
    setCustomModalOpen(!CustomModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleCustomModal();
  }

  const submitVitalsForm = useWithLoading(async () => {
    const formPayload = {
      visit: selectedVisit,
      ...vitalsFormDetails,
    };
    const filteredFormPayload = Object.fromEntries(
      Object.entries(formPayload).filter(([value]) => value)
    );
    try {
      await axiosInstance.patch(
        `/vitals?visit=${selectedVisit}`,
        filteredFormPayload
      );
      toast.success('Vitals completed!');
      Router.push('/records');
    } catch (error) {
      let errorMessage = 'Error submitting vitals:';
      if (error.request && error.request.response) {
        try {
          const errorResponse = JSON.parse(error.request.response);
          for (const [field, messages] of Object.entries(errorResponse)) {
            errorMessage += ` ${field.charAt(0).toUpperCase() + field.slice(1)} - ${messages.join(', ')}.`;
          }
          // eslint-disable-next-line no-unused-vars
        } catch (parseError) {
          errorMessage += ` ${error.request.response}`;
        }
      } else {
        errorMessage += ' An unexpected error occurred';
      }
      toast.error(errorMessage);
      console.error('Error submitting vitals:', error);
    }
  });

  function handleVitalsFormOnChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    setVitalsFormDetails(prevState => ({
      ...prevState,
      [name]: value,
    }));
  }

  const PatientHeader = () => {
    return (
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
    );
  };

  if (!mounted) return <></>;

  return (
    <div className="mt-7.5 mx-6 overflow-hidden">
      <CustomModal isOpen={CustomModalOpen} onRequestClose={toggleCustomModal}>
        <ConsultationView content={selectedConsult} />
      </CustomModal>
      <PageTitle title="Patient Vitals" />
      <PatientHeader />
      <b>Please remember to press the submit button at the end of the form!</b>

      <hr />

      <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
        
        {/* Left Column */}
        <div className="space-y-4">
          {typeof vitals === 'undefined' ? (
            <>
              <label className="label">Vital Signs</label>
              <h2>Not Done</h2>
            </>
          ) : (
            <VitalsTable content={vitals} />
          )}
          <ConsultationsTable
            content={consults}
            buttonOnClick={selectConsult}
          />
          <PrescriptionsTable content={prescriptions} />
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <VitalsForm
            formDetails={vitalsFormDetails}
            handleOnChange={handleVitalsFormOnChange}
            patient={patient}
            onSubmit={submitVitalsForm}
          />
        </div>
      </div>
    </div>
  );
};

export default withAuth(PatientVitals);
