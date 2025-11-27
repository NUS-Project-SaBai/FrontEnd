'use client';
import { PatientPhoto } from '@/components/PatientPhoto';
import { UploadDocument } from '@/components/records/document/UploadDocument';
import { ViewDocument } from '@/components/records/document/ViewDocument';
import { VILLAGES_AND_ALL } from '@/constants';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
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
          setDocuments(data.files);
        })
      )(),
    [patient.pk, withLoadingDocuments]
  );
  useEffect(() => {
    if (patient.pk) {
      fetchDocuments();
    }
  }, [patient.pk, fetchDocuments]);

  return (
    <div className="flex">
      <div className="relative h-[15vw] w-[15vw]">
        <PatientPhoto
          pictureUrl={patient.picture_url}
          width={180}
          height={180}
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="m-2 flex flex-row gap-2">
          <h1 className="flex-1 content-center text-start">
            <span
              className={
                'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
              }
            >
              {patient.patient_id}
            </span>
            <span>, {patient.name}</span>
          </h1>
          <UploadDocument patient={patient} onUploadSuccess={fetchDocuments} />
          <ViewDocument
            documents={documents ?? []}
            setDocuments={setDocuments}
            isLoading={isLoadingDocuments}
          />
          <EditPatient patient={patient} />
        </div>
        <PatientDetails patient={patient} />
      </div>
    </div>
  );
}
