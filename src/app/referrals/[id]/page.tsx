'use client';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientInfoHeaderSection } from '@/components/records/patient/PatientInfoHeaderSection';
import { ReferralStateDropdown } from '@/components/referrals/ReferralStateDropdown';
import { getReferral } from '@/data/referrals/getReferrals';
import { patchReferral } from '@/data/referrals/patchReferral';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Referral } from '@/types/Referral';
import { formatDate } from '@/utils/formatDate';
import { CheckIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ReferralDetailsPage() {
  const ICON_CLASS_STYLE = 'h-6 w-12';
  const { isLoading, withLoading } = useLoadingState(true);
  const [date, setDate] = useState<string>();
  const [patient, setPatient] = useState<Patient>();
  const [referral, setReferral] = useState<Referral>();
  const [editable, setEditable] = useState<boolean>(false);
  const [originalOutcome, setOriginalOutcome] = useState<string>('');

  const { id } = useParams();

  useEffect(() => {
    const fetchReferral = withLoading(async () => {
      if (id == null) {
        toast.error('No ID provided for referral');
        return;
      }
      const data = await getReferral(id.toString());
      setDate(data.date);
      setPatient(data.patient);
      setReferral(data.referral);
      setOriginalOutcome(data.referral.referral_outcome || '');
    });
    fetchReferral();
  }, [id, withLoading]);

  function handleEdit() {
    if (referral) {
      setOriginalOutcome(referral.referral_outcome || '');
      setEditable(true);
    }
  }

  function handleCancel() {
    if (referral) {
      setReferral({
        ...referral,
        referral_outcome: originalOutcome,
      });
      setEditable(false);
    }
  }

  function saveOutcome(outcome: string) {
    const patch = async () => {
      const payload = {
        referral_outcome: outcome,
      };
      if (referral == undefined) {
        toast.error('Error updating null referral');
        return;
      }
      patchReferral(payload, referral.id.toString());
    };
    patch()
      .then(() => toast.success('Updated successfully!'))
      .catch(() => toast.error('Failed to update'));
  }

  return (
    <div className="p-2">
      <h1 className="pt-4">Referral Details</h1>
      {patient != null ? (
        <PatientInfoHeaderSection patient={patient} />
      ) : (
        <h1>Loading patient...</h1>
      )}
      <hr className="my-2 w-full border-t-2" />
      <LoadingPage isLoading={isLoading}>
        <div className="p-2">
          <table>
            <tbody className="divide-y divide-gray-400">
              <tr>
                <td className="whitespace-nowrap">Referral State</td>
                <td>
                  <div>
                    {referral != undefined && (
                      <ReferralStateDropdown referral={referral} />
                    )}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap">Referral Date</td>
                <td>
                  {date == undefined ? 'No Date' : formatDate(date, 'date')}
                </td>
              </tr>
              <tr>
                <td className="whitespace-nowrap">Referral For</td>
                <td>{referral?.referred_for}</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap">Referral Notes</td>
                <td>{referral?.referral_notes}</td>
              </tr>
              <tr>
                <td className="whitespace-nowrap align-top">
                  Referral Outcome
                </td>
                {referral == undefined ? (
                  <p>No Referral Found</p>
                ) : (
                  <td className="w-full">
                    <div className="flex gap-2">
                      <textarea
                        value={referral?.referral_outcome || ''}
                        disabled={!editable}
                        rows={4}
                        placeholder="Enter referral outcome here..."
                        onChange={item =>
                          setReferral({
                            ...referral,
                            referral_outcome: item.target.value,
                          })
                        }
                        className="w-full"
                      />

                      {editable ? (
                        <div className="flex flex-col justify-between gap-1">
                          <IconButton
                            icon={<CheckIcon className={ICON_CLASS_STYLE} />}
                            colour="green"
                            variant="solid"
                            label="Save changes"
                            onClick={() => {
                              setEditable(false);
                              saveOutcome(referral.referral_outcome);
                            }}
                          />
                          <IconButton
                            icon={<XMarkIcon className={ICON_CLASS_STYLE} />}
                            colour="red"
                            variant="solid"
                            label="Cancel editing"
                            onClick={handleCancel}
                          />
                        </div>
                      ) : (
                        <div className="flex">
                          <IconButton
                            icon={<PencilIcon className={ICON_CLASS_STYLE} />}
                            colour="blue"
                            variant="solid"
                            label="Edit outcome"
                            onClick={handleEdit}
                          />
                        </div>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </LoadingPage>
    </div>
  );
}
