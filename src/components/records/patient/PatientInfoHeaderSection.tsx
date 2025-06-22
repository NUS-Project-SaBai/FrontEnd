'use server';
import { EditPatient } from '@/app/records/patient-record/EditPatient';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';
import Image from 'next/image';
import { UploadDocument } from '../UploadDocument';
import { ViewDocument } from '../ViewDocument';
import { PatientDetails } from './PatientDetails';

export async function PatientInfoHeaderSection({
  patient,
}: {
  patient: Patient;
}) {
  return (
    <div className="flex">
      <div className="relative h-[15vw] w-[15vw]">
        <Image
          src={patient.picture}
          alt="Patient Picture"
          fill
          className="rounded object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="m-2 flex flex-row gap-2">
          <div className="flex-1 content-center text-2xl">
            <span
              className={
                'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
              }
            >
              {patient.patient_id}
            </span>
            <span>, {patient.name}</span>
          </div>
          <UploadDocument patient={patient} />
          <ViewDocument patient={patient} />
          <EditPatient patient={patient} />
        </div>
        <PatientDetails patient={patient} />
      </div>
    </div>
  );
}
