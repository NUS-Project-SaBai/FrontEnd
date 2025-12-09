'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { PatientRecordTable } from '@/components/records/PatientRecordTable';
import { NewPatientModal } from '@/components/registration/NewPatientModal';
import { PatientScanForm } from '@/components/registration/PatientScanForm';
import { PatientListContext } from '@/context/PatientListContext';
import { createPatient } from '@/data/patient/createPatient';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import {
  FormEvent,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export default function RecordPage() {
  const {
    patients: allPatients,
    isLoading: patientsLoading,
    refresh: refreshPatientList,
  } = useContext(PatientListContext);
  const { isLoading: isSubmitting, withLoading: submitWithLoading } =
    useLoadingState(false);
  const [faceFilteredPatients, setFaceFilteredPatients] = useState<
    Patient[] | null
  >(null);
  const [searchFilteredPatients, setSearchFilteredPatients] =
    useState<Patient[]>(allPatients);

  const [formDetails, setFormDetails, clearLocalStorageData] = useSaveOnWrite(
    'RegistrationForm',
    {} as FieldValues,
    []
  );

  const useFormReturn = useForm({
    values: formDetails,
    resetOptions: { keepDirtyValues: true },
  });

  useEffect(() => {
    const unsub = useFormReturn.subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        setFormDetails(values);
      },
    });
    return () => {
      unsub();
      useFormReturn.reset({});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();

    useFormReturn.handleSubmit(
      //onValid
      submitWithLoading(async fieldValues => {
        Object.entries(fieldValues).map(([key, value]) =>
          formData.append(key, value)
        );
        formData.append(
          'picture',
          await urlToFile(
            fieldValues.picture,
            'patient_screenshot.jpg',
            'image/jpg'
          )
        );
        formData.set('to_get_report', fieldValues.to_get_report === 'Yes' ? 'true' : 'false');
        const patient = await createPatient(formData);
        if (patient == null) {
          toast.error('Unknown error creating patient');
          return;
        }
        useFormReturn.reset({ village_prefix: fieldValues.village_prefix });
        clearLocalStorageData();

        toast.success('Patient Created!');
        toast.success('New Visit Created!');
        refreshPatientList();
      }),
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  const cancelFilteringByFace = () => {
    setFaceFilteredPatients(null);
  };

  function setRegistrationFace(picture: string | null) {
    setFormDetails(old => ({ ...old, picture }))
  }

  const filteringByFace = faceFilteredPatients !== null;

  const searchablePatients = useMemo(() => {
    if (!faceFilteredPatients) return allPatients
    const pks = faceFilteredPatients?.map((v) => v.pk)
    return allPatients.filter((v) => pks?.includes(v.pk))
  }, [allPatients, faceFilteredPatients]);

  return (
    <div className="flex h-full flex-col">
      <h1 className="-mb-2">Patients</h1>
      <div className="z-1 sticky top-0 w-full bg-white p-2 drop-shadow-lg">
        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Suspense>
            <PatientSearchbar
              data={searchablePatients}
              filteringByFace={filteringByFace}
              cancelFilteringByFace={cancelFilteringByFace}
              setFilteredItems={setSearchFilteredPatients}
              filterFunction={useCallback(
                (query: string) => (item: Patient) =>
                  item.patient_id.toLowerCase().includes(query.toLowerCase()) ||
                  item.name.toLowerCase().includes(query.toLowerCase()),
                []
              )}
            />
          </Suspense>
          <div className="flex h-[40px] gap-2 sm:self-end">
            <FormProvider {...useFormReturn}>
              <NewPatientModal
                onSubmit={onPatientRegistrationFormSubmit}
                isSubmitting={isSubmitting}
              />
            </FormProvider>
            <PatientScanForm setFilteredPatients={setFaceFilteredPatients}
              setRegistrationFace={setRegistrationFace} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-2 overflow-auto">
        <LoadingPage
          isLoading={patientsLoading || isSubmitting}
          message="Loading Patients..."
        >
          <PatientRecordTable displayedPatients={searchFilteredPatients} />
        </LoadingPage>
      </div>
    </div>
  );
}
