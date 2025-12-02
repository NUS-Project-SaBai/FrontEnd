'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { CompactPatientTableGeneric } from '@/components/PatientActionTable';
import { ReferralStateDropdown } from '@/components/referrals/ReferralStateDropdown';
import { PatientSearchInputByReferral } from '@/components/referrals/PatientSearchbarByReferral';
import { getPdfConsult } from '@/data/consult/getPdfConsult';
import { ReferralWithDetails } from '@/data/referrals/getReferrals';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ClipboardList } from 'lucide-react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Button } from '@/components/Button';
import { formatDate } from '@/utils/formatDate';
import { Suspense, useState } from 'react';

export default function ReferralPage() {
  const [referralWithDetails, setReferralsWithPatient] = useState<
    ReferralWithDetails[]
  >([]);
  const { isLoading, withLoading } = useLoadingState(true);

  const handleGeneratePDF = (referralDetail: ReferralWithDetails) => {
    console.log('Generate referral pdf button pressed');
    getPdfConsult(referralDetail.referral.consult).then(payload => {
      console.log('Referral payload: ', payload);
      if (payload == null) return;
      const url = URL.createObjectURL(payload);
      window.open(url, '_blank');
    });
  };

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
            <CompactPatientTableGeneric
              items={referralWithDetails}
              getPatient={item => item.patient}
              getKey={item => item.referral.id}
              headers={{ id: 'ID', photo: 'Photo', name: 'Full Name', extra: 'Referral', actions: 'Actions' }}
              extraColumn={item => (
                <div className="flex flex-col gap-2">
                  <p>Visited on: {formatDate(item.date, 'date')}</p>
                  <ReferralStateDropdown referral={item.referral} />
                </div>
              )}
              renderActions={item => (
                <div className="flex flex-col items-center justify-center space-y-2 p-3">
                  <Link href={`./referrals/${item.referral.id}`}>
                    <Button
                      text="Referral Details"
                      colour="green"
                      Icon={<PencilSquareIcon className="h-5 w-5" />}
                    />
                  </Link>
                  <Button
                    text="Consult PDF"
                    Icon={<ClipboardList className="h-5 w-5" />}
                    onClick={() => handleGeneratePDF(item)}
                    colour="indigo"
                  />
                </div>
              )}
            />
      )}
    </div>
  );
}
