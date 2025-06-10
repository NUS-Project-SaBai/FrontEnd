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
      setReferralsWithPatient(data);

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

        {referralWithDetails.length == 0 ? (
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
              {referralWithDetails.map(ref => (
                <ReferralCard
                  key={ref.referral.id}
                  ref={ref.referral}
                  patient={ref.patient}
                  date={ref.date}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </LoadingPage>
  );
}
