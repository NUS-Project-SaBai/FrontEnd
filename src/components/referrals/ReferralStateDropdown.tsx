import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferral } from '@/data/referrals/patchReferral';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Referral } from '@/types/Referral';
import { ChangeEvent, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { LoadingUI } from '../LoadingUI';

export default function ReferralStateDropdown({
  referral,
}: {
  referral: Referral;
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
  const { isLoading, withLoading } = useLoadingState(false);

  useEffect(() => {
    const fetchConsults = async () => {
      getConsultByID(referral.consult.toString())
        .then(() => {
          setReferralStatus(referral.referral_state);
        })
        .catch(e => console.log(e));
    };
    fetchConsults();
  }, []);

  function dropdownChanged(e: ChangeEvent<HTMLSelectElement>) {
    const patch = withLoading(async () => {
      const payload = {
        referral_state: e.target.value,
      };
      await patchReferral(payload, referral.id.toString());
    });
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
      ) : isLoading ? (
        <LoadingUI message="Updating" />
      ) : (
        <select
          name="status"
          id="status"
          defaultValue={referralStatus}
          onChange={e => dropdownChanged(e)}
          className="w-full rounded border-2 border-black p-1"
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
