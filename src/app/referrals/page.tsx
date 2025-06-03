'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientSearchInputByReferral } from '@/components/referrals/PatientSearchbarByReferral';
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
        <Suspense>
          <PatientSearchInputByReferral
            setReferrals={setReferralsWithPatient}
          />
        </Suspense>

        {referralWithDetails!.map(ref => (
          <ReferralCard
            key={ref.referral.id}
            ref={ref.referral}
            patient={ref.patient}
            date={ref.date}
          />
        ))}
      </div>
    </LoadingPage>
  );
}
