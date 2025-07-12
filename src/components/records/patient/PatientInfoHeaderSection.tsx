'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { VILLAGES_AND_ALL } from '@/constants';
import { getVisitByPatientId } from '@/data/visit/getVisit';
import { WithLoadingType } from '@/hooks/useLoadingState';
import { Patient, getPatientAge } from '@/types/Patient';
import { Visit } from '@/types/Visit';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { VisitDropdown } from '../../VisitDropdown';
import { UploadDocument } from '../UploadDocument';
import { ViewDocument } from '../ViewDocument';

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

  useEffect(() => {
    if (showVisit) {
      withLoading(getVisitByPatientId)(patient.pk.toString()).then(vs =>
        setVisits(vs)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient.pk]);

  const age = getPatientAge(patient);

  return (
    <div className="flex">
      <Image
        src={patient.picture_url}
        alt="Patient Picture"
        width={180}
        height={180}
      />
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
      <div>
        <UploadDocument patient={patient} />
        <ViewDocument patient={patient} />
      </div>
    </div>
  );
}
