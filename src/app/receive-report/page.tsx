'use client';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { CompactPatientTable } from '@/components/PatientActionTable';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { Switch } from '@/components/ui/switch';
import { PatientListContext } from '@/context/PatientListContext';
import {
  getAllPdfConsults,
  getAllPdfConsultsByPatientId,
  getLatestPdfConsultByPatientId,
} from '@/data/consult/getPdfConsult';
import { patchPatient } from '@/data/patient/patchPatient';
import { Patient } from '@/types/Patient';
import {
  DocumentDuplicateIcon,
  DocumentIcon,
} from '@heroicons/react/24/outline';
import { Suspense, useCallback, useContext, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function ReceiveReportPage() {
  const {
    patients: allPatients,
    isLoading,
    setPatients,
  } = useContext(PatientListContext);
  const [queryPatients, setQueryPatients] = useState<Patient[]>([]);
  const [onlyReceive, setOnlyReceive] = useState<boolean>(false);
  const [savingIds, setSavingIds] = useState<Set<number>>(new Set());
  const [limit, setLimit] = useState<number>(50);
  const useFormReturn = useForm();

  const filteredPatients = useMemo(() => {
    const base = queryPatients.length ? queryPatients : allPatients;
    return onlyReceive
      ? base.filter(p => p.to_get_report).slice(0, limit)
      : base.slice(0, limit);
  }, [queryPatients, allPatients, onlyReceive, limit]);

  const handleSetReceive = useCallback(
    (patient: Patient) => async (val: boolean) => {
      console.log(`Setting patient ${patient.pk} to ${val}`);
      const fd = new FormData();
      fd.set('to_get_report', String(val));
      setSavingIds(prev => new Set(prev).add(patient.pk));
      await patchPatient(patient.pk, fd)
        .then(() => {
          setPatients(old =>
            old.map(p =>
              p.pk === patient.pk ? { ...p, to_get_report: val } : p
            )
          );
          toast.success(
            `Updated ${patient.patient_id} to ${val ? 'Receive' : 'Do not receive'}`
          );
        })
        .catch(err => {
          console.error(err);
          toast.error(`Failed to update preference for ${patient.pk}`);
        })
        .finally(() => {
          setSavingIds(prev => {
            const n = new Set(prev);
            n.delete(patient.pk);
            return n;
          });
        });
    },
    [setPatients]
  );

  return (
    <div className="p-4">
      <h1>Receive Report</h1>
      <Button
        text="Download All Reports"
        title="Download all consult for those who want to receive report"
        colour="orange"
        variant="solid"
        className="absolute right-4 top-5 z-10 shadow-md"
        onClick={() => {
          getAllPdfConsults().then(blobfile => {
            if (blobfile) {
              const url = URL.createObjectURL(blobfile.fileBlob);
              const downloadLink = document.createElement('a');
              downloadLink.href = url;
              downloadLink.download = blobfile.filename;
              document.body.appendChild(downloadLink);
              downloadLink.click();
              document.body.removeChild(downloadLink);
              URL.revokeObjectURL(url);
            }
          });
        }}
      />

      <div className="mb-3">
        <Suspense>
          <PatientSearchbar
            data={allPatients}
            setFilteredItems={setQueryPatients}
            filterFunction={useCallback(
              (query: string) => (item: Patient) =>
                item.patient_id.toLowerCase().includes(query.toLowerCase()) ||
                item.name.toLowerCase().includes(query.toLowerCase()),
              []
            )}
          />
        </Suspense>
      </div>

      <div className="mb-3 flex items-center gap-2">
        <input
          id="onlyReceive"
          type="checkbox"
          checked={onlyReceive}
          onChange={e => setOnlyReceive(e.target.checked)}
        />
        <label htmlFor="onlyReceive">
          Show only patients who should receive reports
        </label>
      </div>

      <LoadingPage isLoading={isLoading} message="Loading Patients...">
        {filteredPatients.length === 0 ? (
          <h1>No patients found</h1>
        ) : (
          <FormProvider {...useFormReturn}>
            <CompactPatientTable
              patients={filteredPatients}
              headers={{
                id: 'ID',
                photo: 'Photo',
                name: 'Full Name',
                extra: 'Receive Report',
                actions: 'Actions',
              }}
              renderActions={(patient: Patient) => (
                <div className="flex flex-col gap-2">
                  {savingIds.has(patient.pk) ? (
                    <LoadingUI message="Saving..." className="flex gap-x-2" />
                  ) : (
                    <div className="flex justify-evenly">
                      <label className="ml-2">Get Report?</label>
                      <Switch
                        className={
                          'data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500'
                        }
                        checked={patient.to_get_report}
                        onCheckedChange={handleSetReceive(patient)}
                      />
                    </div>
                  )}
                  <div className="flex gap-1">
                    <Button
                      Icon={<DocumentIcon className="w-7" />}
                      colour="blue"
                      text="Latest report"
                      onClick={() =>
                        getLatestPdfConsultByPatientId(patient.pk)
                          .then(blob => {
                            if (blob) {
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } else {
                              toast.error(
                                'No report available for this patient'
                              );
                            }
                          })
                          .catch((err: Error) => {
                            toast.error(
                              'Failed to fetch the report:\n' + err.message
                            );
                          })
                      }
                    />
                    <Button
                      Icon={<DocumentDuplicateIcon className="w-7" />}
                      colour="indigo"
                      text="All reports"
                      onClick={() =>
                        getAllPdfConsultsByPatientId(patient.pk)
                          .then(blob => {
                            if (blob) {
                              const url = URL.createObjectURL(blob);
                              window.open(url, '_blank');
                            } else {
                              toast.error(
                                'No reports available for this patient'
                              );
                            }
                          })
                          .catch((err: Error) => {
                            toast.error(
                              'Failed to fetch the report:\n' + err.message
                            );
                          })
                      }
                    />
                  </div>
                </div>
              )}
            />
          </FormProvider>
        )}
        <Button
          text="Load More"
          onClick={() => setLimit(prev => prev + 50)}
          className="w-full"
          colour="gray"
          variant="solid"
        />
      </LoadingPage>
    </div>
  );
}
