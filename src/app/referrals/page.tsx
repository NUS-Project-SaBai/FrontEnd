'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import {
  getReferrals,
  ReferralWithDetails,
} from '@/data/referrals/getReferrals';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Suspense, useEffect, useState } from 'react';
import ReferralCard from './ReferralCard';

export default function ReferralPage() {
  const [referralWithDetails, setReferralsWithPatient] = useState<
    ReferralWithDetails[]
  >([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    const patientsTemp: Patient[] = [];
    const fetchReferrals = withLoading(async () => {
      const data = await getReferrals();
      setReferralsWithPatient(data!);

      referralWithDetails.forEach(item => patients.push(item.patient));
      setPatients(patientsTemp);
    });
    fetchReferrals();
  }, []);

  return (
    <LoadingPage isLoading={isLoading} message="Loading referrals...">
      <div className="p-2">
        <h1>Referrals</h1>
        {/* todo: make search bar filter */}
        <Suspense>
          <PatientSearchInput setPatients={setPatients} />
        </Suspense>
        {referralWithDetails.length == 0 ? (
          <h1>No referrals</h1>
        ) : (
          referralWithDetails!.map(ref => (
            <ReferralCard
              key={ref.referral.id}
              ref={ref.referral}
              pat={ref.patient}
              date={ref.date}
            />
          ))
        )}
      </div>
    </LoadingPage>
  );
}
