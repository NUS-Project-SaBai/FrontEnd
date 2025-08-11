'use server';
import { EditPatient } from '@/components/records/patient/EditPatient';
import { PatientInfoDetailSection } from '@/components/records/patient/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { PrescriptionConsultCol } from '@/components/records/PrescriptionConsultCol';
import { ViewVital } from '@/components/records/vital/ViewVital';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { getVitalByVisit } from '@/data/vital/getVital';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId = '', visit: visitId = '' } = await searchParams;

  const [patient, consults, vitals] = await Promise.all([
    getPatientById(patientId),
    getConsultByVisitId(visitId),
    getVitalByVisit(visitId),
  ]);

  if (!patient) {
    return (
      <div>
        <h1>Patient Records</h1>
        <p>No patient found!</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      <h1>Patient Records</h1>

      <PatientInfoHeaderSection patient={patient} />
      <hr className="my-2 w-full border-t-2" />
      <div className="grid grid-cols-2 gap-1 md:gap-4">
        <div>
          <div className="grid grid-cols-2 gap-2">
            <ViewVital
              consults={consults || []}
              patient={patient}
              vitals={vitals}
            />
            <EditPatient patient={patient} />
          </div>
          <PatientInfoDetailSection patient={patient} />
        </div>
        <PrescriptionConsultCol consults={consults} />
      </div>
    </div>
  );
}
