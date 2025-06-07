import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferral } from '@/data/referrals/patchReferral';
import { Referral } from '@/types/Referral';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralStateDropdown({ ref }: { ref: Referral }) {
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
    const patch = async () => {
      const payload = {
        referral_state: e.target.value,
      };
      patchReferral(payload, ref.id.toString());
    };
    patch()
      .then(() => {
        setReferralStatus(e.target.value);
        toast.success('Updated successfully!');
      })
      .catch(() => toast.error('Failed to update'));
  }

  return (
    <div className="max-w-40">
      {referralStatus == '' ? (
        <p>Loading...</p>
      ) : (
        <select
          name="status"
          id="status"
          defaultValue={referralStatus}
          onChange={e => dropdownChanged(e)}
          className="w-full rounded border-2 border-green-500 bg-green-500 p-1 text-white"
        >
          {referralState.map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
