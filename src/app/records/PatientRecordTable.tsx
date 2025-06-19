import { Button } from '@/components/Button';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function PatientRecordTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full table-auto text-left">
        {/* <thead className="z-1 sticky top-0 bg-white">
          <tr className="py-8">
            <th className="w-[10%]">ID</th>
            <th className="w-[20%]">Photo</th>
            <th className="w-[40%]">Full Name</th>
            <th className="w-[10%]">Record</th>
            <th className="w-[10%]">Vitals</th>
            <th className="w-[10%]">Consultation</th>
          </tr>
        </thead> */}
        <colgroup>
          <col className="w-[10%]" />
          <col className="w-[15%]" />
          <col className="w-[40%]" />
          <col className="w-[15%]" />
          <col className="w-[10%]" />
          <col className="w-[10%]" />
        </colgroup>
        <tbody className="divide-y">
          {patients.map(patient => (
            <PatientRecordRow key={patient.pk} patient={patient} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PatientRecordRow({ patient }: { patient: Patient }) {
  const router = useRouter();

  return (
    <tr
      onClick={() => router.push(`/records/patient-record?id=${patient.pk}`)}
      className="group cursor-pointer bg-white hover:bg-gray-200"
      role="button"
    >
      <td
        className={
          'font-semibold ' + VILLAGES_AND_ALL[patient.village_prefix].color
        }
      >
        {patient.patient_id}
      </td>
      <td>
        <Image
          src={patient.picture}
          alt="Patient Photo"
          height={100}
          width={100}
        />
      </td>
      <td>{patient.name}</td>
      <td>Last visit: xyz</td>
      <td>
        <Link
          href={`/records/patient-vitals?id=${patient.pk}`}
          className="group-hover:bg-white"
          onClick={e => e.stopPropagation()}
        >
          <Button text="Vitals" colour="red" />
        </Link>
      </td>
      <td>
        <Link
          href={`/records/patient-consultation?id=${patient.pk}`}
          className="group-hover:bg-white"
          onClick={e => e.stopPropagation()}
        >
          <Button text="Consultation" colour="indigo" />
        </Link>
      </td>
    </tr>
  );
}
