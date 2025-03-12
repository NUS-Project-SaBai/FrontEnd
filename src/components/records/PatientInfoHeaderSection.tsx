'use server';
import { VILLAGES } from '@/constants';
import { getVisitByPatientId } from '@/data/visit/getVisit';
import { Patient, getPatientAge } from '@/types/Patient';
import Image from 'next/image';
import { VisitDropdown } from '../VisitDropdown';

export async function PatientInfoHeaderSection({
  patient,
}: {
  patient: Patient;
}) {
  const age = getPatientAge(patient);
  const visits = await getVisitByPatientId(patient.pk.toString());

  return (
    <div className="flex">
      <Image
        src={patient.picture}
        alt="Patient Picture"
        width={180}
        height={180}
      />
      <div className="grid grid-cols-[2fr,3fr] grid-rows-2 gap-x-8 pl-8 text-2xl">
        <div>
          <p>ID:</p>
          <p className={'font-bold ' + VILLAGES[patient.village_prefix].color}>
            {patient.patient_id}
          </p>
        </div>

        <div>
          <p>Name:</p>
          <p>{patient.name}</p>
        </div>

        {visits && (
          <div>
            <p>Visited On:</p>
            <VisitDropdown name="visit_date" visits={visits} />
          </div>
        )}

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
    </div>
  );
}
