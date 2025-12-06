import { Button } from '@/components/Button';
import { CompactPatientTable } from '@/components/PatientActionTable';
import { Patient } from '@/types/Patient';
import { EyeIcon, PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export function PatientGlassesTable({ patients }: { patients: Patient[] }) {
  const ICON_CLASS_STYLE = 'h-6 w-6';

  return (
    <CompactPatientTable
      patients={patients}
      renderActions={patient => (
        <div className="flex flex-col gap-2 md:flex-row">
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
          <Link href={`/records/patient-record?id=${patient.pk}`}>
            <Button
              Icon={<EyeIcon className={ICON_CLASS_STYLE} />}
              colour="indigo"
              variant="solid"
              text="Patient record"
            />
          </Link>
        </div>
      )}
    />
  );
}
