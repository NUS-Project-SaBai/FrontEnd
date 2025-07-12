import { Button } from '@/components/Button';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';
import Image from 'next/image';
import Link from 'next/link';

export function PatientRecordTable({ patients }: { patients: Patient[] }) {
  return (
    <table className="w-full divide-y-2 divide-gray-500 text-left">
      <thead className="z-1 sticky top-[108px] bg-white">
        <tr className="py-8">
          <th className="w-[10%]">ID</th>
          <th className="w-[20%]">Photo</th>
          <th className="w-[40%]">Full Name</th>
          <th className="w-[10%]">Record</th>
          <th className="w-[10%]">Vitals</th>
          <th className="w-[10%]">Consultation</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {patients.map(patient => (
          <PatientRecordRow key={patient.pk} patient={patient} />
        ))}
      </tbody>
    </table>
  );
}

function PatientRecordRow({ patient }: { patient: Patient }) {
  return (
    <tr>
      <td
        className={
          'font-semibold ' + VILLAGES_AND_ALL[patient.village_prefix].color
        }
      >
        {patient.patient_id}
      </td>
      <td>
        <Image
          src={patient.picture_url}
          alt={'Patient Photo'}
          height={100}
          width={100}
        />
      </td>
      <td>{patient.name}</td>
      <td>
        {/* record */}
        <Link href={`/records/patient-record?id=${patient.pk}`}>
          <Button text="View" colour="indigo" />
        </Link>
      </td>
      <td>
        {/* vitals */}
        <Link href={`/records/patient-vitals?id=${patient.pk}`}>
          <Button text="Create" colour="green" />
        </Link>
      </td>
      <td>
        {/* consultation */}
        <Link href={`/records/patient-consultation?id=${patient.pk}`}>
          <Button text="Create" colour="green" />
        </Link>
      </td>
    </tr>
  );
}
