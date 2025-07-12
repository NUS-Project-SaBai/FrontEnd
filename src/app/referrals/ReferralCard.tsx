import { Button } from '@/components/Button';
import ReferralStateDropdown from '@/components/referrals/ReferralStateDropdown';
import { VILLAGES } from '@/constants';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import Image from 'next/image';
import Link from 'next/link';

export default function ReferralCard({
  referral,
  patient,
  date,
}: {
  referral: Referral;
  patient: Patient;
  date: Date;
}) {
  return (
    <tr>
      <td>
        {patient == null ? (
          <p>Loading patient</p>
        ) : (
          <Image
            src={patient.picture_url}
            alt="Patient Picture"
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
              Visited on: {new Date(date).toDateString()}
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
