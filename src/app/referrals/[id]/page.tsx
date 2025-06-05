'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { getReferral } from '@/data/referrals/getReferrals';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReferralDetailsPage() {
  const { isLoading, withLoading } = useLoadingState(true);
  const [date, setDate] = useState<Date>();
  const [patient, setPatient] = useState<Patient>();
  const [referral, setReferral] = useState<Referral>();

  const params = useParams();
  const id = params.id;

  useEffect(() => {
    const fetchReferral = withLoading(async () => {
      const data = await getReferral(id!.toString());
      setDate(data!.date);
      setPatient(data!.patient);
      setReferral(data!.referral);
    });
    fetchReferral();
  }, []);

  return (
    <div className="p-2">
      <h1 className="pt-4">Referral Details</h1>
      {patient != null ? (
        <PatientInfoHeaderSection patient={patient!} showVisit={false} />
      ) : (
        <h1>Loading patient...</h1>
      )}
      <hr className="my-2 w-full border-t-2" />
      <LoadingPage isLoading={isLoading}>
        <div className="p-2">
          <p>Referral State: {referral?.referral_state}</p>
          <p>Referral Date: {date?.toString()}</p>
          <p>Referral Comments: {referral?.referral_comments}</p>
        </div>
      </LoadingPage>
    </div>
  );
}
