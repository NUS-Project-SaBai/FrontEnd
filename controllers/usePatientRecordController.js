import { useState, useCallback } from 'react';
import { fetchPatientData, fetchVisitDetails } from '@/models/patientModel';
import toast from 'react-hot-toast';
import useWithLoading from '@/utils/loading';

const usePatientRecordController = () => {
  const [noRecords, setNoRecords] = useState(true);
  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);
  const [consults, setConsults] = useState([]);
  const [vitals, setVitals] = useState({});
  const [prescriptions, setPrescriptions] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const loadPatientData = useWithLoading(
    useCallback(async patientID => {
      try {
        const { patient, visits } = await fetchPatientData(patientID);
        setPatient(patient);
        setVisits(visits);

        if (visits.length > 0) {
          loadVisitDetails(visits[0].id);
        } else {
          setNoRecords(true);
        }
      } catch (error) {
        toast.error(`Error loading patient data: ${error.message}`);
        console.error('Error loading patient data:', error);
      }
    }, [])
  );

  const loadVisitDetails = useWithLoading(
    useCallback(async visitID => {
      try {
        const { consults, prescriptions, vitals } =
          await fetchVisitDetails(visitID);
        setConsults(consults);
        setPrescriptions(prescriptions);
        setVitals(vitals);
        setNoRecords(false);
      } catch (error) {
        toast.error(`Error loading visit details: ${error.message}`);
        console.error('Error loading visit details:', error);
      }
    }, [])
  );

  return {
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
  };
};

export default usePatientRecordController;
