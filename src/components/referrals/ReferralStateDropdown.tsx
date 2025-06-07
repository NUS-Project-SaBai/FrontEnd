import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferrals } from '@/data/referrals/patchReferral';
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
  );
}
