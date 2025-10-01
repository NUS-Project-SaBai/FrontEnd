'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { PatientSearchbar } from '@/components/PatientSearchbar';
import { PatientRecordTable } from '@/components/records/PatientRecordTable';
import { NewPatientModal } from '@/components/registration/NewPatientModal';
import { PatientScanForm } from '@/components/registration/PatientScanForm';
import { PatientListContext } from '@/context/PatientListContext';
import { createPatient } from '@/data/patient/createPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useSaveOnWrite } from '@/hooks/useSaveOnWrite';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, Suspense, useContext, useEffect, useState } from 'react';
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
    const formData = new FormData(event.target as HTMLFormElement);

    useFormReturn.handleSubmit(
      //onValid
      submitWithLoading(async fieldValues => {
        formData.append(
          'picture',
          await urlToFile(
            fieldValues.picture,
            'patient_screenshot.jpg',
            'image/jpg'
          )
        );
        const patient = await createPatient(formData);
        if (patient == null) {
          toast.error('Unknown error creating patient');
          return;
        }
        useFormReturn.reset({});
        clearLocalStorageData();

        toast.success('Patient Created!');
        // TODO: implement check for recent visit
        createVisit(patient);
        toast.success('New Visit Created!');
        // togglePatientFormOpen(); // can't trigger the modal to open with this configuration
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

  const filteringByFace = faceFilteredPatients !== null;

  return (
    <div className="flex h-full flex-col overflow-auto">
      <h1 className="-mb-2">Patients</h1>
      <div className="z-1 sticky top-0 bg-white p-2 drop-shadow-lg">
        <div className="flex gap-x-2">
          <Suspense>
            <PatientSearchbar
              data={faceFilteredPatients ?? allPatients}
              filteringByFace={filteringByFace}
              cancelFilteringByFace={cancelFilteringByFace}
              setFilteredItems={setSearchFilteredPatients}
              filterFunction={(query: string) => (item: Patient) =>
                item.patient_id.toLowerCase().includes(query.toLowerCase()) ||
                item.name.toLowerCase().includes(query.toLowerCase())
              }
            />
          </Suspense>
          <div className="flex h-[40px] gap-2 self-end">
            <FormProvider {...useFormReturn}>
              <NewPatientModal
                onSubmit={onPatientRegistrationFormSubmit}
                isSubmitting={isSubmitting}
              />
            </FormProvider>
            <PatientScanForm setFilteredPatients={setFaceFilteredPatients} />
          </div>
        </div>
      </div>
      <div className="flex flex-1 p-2">
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
