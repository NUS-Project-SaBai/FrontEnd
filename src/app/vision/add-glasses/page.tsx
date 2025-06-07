import { LoadingUI } from '@/components/LoadingUI';

import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
//import { HeightWeightGraph } from '@/components/records/vital/HeightWeightGraph';
//import { PastVitalTable } from '@/components/records/vital/PastVitalTable';
//import { PrescriptionConsultCol } from '@/components/records/VitalPresConsultCol';

import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVisitById } from '@/data/visit/getVisit';
import { getVitalByVisit } from '@/data/vital/getVital';
//import { calculateDobDifference } from '@/types/Patient';
import { EMPTY_VITAL } from '@/types/Vital';
//import { VitalsForm } from '@/app/records/patient-vitals/VitalsForm';

export default async function PatientGlassesPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId, visit: visitId } = await searchParams;
  if (visitId == undefined) {
    return (
      <div className="p-2">
        <h1>Patient Glasses Details</h1>
        <div className="border-b-2 py-2">
          <PatientInfoHeaderSection patient={await getPatientById(patientId)} />
        </div>
        <div>
          <LoadingUI message="Loading data..." />
        </div>
      </div>
    );
  }

  const [patient] = await Promise.all([
    getPatientById(patientId),
    getVitalByVisit(visitId).then(vital => vital || EMPTY_VITAL),
    getVisitById(visitId).then(visit =>
      visit == null ? new Date() : new Date(visit.date)
    ),
    getConsultByVisitId(visitId),
  ]);

  // const patientVisitAge = calculateDobDifference(
  //   new Date(patient.date_of_birth),
  //   visitDate
  // );

  return (
    <div className="p-2">
      <h1>Patient Glasses Details</h1>
      <div className="border-b-2 py-2">
        <PatientInfoHeaderSection patient={patient} />
      </div>
      {/* This will either be an editable page or left is fixed, right is a form to update */}
      <div className="mb-4 mt-2 grid grid-cols-2 gap-4">
        <h2>Past Glasses Records</h2>
        <div>{/* Details of existing info goes here */}</div>
        <h2>Update Glasses</h2>
        <div>{/* Form goes here */}</div>
      </div>
    </div>
  );
}
