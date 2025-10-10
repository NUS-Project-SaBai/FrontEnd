'use client';
import { PatientPhoto } from '@/components/PatientPhoto';
import { UploadDocument } from '@/components/records/UploadDocument';
import { ViewDocument } from '@/components/records/ViewDocument';
import { VILLAGES_AND_ALL } from '@/constants';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { Patient } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { useState } from 'react';
import { EditPatient } from './EditPatient';
import { PatientDetails } from './PatientDetails';

export function PatientInfoHeaderSection({ patient }: { patient: Patient }) {
  const [documents, setDocuments] = useState<Upload[]>([]);

  const fetchDocuments = () => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  };

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
          <ViewDocument documents={documents} setDocuments={setDocuments} />
          <EditPatient patient={patient} />
        </div>
        <PatientDetails patient={patient} />
      </div>
    </div>
  );
}
