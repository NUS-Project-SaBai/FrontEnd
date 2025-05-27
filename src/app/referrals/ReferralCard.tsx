import { Button } from '@/components/Button';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferrals } from '@/data/referrals/patchReferral';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import Image from 'next/image';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralCard({
  ref,
  pat,
  date,
}: {
  ref: Referral;
  pat: Patient;
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

  const [patient, setPatient] = useState<Patient | null>();
  const [referralStatus, setReferralStatus] = useState<string>('');

  useEffect(() => {
    const fetchConsults = async () => {
      getConsultByID(ref.consult.toString())
        .then(() => {
          setReferralStatus(ref.referral_state);
          setPatient(pat);
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
    <div className="flex">
      {patient == null ? (
        <p>Loading patient</p>
      ) : (
        <Image
          src={pat.picture}
          alt="Patient Picture"
          width={180}
          height={180}
        />
      )}

      <div className="grid items-center justify-center">
        <div>
          <p>Patient ID: {pat.identification_number}</p>
          <p>Name: {pat.name}</p>
          <p>Visited on: {date.toString()}</p>
        </div>
      </div>

      <div className="grid items-center justify-center">
        <Button text="To form" />
      </div>

      <div className="grid items-center justify-center">
        <div>
          <label htmlFor="status">Referral status:</label>
          <select name="status" id="status" onChange={e => dropdownChanged(e)}>
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
    </div>
  );
}
