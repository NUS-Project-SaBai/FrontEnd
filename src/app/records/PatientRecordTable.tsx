import { Button } from '@/components/Button';
import { VILLAGES_AND_ALL } from '@/constants';
import { getPatientById } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Patient } from '@/types/Patient';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function PatientRecordTable({
  patients,
  setPatients,
}: {
  patients: Patient[];
  setPatients: Dispatch<SetStateAction<Patient[]>>;
}) {
  return (
    <div className="flex-1">
      {patients.map(patient => (
        <PatientRecordRow
          key={patient.pk}
          patient={patient}
          setPatients={setPatients}
        />
      ))}
    </div>
  );
}

function PatientRecordRow({
  patient,
  setPatients,
}: {
  patient: Patient;
  setPatients: Dispatch<SetStateAction<Patient[]>>;
}) {
  const router = useRouter();
  const { withLoading } = useLoadingState();
  const [isHovered, setIsHovered] = useState(false);
  const [shouldFlash, setShouldFlash] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1); // Update state to trigger re-render
    }, 10000); // Re-render every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const lastVisitDateMoment = moment(patient.last_visit);
  const timeSinceLastVisit = moment.duration(
    lastVisitDateMoment.diff(moment.now())
  );
  const lastVisitLabel =
    timeSinceLastVisit > moment.duration({ seconds: -9 })
      ? 'Just now'
      : timeSinceLastVisit < moment.duration({ days: -7 })
        ? lastVisitDateMoment.format('DD MMM YY')
        : lastVisitDateMoment.fromNow();

  async function handleCreateVisit(patient: Patient) {
    withLoading(async () =>
      createVisit(patient).then(() => getPatientById(patient.pk.toString()))
    )().then(freshPatient => {
      setPatients(old => [
        freshPatient,
        ...old.filter(v => v.patient_id != freshPatient.patient_id),
      ]);
      setShouldFlash(true);
      setTimeout(() => setShouldFlash(false), 1000); // 1 second flash
    });
  }

  return (
    <div
      onClick={() => router.push(`/records/patient-record?id=${patient.pk}`)}
      className={`m-2 flex flex-row items-center rounded-md p-1 shadow transition-shadow duration-300 ${
        isHovered ? 'shadow-md' : ''
      } ${shouldFlash ? 'flash' : ''}`}
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
      <div className="flex flex-row items-center gap-2">
        <Button
          text="Create new visit"
          colour="green"
          onClick={e => {
            e.stopPropagation();
            handleCreateVisit(patient);
          }}
          onMouseEnter={e => {
            e.stopPropagation();
            setIsHovered(false);
          }}
          onMouseLeave={() => {
            setIsHovered(true);
          }}
        />
        <div className="flex flex-1 items-center gap-2 rounded-md border p-2">
          <div className="w-40 flex-1">Last visit: {lastVisitLabel}</div>
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
    </div>
  );
}
