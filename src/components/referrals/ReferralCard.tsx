import { Button } from '@/components/Button';
import { ReferralStateDropdown } from '@/components/referrals/ReferralStateDropdown';
import { VILLAGES } from '@/constants';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import PatientPhoto from '../PatientPhoto';

export function ReferralCard({
  referral,
  patient,
  date,
}: {
  referral: Referral;
  patient: Patient;
  date: string;
}) {
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
      <td>
        <div className="grid items-center justify-center p-2">
          <Link href={`./referrals/${referral.id}`}>
            <Button text="Details" colour="blue" />
          </Link>
        </div>
      </td>
      <td>
        <div className="grid items-center justify-center p-2">
          <ReferralStateDropdown referral={referral} />
        </div>
      </td>
    </tr>
  );
}
