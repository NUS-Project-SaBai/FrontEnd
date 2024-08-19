import axiosInstance from '@/pages/api/_axiosInstance';

export const fetchPatientData = async patientID => {
  const { data: patient } = await axiosInstance.get(`/patients/${patientID}`);
  const { data: visits } = await axiosInstance.get(
    `/visits?patient=${patientID}`
  );
  return { patient, visits };
};

export const fetchVisitDetails = async visitID => {
  const { data: consults } = await axiosInstance.get(
    `/consults?visit=${visitID}`
  );
  const prescriptions = consults
    .flatMap(consult => consult.prescriptions)
    .filter(Boolean);
  const { data: vitals } = await axiosInstance.get(`/vitals?visit=${visitID}`);
  return { consults, prescriptions, vitals: vitals[0] || {} };
};
