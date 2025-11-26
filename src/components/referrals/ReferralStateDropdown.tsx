import { LoadingUI } from '@/components/LoadingUI';
import { getConsultByID } from '@/data/consult/getConsult';
import { patchReferral } from '@/data/referrals/patchReferral';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Referral } from '@/types/Referral';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export function ReferralStateDropdown({ referral }: { referral: Referral }) {
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
    const fetchConsults = withLoading(async () => {
      await getConsultByID(referral.consult.toString())
        .then(() => {
          setReferralStatus(referral.referral_state || 'None');
        })
        .catch(e => console.log(e));
    });
    fetchConsults();
  }, [referral.consult, referral.referral_state]);

  function dropdownChanged(value: string) {
    const patch = withLoading(async () => {
      const payload = {
        referral_state: value,
      };
      await patchReferral(payload, referral.id.toString());
    });
    patch()
      .then(() => {
        setReferralStatus(value);
        toast.success('Updated successfully!');
      })
      .catch(() => toast.error('Failed to update'));
  }

  return (
    <div className="max-w-40">
      {isLoading ? (
        <LoadingUI message={referralStatus == '' ? 'Loading...' : 'Updating'} />
      ) : (
        <Select value={referralStatus} onValueChange={dropdownChanged}>
          <SelectTrigger
            name="status"
            id="status"
            className="w-full rounded border-2 border-black bg-white text-gray-900"
          >
            <SelectValue placeholder="Select status..." />
          </SelectTrigger>
          <SelectContent>
            {referralState.map(status => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
