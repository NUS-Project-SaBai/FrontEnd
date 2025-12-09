import { Button } from '@/components/Button';
import { PatientPhoto } from '@/components/PatientPhoto';
import { PatientDetails } from '@/components/records/patient/PatientDetails';
import { VILLAGES_AND_ALL } from '@/constants';
import { PatientListContext } from '@/context/PatientListContext';
import { getPatientById } from '@/data/patient/getPatient';
import { createVisit } from '@/data/visit/createVisit';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useToggle } from '@/hooks/useToggle';
import { Patient } from '@/types/Patient';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { DateTime, Duration } from 'luxon';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function PatientRecordTable({
  displayedPatients,
}: {
  displayedPatients: Patient[];
}) {
  return (
    <div className="flex-1">
      {displayedPatients.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <p>No patients found!</p>
        </div>
      ) : (
        displayedPatients.map(patient => (
          <PatientRecordRow key={patient.pk} patient={patient} />
        ))
      )}
    </div>
  );
}

function PatientRecordRow({ patient }: { patient: Patient }) {
  const { setPatients } = useContext(PatientListContext);
  const { withLoading } = useLoadingState();
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, toggleExpanded] = useToggle(false);
  const [shouldFlash, setShouldFlash] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_forceUpdate, setForceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setForceUpdate(prev => prev + 1); // Update state to trigger re-render
    }, 10000); // Re-render every 10 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const lastVisitLabel = getLastVisitLabel(patient.last_visit_date);

  async function handleCreateVisit(patient: Patient) {
    // await new Promise(resolve => setTimeout(resolve, 3000));
    // check if a last visit date exists
    if (patient.last_visit_date) {
      const lastVisit = DateTime.fromISO(patient.last_visit_date);
      const now = DateTime.now();
      const diff = now.diff(lastVisit);

      // check if the difference is less than 3 hours
      if (diff < Duration.fromObject({ hours: 3 })) {
        const timeAgo = lastVisit.toRelative(); // e.g., "2 hours ago"
        // show a confirmation dialog
        const isConfirmed = window.confirm(
          `A visit was created for this patient ${timeAgo}. Are you sure you want to create another one?`
        );

        // if the user cancels, stop the function
        if (!isConfirmed) {
          return;
        }
      }
    }
    return withLoading(async () => {
      toast.loading("Creating visit...");
      return createVisit(patient).then(() => getPatientById(patient.pk.toString()))
    }
    )().then(freshPatient => {
      setPatients(old => {
        return [
          freshPatient,
          ...old.filter(v => v.patient_id != freshPatient.patient_id),
        ]
      });
      toast.dismiss();
      toast.success("New visit created")
      setShouldFlash(true);
      setTimeout(() => setShouldFlash(false), 1000); // 1 second flash
    });
  }

  return (
    <div>
      <div
        // onClick={() => router.push(`/records/patient-record?id=${patient.pk}`)}
        onClick={toggleExpanded}
        className={`m-2 flex flex-col items-center rounded-md bg-white p-2 shadow transition-shadow duration-300 ${isHovered ? 'shadow-md' : ''
          } ${shouldFlash ? 'flash' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        role="button"
      >
        <div className="grid w-full grid-cols-[2fr_3fr_auto] items-center gap-1 p-1 md:gap-2">
          <div>
            <p
              className={
                'font-semibold ' +
                VILLAGES_AND_ALL[patient.village_prefix].color
              }
            >
              {patient.patient_id}
            </p>
            <div className="min-w-5">{patient.name}</div>
            <PatientPhoto pictureUrl={patient.picture_url} />
          </div>
          <div className="flex flex-col justify-end gap-4 sm:flex-row sm:items-center">
            <Button
              text="Create visit"
              colour="green"
              onClick={e => {
                e.stopPropagation();
                return handleCreateVisit(patient);
              }}
              onMouseEnter={e => {
                e.stopPropagation();
                setIsHovered(false);
              }}
              onMouseLeave={() => {
                setIsHovered(true);
              }}
            />
            <div className="flex flex-col items-center gap-2 rounded-md border p-2 sm:flex-row">
              <div className="w-[115px]">
                <p>Last visit:</p>
                <p>{lastVisitLabel}</p>
              </div>
              <VitalsButton patient={patient} setIsHovered={setIsHovered} />
              <ConsultationButton
                patient={patient}
                setIsHovered={setIsHovered}
              />
            </div>
          </div>
          <button className="w-5">
            {isExpanded ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </button>
        </div>
        {isExpanded && (
          <div className="mt-2 flex w-full flex-row items-center">
            <PatientDetails
              patient={patient}
              showFullDetailsButton
              setIsHovered={setIsHovered}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function getLastVisitLabel(lastVisitDate: string): string {
  if (!lastVisitDate) {
    return 'Missing last visit date';
  }
  const lastVisitDateLuxon = DateTime.fromISO(lastVisitDate);
  // Positive duration since last visit
  const timeSinceLastVisit = Duration.fromMillis(
    DateTime.now().diff(lastVisitDateLuxon).toMillis()
  );
  return timeSinceLastVisit < Duration.fromObject({ seconds: 5 })
    ? 'Just now'
    : timeSinceLastVisit < Duration.fromObject({ minutes: 10 })
      ? lastVisitDateLuxon.toRelative() || 'Missing relative time?'
      : timeSinceLastVisit < Duration.fromObject({ days: 10 })
        ? lastVisitDateLuxon.toLocaleString({
          ...DateTime.DATETIME_MED,
          hour12: true,
        })
        : lastVisitDateLuxon.toLocaleString(DateTime.DATE_MED);
}

function VitalsButton({
  patient,
  setIsHovered,
}: {
  patient: Patient;
  setIsHovered: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Link
      href={`/records/patient-vitals?id=${patient.pk}&visit=${patient.last_visit_id}`}
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onMouseLeave={() => setIsHovered(true)}
    >
      <Button text="Vitals" colour="red" />
    </Link>
  );
}

function ConsultationButton({
  patient,
  setIsHovered,
}: {
  patient: Patient;
  setIsHovered: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Link
      href={`/records/patient-consultation?id=${patient.pk}&visit=${patient.last_visit_id}`}
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onMouseLeave={() => setIsHovered(true)}
    >
      <Button text="Consultation" colour="indigo" />
    </Link>
  );
}
