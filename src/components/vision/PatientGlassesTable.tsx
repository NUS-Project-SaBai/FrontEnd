import { Button } from '@/components/Button';
import { PatientPhoto } from '@/components/PatientPhoto';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function PatientGlassesTable({ patients }: { patients: Patient[] }) {
  return (
    <table className="w-full divide-y-2 divide-gray-500 text-left">
      <thead>
        <tr className="py-8">
          <th className="w-[10%]">ID</th>
          <th className="w-[25%]">Photo</th>
          <th className="w-[45%]">Full Name</th>
          <th className="w-[20%]">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-300">
        {patients.map(patient => (
          <PatientRecordRow key={patient.pk} patient={patient} />
        ))}
      </tbody>
    </table>
  );
}

function PatientRecordRow({ patient }: { patient: Patient }) {
  const ICON_CLASS_STYLE = 'h-6 w-6';
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
        <PatientPhoto pictureUrl={patient.picture_url} />
      </td>
      <td>{patient.name}</td>
      <td>
        <div className="flex flex-col gap-2 md:flex-row">
          {/* vitals */}
          <Link
            href={`/vision/add-update-glasses?id=${patient.pk}&visit=${patient.last_visit_id}`}
          >
            <Button
              Icon={<PencilSquareIcon className={ICON_CLASS_STYLE} />}
              colour="green"
              variant="solid"
              text="Update glasses"
            />
          </Link>
          {/* record */}
          <Link href={`/records/patient-record?id=${patient.pk}`}>
            <Button
              Icon={<EyeIcon className={ICON_CLASS_STYLE} />}
              colour="indigo"
              variant="solid"
              text="Patient record"
            />
          </Link>
        </div>
      </td>
    </tr>
  );
}
