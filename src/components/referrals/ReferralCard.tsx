import { Button } from '@/components/Button';
import { PatientPhoto } from '@/components/PatientPhoto';
import { ReferralStateDropdown } from '@/components/referrals/ReferralStateDropdown';
import { VILLAGES } from '@/constants';
import { getConsultByID } from '@/data/consult/getConsult';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { formatDate } from '@/utils/formatDate';
import { PencilSquareIcon, EyeIcon } from '@heroicons/react/24/outline';
import { ClipboardList } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function ReferralCard({
  referral,
  patient,
  date,
  onGeneratePDF,
}: {
  referral: Referral;
  patient: Patient;
  date: string;
  onGeneratePDF: () => void;
}) {

  const router  = useRouter();

  return (
    <tr>
      <td>
        {patient == null ? (
          <p>Loading patient</p>
        ) : (
          <PatientPhoto
            pictureUrl={patient.picture_url}
            width={180}
            height={180}
            className="justify-self-center"
          />
        )}
      </td>
      <td>
        <div className="grid items-center justify-center p-2">
          <div className="grid justify-center">
            <p className="text-center">
              Patient ID:&nbsp;
              <span
                className={
                  'font-bold ' + VILLAGES[patient.village_prefix].color
                }
              >
                {patient.patient_id}
              </span>
            </p>
            <p className="text-center">Name: {patient.name}</p>
            <p className="text-center">
              Visited on: {formatDate(date, 'date')}
            </p>
          </div>
        </div>
      </td>
      <td className="align-middle">
        <div className="flex flex-col items-center justify-center space-y-2 p-3">
          <Link href={`./referrals/${referral.id}`}>
            <Button
              text="Referral Details"
              colour="green"
              Icon={<PencilSquareIcon className="h-5 w-5" />}
            />
          </Link>
          <Button
            text="Consult PDF"
            Icon={<ClipboardList className="h-5 w-5" />}
            onClick={() => onGeneratePDF()}
            colour="indigo"
          />
          <Button 
            text="Go to consult"
            Icon={<EyeIcon className="h-5 w-5" />}
            onClick={async () => {
              const consultId = referral.consult;
              const consult = await getConsultByID(consultId.toString());
              const visitId = consult?.visit.id;
              router.push(`/records/patient-consultation?id=${patient.pk}&visit=${visitId}`)
            }}
            colour="blue"
          />

        </div>
      </td>
      <td className="w-48">
        <ReferralStateDropdown referral={referral} />
      </td>
    </tr>
  );
}
