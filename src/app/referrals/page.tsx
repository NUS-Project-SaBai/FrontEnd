'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInputByReferral } from '@/components/referrals/PatientSearchbarByReferral';
import { ReferralWithDetails } from '@/data/referrals/getReferrals';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Suspense, useState } from 'react';
import ReferralCard from './ReferralCard';

export default function ReferralPage() {
  const [referralWithDetails, setReferralsWithPatient] = useState<
    ReferralWithDetails[]
  >([]);
  const { isLoading, withLoading } = useLoadingState(true);

  return (
    <div className="p-2">
      <h1>Referrals</h1>
      <Suspense>
        <PatientSearchInputByReferral
          isLoading={isLoading}
          withLoading={withLoading}
          setReferrals={setReferralsWithPatient}
        />
      </Suspense>
      {isLoading ? (
        <LoadingUI message="Loading referrals..." />
      ) : referralWithDetails.length == 0 ? (
        <h2>No referrals</h2>
      ) : (
        <table className="w-full divide-y-2 divide-gray-500">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Referral Summary</th>
              <th>To details</th>
              <th>Referral Status</th>
            </tr>
          </thead>
          <tbody>
            {referralWithDetails.map(referral => (
              <ReferralCard
                key={referral.referral.id}
                referral={referral.referral}
                patient={referral.patient}
                date={referral.date}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
