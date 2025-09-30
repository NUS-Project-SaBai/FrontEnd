'use client';
import { LoadingUI } from '@/components/LoadingUI';
import PatientPhoto from '@/components/PatientPhoto';
import { UploadDocument } from '@/components/records/UploadDocument';
import { ViewDocument } from '@/components/records/ViewDocument';
import { VisitDropdown } from '@/components/VisitDropdown';
import { VILLAGES_AND_ALL } from '@/constants';
import { getUploadByPatientId } from '@/data/fileUpload/getUpload';
import { getVisitsByPatientId } from '@/data/visit/getVisit';
import { WithLoadingType } from '@/hooks/useLoadingState';
import { Patient, getPatientAge } from '@/types/Patient';
import { Upload } from '@/types/Upload';
import { Visit } from '@/types/Visit';
import { useEffect, useState } from 'react';

export function PatientInfoHeaderSection({
  patient,
  withLoading = x => x,
  showVisit = true,
}: {
  patient: Patient;
  withLoading?: WithLoadingType;
  showVisit?: boolean;
}) {
  const [visits, setVisits] = useState<Visit[] | null>(null);
  const [documents, setDocuments] = useState<Upload[]>([]);

  const fetchDocuments = () => {
    getUploadByPatientId(patient.pk).then(data => {
      setDocuments(data);
    });
  };

  useEffect(() => {
    if (showVisit) {
      withLoading(getVisitsByPatientId)(patient.pk.toString()).then(vs =>
        setVisits(vs)
      );
    }
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.pk]);

  const age = getPatientAge(patient);

  return (
    <div className="flex">
      <PatientPhoto pictureUrl={patient.picture_url} width={180} height={180} />
      <div className="grid grid-cols-[2fr,3fr] grid-rows-2 gap-x-8 pl-8 text-2xl">
        <div>
          <p>ID:</p>
          <p
            className={
              'font-bold ' + VILLAGES_AND_ALL[patient.village_prefix].color
            }
          >
            {patient.patient_id}
          </p>
        </div>

        <div>
          <p>Name:</p>
          <p>{patient.name}</p>
        </div>

        {showVisit &&
          (visits == null ? (
            <div className="w-fit text-nowrap text-lg">
              <LoadingUI message="Loading Visits..." />
            </div>
          ) : visits.length == 0 ? (
            <div>
              <p>No Visits Found</p>
            </div>
          ) : (
            <div>
              <VisitDropdown name="visit_date" visits={visits} />
            </div>
          ))}

        <div>
          <p>Age:</p>
          <p className="text-lg">
            <span className="font-bold">{age.year}</span>
            <span> YEARS </span>
            <span className="font-bold">{age.month}</span>
            <span> MONTHS </span>
            <span className="font-bold">{age.day}</span>
            <span> DAYS </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <UploadDocument patient={patient} onUploadSuccess={fetchDocuments} />
        <ViewDocument documents={documents} setDocuments={setDocuments} />
      </div>
    </div>
  );
}
