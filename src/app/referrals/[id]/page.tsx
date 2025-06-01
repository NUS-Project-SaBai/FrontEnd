//current path: referrals/referral/
//todo: path: referrals/referral?id=x
'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { ViewDocument } from '@/components/records/ViewDocument';
import { getReferral } from '@/data/referrals/getReferrals';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import Image from 'next/image';
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
      setDate(data?.date);
      setPatient(data?.patient);
      setReferral(data?.referral);
    });
    fetchReferral();
  }, []);

  return (
    <LoadingPage isLoading={isLoading}>
      <h1>Referral Details</h1>
      <p>Referral ID: {referral?.id}</p>
      <p>Referral State: {referral?.referral_state}</p>
      <p>Consult ID: {referral?.consult}</p>
      <p>Referral date: {date?.toString()}</p>
      <h2>Patient Information</h2>
      <textarea value={referral?.referral_comments} readOnly></textarea>

      {patient == null || patient == undefined ? (
        <p>Loading picture...</p>
      ) : (
        <Image
          src={patient?.picture}
          width={180}
          height={180}
          alt="Patient Picture"
        />
      )}

      <p>Patient Name: {patient?.name}</p>
      <p>Patient DOB: {patient?.date_of_birth}</p>

      <ViewDocument patient={patient!} />
    </LoadingPage>
  );
}
