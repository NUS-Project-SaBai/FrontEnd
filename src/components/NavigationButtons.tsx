import { Patient } from '@/types/Patient';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';
import { Button } from './Button';

export function VitalsButton({
  patient,
  setIsHovered = () => {},
  labelOverwrite,
  visitId,
  className,
}: {
  patient: Patient;
  setIsHovered?: Dispatch<SetStateAction<boolean>>;
  labelOverwrite?: string;
  visitId?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/records/patient-vitals?id=${patient.pk}&visit=${visitId ?? patient.last_visit_id}&${visitId && 'specificVisit=true'}`}
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onMouseLeave={() => setIsHovered(true)}
    >
      <Button
        text={labelOverwrite ?? 'Vitals'}
        colour="red"
        className={className}
      />
    </Link>
  );
}

export function ConsultationButton({
  patient,
  setIsHovered = () => {},
  labelOverwrite,
  visitId,
  className,
}: {
  patient: Patient;
  setIsHovered?: Dispatch<SetStateAction<boolean>>;
  labelOverwrite?: string;
  visitId?: string;
  className?: string;
}) {
  return (
    <Link
      href={`/records/patient-consultation?id=${patient.pk}&visit=${visitId ?? patient.last_visit_id}&${visitId && 'specificVisit=true'}`}
      onClick={e => e.stopPropagation()}
      onMouseEnter={e => {
        e.stopPropagation();
        setIsHovered(false);
      }}
      onMouseLeave={() => setIsHovered(true)}
    >
      <Button
        text={labelOverwrite ?? 'Consultation'}
        colour="indigo"
        className={className}
      />
    </Link>
  );
}
