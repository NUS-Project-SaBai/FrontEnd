'use client';
import { PatientPhoto } from '@/components/PatientPhoto';
import { UploadDocument } from '@/components/records/document/UploadDocument';
import { ViewDocument } from '@/components/records/document/ViewDocument';
import { VILLAGES_AND_ALL } from '@/constants';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { UploadFile } from '@/types/UploadFile';
import { useCallback, useEffect, useState } from 'react';
import { EditPatient } from './EditPatient';
import { PatientDetails } from './PatientDetails';

export function PatientInfoHeaderSection({ patient }: { patient: Patient }) {
  const [documents, setDocuments] = useState<UploadFile[]>([]);

  const { isLoading: isLoadingDocuments, withLoading: withLoadingDocuments } =
    useLoadingState(false);
  const fetchDocuments = useCallback(
    () =>
      withLoadingDocuments(async () =>
        getUploadByPatientId(patient.pk).then(data => {
          setDocuments(data?.files ?? []);
        })
      )(),
    [patient.pk, withLoadingDocuments]
  );
  useEffect(() => {
    fetchDocuments();
  }, [patient.pk, fetchDocuments]);

  return (
    <div className="flex flex-col">
      <div className="m-2 flex flex-row gap-2 flex-wrap">
        <div className="relative h-[15vw] w-[15vw] min-h-20 min-w-20 max-h-40 max-w-40">
          <PatientPhoto
            pictureUrl={patient.picture_url}
            width={180}
            height={180}
          />
        </div>
        <h1 className="flex-1 text-start">
          <span
            className={
              'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
            }
          >
            {patient.patient_id}
          </span>
          <span>, {patient.name}</span>
        </h1>
        {/* <div className="flex flex-wrap gap-2"> */}
        <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
          <UploadDocument patient={patient} onUploadSuccess={fetchDocuments} />
          <ViewDocument
            documents={documents}
            setDocuments={setDocuments}
            isLoading={isLoadingDocuments}
          />
          <EditPatient patient={patient} /></div>
      </div>
      <PatientDetails patient={patient} />
    </div>
  );
}
