'use client';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import ReferralStateDropdown from '@/components/referrals/ReferralStateDropdown';
import { getReferral } from '@/data/referrals/getReferrals';
import { patchReferral } from '@/data/referrals/patchReferral';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralDetailsPage() {
  const { isLoading, withLoading } = useLoadingState(true);
  const [date, setDate] = useState<Date>();
  const [patient, setPatient] = useState<Patient>();
  const [referral, setReferral] = useState<Referral>();
  const [editable, setEditable] = useState<boolean>(false);

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

  function saveOutcome(outcome: string) {
    const patch = async () => {
      const payload = {
        referral_outcome: outcome,
      };
      patchReferral(payload, referral!.id.toString());
    };
    patch()
      .then(() => toast.success('Updated successfully!'))
      .catch(() => toast.error('Failed to update'));
  }

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
          <table>
            <tbody>
              <tr>
                <td>Referral State</td>
                <td>
                  <div>
                    {referral != undefined && (
                      <ReferralStateDropdown ref={referral} />
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td>Referral Date</td>
                <td>{new Date(date!).toDateString()}</td>
              </tr>
              <tr>
                <td>Referral For</td>
                <td>{referral?.referred_for}</td>
              </tr>
              <tr>
                <td>Referral Notes</td>
                <td>{referral?.referral_notes}</td>
              </tr>
              <tr>
                <td>Referral Outcome</td>
                {
                  <td>
                    <div className="flex">
                      {editable ? (
                        <textarea
                          value={referral!.referral_outcome}
                          onChange={item =>
                            setReferral({
                              ...referral!,
                              referral_outcome: item.target.value,
                            })
                          }
                        />
                      ) : (
                        referral?.referral_outcome
                      )}

                      {editable ? (
                        <Button
                          text="Save"
                          colour="green"
                          onClick={() => {
                            setEditable(false);
                            saveOutcome(referral!.referral_outcome);
                          }}
                        />
                      ) : (
                        <Button
                          text="Edit"
                          colour="green"
                          onClick={() => setEditable(true)}
                        />
                      )}
                    </div>
                  </td>
                }
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingPage>
    </div>
  );
}
