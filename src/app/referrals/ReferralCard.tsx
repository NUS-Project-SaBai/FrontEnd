import { Button } from '@/components/Button';
import ReferralStateDropdown from '@/components/referrals/ReferralStateDropdown';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import Image from 'next/image';
import Link from 'next/link';

export default function ReferralCard({
  ref,
  patient,
  date,
}: {
  ref: Referral;
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
            src={patient.picture}
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
              Patient ID: {patient.identification_number}
            </p>
            <p className="text-center">Name: {patient.name}</p>
            <p className="text-center">Visited on: {date.toString()}</p>
          </div>
        </div>
      </td>
      <td>
        <div className="grid items-center justify-center p-2">
          <Link href={`./referrals/${ref.id}`}>
            <Button text="Details" />
          </Link>
        </div>
      </td>
      <td>
        <div className="grid items-center justify-center p-2">
          <ReferralStateDropdown ref={ref} />
        </div>
      </td>
    </tr>
  );
}
