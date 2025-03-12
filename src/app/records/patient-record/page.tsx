import { Button } from '@/components/Button';
import { PatientInfoDetailSection } from '@/components/records/PatientInfoDetailSection';
import { PatientInfoHeaderSection } from '@/components/records/PatientInfoHeaderSection';
import { getConsultByVisitId } from '@/data/consult/getConsult';
import { getPatientById } from '@/data/patient/getPatient';
import { Consult } from '@/types/Consult';

export default async function PatientRecordPage({
  searchParams,
}: {
  searchParams: Promise<{ id: string; visit: string }>;
}) {
  const patientId: string = (await searchParams).id || '';
  const visitId: string = (await searchParams).visit || '';

  const patient = await getPatientById(patientId);
  const consults = await getConsultByVisitId(visitId);

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
      <div className="grid grid-cols-2">
        <div>
          <Button text="View Vitals" />
          <Button text="Edit Patient Details" />
          <PatientInfoDetailSection patient={patient} />
        </div>

        <div>
          <RecordConsultationTable
            consults={consults}
            openConsultModal={() => {
              // TODO: implement proper consultation opening.
              throw new Error('Not Implemented');
            }}
          />
          <p>prescriptions</p>
        </div>
      </div>
    </div>
  );
}

function RecordConsultationTable({
  consults,
  openConsultModal,
}: {
  consults: Consult[];
  openConsultModal: (consult: Consult) => void;
}) {
  return (
    <table className="w-full rounded border border-gray-300 shadow">
      <thead className="bg-gray-50">
        <tr>
          <th>Doctor</th>
          <th>Referral Type</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {consults.map(consult => (
          <RecordConsultationTableRow
            key={consult.id}
            consult={consult}
            openConsultModal={openConsultModal}
          />
        ))}
      </tbody>
    </table>
  );
}

function RecordConsultationTableRow({
  consult,
  openConsultModal,
}: {
  consult: Consult;
  openConsultModal: (consult: Consult) => void;
}) {
  return (
    <tr>
      <td>{consult.doctor.name}</td>
      <td>{consult.referred_for || 'Not Referred'}</td>
      <td>
        <Button text="View" onClick={() => openConsultModal(consult)} />
      </td>
    </tr>
  );
}
