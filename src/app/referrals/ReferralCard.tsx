import { Button } from '@/components/Button';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferrals } from '@/data/referrals/patchReferral';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralCard({
  ref,
  patient,
  date,
}: {
  ref: Referral;
  patient: Patient;
  date: Date;
}) {
  const referralState = [
    'None',
    'New',
    'Seen',
    'Outgoing',
    'Completed',
    'CompletedSuccess',
    'CompletedFailure',
  ];

  const [referralStatus, setReferralStatus] = useState<string>('');

  useEffect(() => {
    const fetchConsults = async () => {
      getConsultByID(ref.consult.toString())
        .then(() => {
          setReferralStatus(ref.referral_state);
        })
        .catch(e => console.log(e));
    };
    fetchConsults();
  }, []);

  function dropdownChanged(e: ChangeEvent<HTMLSelectElement>) {
    const patchReferral = async () => {
      const payload = {
        ...ref,
        referral_state: e.target.value,
      };
      patchReferrals(payload, ref.id.toString());
    };
    patchReferral()
      .then(() => toast.success('Updated successfully!'))
      .catch(() => toast.error('Failed to update'));
  }

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
          <div>
            <select
              name="status"
              id="status"
              onChange={e => dropdownChanged(e)}
              className="w-full rounded border-2 p-1"
            >
              {referralState.map(status =>
                status == referralStatus ? (
                  <option key={status} value={status} selected>
                    {status}
                  </option>
                ) : (
                  <option key={status} value={status}>
                    {status}
                  </option>
                )
              )}
            </select>
          </div>
        </div>
      </td>
    </tr>
  );
}
