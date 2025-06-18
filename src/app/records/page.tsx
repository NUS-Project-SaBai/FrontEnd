'use client';
import { PatientRecordTable } from '@/app/records/PatientRecordTable';
import { Button } from '@/components/Button';
import { LoadingPage } from '@/components/LoadingPage';
import { LoadingUI } from '@/components/LoadingUI';
import { PatientSearchInput } from '@/components/PatientSearchbar';
import { PatientForm } from '@/components/records/patient/PatientForm';
import { PatientInfo } from '@/components/records/patient/PatientInfo';
import { createPatient } from '@/data/patient/createPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useToggle } from '@/hooks/useToggle';
import { Patient } from '@/types/Patient';
import { urlToFile } from '@/utils/urlToFile';
import { FormEvent, Suspense, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';
import { PatientScanForm } from '../registration/PatientScanForm';

export default function RecordPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const { isLoading, withLoading } = useLoadingState(true);
  const useFormReturn = useForm({ resetOptions: { keepDirtyValues: true } });
  const [isPatientFormOpen, togglePatientFormOpen] = useToggle(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const onPatientRegistrationFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);

    useFormReturn.handleSubmit(
      //onValid
      async fieldValues => {
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
        useFormReturn.reset();
        toast.success('Patient Created!');
        // TODO: implement check for recent visit
        createVisit(patient);
        toast.success('New Visit Created!');
        togglePatientFormOpen();
        // refreshPatientList();
      },
      // onInvalid
      () => {
        toast.error('Missing Input');
      }
    )();
  };

  return (
    <div>
      <h1 className="-mb-2">Patients</h1>
      <div className="z-1 sticky top-0 bg-white p-2 drop-shadow-md">
        <div className="flex gap-x-2">
          <Suspense fallback={<LoadingUI message="Loading search input..." />}>
            <PatientSearchInput
              setPatients={setPatients}
              isLoading={isLoading}
              withLoading={withLoading}
            />
            <div className="flex flex-shrink gap-2">
              <Button
                colour="green"
                onClick={togglePatientFormOpen}
                text={'New Patient'}
              />
              <PatientScanForm setSelectedPatient={setSelectedPatient} />
            </div>
          </Suspense>
        </div>
      </div>
      <div className="p-2">
        <LoadingPage isLoading={isLoading} message="Loading Patients...">
          <PatientInfo patient={selectedPatient} />
          <PatientRecordTable patients={patients} />
        </LoadingPage>
        <ReactModal isOpen={isPatientFormOpen} ariaHideApp={false}>
          <FormProvider {...useFormReturn}>
            <PatientForm onSubmit={onPatientRegistrationFormSubmit} />
          </FormProvider>
          <Button colour="red" onClick={togglePatientFormOpen} text="Close" />
        </ReactModal>
      </div>
    </div>
  );

  // return (
  //   <div className="space-y-10">
  //     {/* Some tall content above */}
  //     <section className="flex h-64 items-center justify-center bg-gray-100">
  //       <p className="text-xl">Intro Content Above</p>
  //     </section>

  //     {/* Sticky Section */}
  //     <section className="relative">
  //       <h2 className="mb-4 text-2xl font-bold">User Table</h2>

  //       {/* Scrollable wrapper only for the table rows */}
  //       <div className="max-h-96 overflow-auto rounded-md border">
  //         <table className="min-w-full table-auto">
  //           <thead className="sticky top-0 z-10 bg-white">
  //             <tr>
  //               <th className="relative p-2 text-left">
  //                 Name
  //                 <div className="absolute bottom-0 left-0 w-full border-b border-black" />
  //               </th>
  //               <th className="relative p-2 text-left">
  //                 Age
  //                 {/* <div className="absolute bottom-0 left-0 w-full border-b border-black" /> */}
  //               </th>
  //             </tr>
  //           </thead>

  //           <tbody>
  //             {Array.from({ length: 30 }, (_, i) => (
  //               <tr key={i} className="odd:bg-gray-50">
  //                 <td className="border-b p-2">User {i + 1}</td>
  //                 <td className="border-b p-2">{20 + (i % 10)}</td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       </div>
  //     </section>

  //     {/* Some more content below */}
  //     <section className="flex h-64 items-center justify-center bg-gray-200">
  //       <p className="text-xl">More Content Below</p>
  //     </section>
  //   </div>
  // );
}
