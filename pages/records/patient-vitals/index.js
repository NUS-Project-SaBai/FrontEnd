import React, { useState, useEffect, useCallback } from 'react';
import Router from 'next/router';
import {
  ConsultationView,
  ConsultationsTable,
  VitalsForm,
  VitalsTable,
  PrescriptionsTable,
  Header,
  HeightWeightGraph,
} from '@/components/records';
import withAuth from '@/utils/auth';
import toast from 'react-hot-toast';
import axiosInstance from '@/pages/api/_axiosInstance';
import CustomModal from '@/components/CustomModal';
import useWithLoading from '@/utils/loading';

const PatientVitals = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consults, setConsults] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [vitals, setVitals] = useState({});

  const [selectedVisitID, setSelectedVisitID] = useState(null);
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
      setSelectedVisitID(visitID);
      setConsults(consults);
      setPrescriptions(prescriptions);
      setVitals(vitals[0] || {});
    } catch (error) {
      toast.error(`Error loading visit details: ${error.message}`);
      console.error('Error loading visit details:', error);
    }
  });

  function toggleCustomModal() {
    setCustomModalOpen(!CustomModalOpen);
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleCustomModal();
  }

  const submitVitalsForm = useWithLoading(async () => {
    const formPayload = {
      visit: selectedVisitID,
      ...vitalsFormDetails,
    };
    const filteredFormPayload = Object.fromEntries(
      Object.entries(formPayload).filter(([value]) => value)
    );
    try {
      await axiosInstance.patch(
        `/vitals?visit=${selectedVisitID}`,
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
          <VitalsTable
            vitals={vitals}
            patient={patient}
            visit={visits.find(visit => visit.id === selectedVisitID)}
          />
        )}

        <ConsultationsTable consults={consults} buttonOnClick={selectConsult} />

        <PrescriptionsTable prescriptions={prescriptions} />
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
        <HeightWeightGraph
          age={
            new Date(
              visits.find(visit => visit.id === selectedVisitID).date
            ).getFullYear() - new Date(patient.date_of_birth).getFullYear()
          }
          weight={vitals.weight}
          height={vitals.height}
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
          <ConsultationView consult={selectedConsult} />
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
