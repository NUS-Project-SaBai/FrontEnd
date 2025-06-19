import { Button } from '@/components/Button';
import { VILLAGES_AND_ALL } from '@/constants';
import { Patient } from '@/types/Patient';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export function PatientRecordTable({ patients }: { patients: Patient[] }) {
  return (
    <div className="flex-1">
      {patients.map(patient => (
        <PatientRecordRow key={patient.pk} patient={patient} />
      ))}
    </div>
  );
}

function PatientRecordRow({ patient }: { patient: Patient }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/records/patient-record?id=${patient.pk}`}
      className={`m-2 flex flex-row items-center rounded-md p-1 shadow ${isHovered && 'shadow-md'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
    >
      <div
        className={
          'flex-[2] font-semibold ' +
          VILLAGES_AND_ALL[patient.village_prefix].color
        }
      >
        {patient.patient_id}
      </div>
      <div className="flex-[3]">
        <Image
          src={patient.picture}
          alt="Patient Photo"
          height={100}
          width={100}
        />
      </div>
      <div className="flex-[8]">{patient.name}</div>
      <div className="flex w-80 flex-col items-center gap-2">
        <Button
          text="Create new visit"
          colour="green"
          moreStyles="flex-1 w-full text-gray-100"
        />
        <div className="flex w-full flex-row items-center gap-2">
          <div className="flex-1">Last visit: xyz</div>
          <Link
            href={`/records/patient-vitals?id=${patient.pk}`}
            onMouseDown={e => e.stopPropagation()}
            onMouseEnter={e => {
              e.stopPropagation();
              setIsHovered(false);
            }}
            onMouseLeave={() => {
              setIsHovered(true);
            }}
          >
            <Button text="Vitals" colour="red" />
          </Link>
          <Link
            href={`/records/patient-consultation?id=${patient.pk}`}
            onMouseDown={e => e.stopPropagation()}
            onMouseEnter={e => {
              e.stopPropagation();
              setIsHovered(false);
            }}
            onMouseLeave={() => {
              setIsHovered(true);
            }}
          >
            <Button text="Consultation" colour="indigo" />
          </Link>
        </div>
      </div>
    </Link>
  );
}
