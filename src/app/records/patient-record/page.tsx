'use server';
import { LoadingPage } from '@/components/LoadingPage';
import { EditPatient } from '@/components/records/patient/EditPatient';
import { PatientInfoDetailSection } from '@/components/records/patient/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { PrescriptionConsultCol } from '@/components/records/PrescriptionConsultCol';
import { ViewVital } from '@/components/records/vital/ViewVital';
import { getVisitByPatientId } from '@/data/visit/getVisit';
import { redirect } from 'next/navigation';
import { fetchPatientRecords } from './api';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const { id: patientId = '', visit: visitId = '' } = await searchParams;

  if (visitId === '') {
    const visit = await getVisitByPatientId(patientId).then(
      visits => visits[0].id
    );
    redirect(`/records/patient-record?id=${patientId}&visit=${visit}`);
    return (
      <LoadingPage isLoading={true} message="Loading patient records...">
        <></>
      </LoadingPage>
    );
  }
  const { patient, consults, vitals, prescriptions } =
    await fetchPatientRecords(visitId);
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
        <PrescriptionConsultCol
          consults={consults}
          prescriptions={prescriptions}
        />
      </div>
    </div>
  );
}
