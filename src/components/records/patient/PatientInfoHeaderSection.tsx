'use server';
import PatientPhoto from '@/components/PatientPhoto';
import { EditPatient } from '@/components/records/patient/EditPatient';
import { PatientDetails } from '@/components/records/patient/PatientDetails';
import { UploadDocument } from '@/components/records/UploadDocument';
import { ViewDocument } from '@/components/records/ViewDocument';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';

export async function PatientInfoHeaderSection({
  patient,
}: {
  patient: Patient;
}) {
  return (
    <div className="flex">
      <div className="relative h-[15vw] w-[15vw]">
        <PatientPhoto
          pictureUrl={patient.picture_url}
          fill
          className="rounded object-cover"
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
          <UploadDocument patient={patient} />
          <ViewDocument patient={patient} />
          <EditPatient patient={patient} />
        </div>
        <PatientDetails patient={patient} />
      </div>
    </div>
  );
}
