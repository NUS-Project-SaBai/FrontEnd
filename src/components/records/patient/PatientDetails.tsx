import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { EditPatient } from '@/components/records/patient/EditPatient';
import { getPatientAge, Patient } from '@/types/Patient';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { Dispatch, SetStateAction } from 'react';

export function PatientDetails({
  patient,
  showFullDetailsButton = false,
  showEditDetailsButton = false,
  setIsHovered = () => {},
}: {
  patient: Patient;
  showFullDetailsButton?: boolean;
  showEditDetailsButton?: boolean;
  setIsHovered?: Dispatch<SetStateAction<boolean>>;
}) {
  const age = getPatientAge(patient);
  const fieldArray = [
    { label: 'Village', value: patient.village_prefix },
    { label: 'ID Number', value: patient.identification_number },
    { label: 'Contact', value: patient.contact_no },
    { label: 'Gender', value: patient.gender },
    {
      label: 'Date of Birth',
      value: DateTime.fromISO(patient.date_of_birth).toLocaleString(
        DateTime.DATE_MED
      ),
    },
    {
      label: 'Age',
      value: (
        <div className="lg:text-lg">
          <span className="font-bold">{age.year}</span>
          <span>Y </span>
          <span className="font-bold">{age.month}</span>
          <span>M </span>
          <span className="font-bold">{age.day}</span>
          <span>D </span>
        </div>
      ),
    },
    { label: 'POOR', value: patient.poor },
    { label: 'BS2', value: patient.bs2 },
    { label: 'Sabai Card', value: patient.sabai },
    { label: 'Allergies', value: patient.drug_allergy },
  ];

  return (
    <div className="m-2 grid flex-1 gap-2 border-t-2 pt-4 [grid-template-columns:repeat(auto-fit,minmax(150px,1fr))]">
      {fieldArray.map(({ label, value }) => (
        <DisplayField key={label} label={label} content={value || '-'} />
      ))}
      {showFullDetailsButton && (
        <div className="h-full w-full content-end">
          <Link
            href={`/records/patient-record?id=${patient.pk}&visit=${patient.last_visit_id}`}
            onClick={e => e.stopPropagation()}
            onMouseEnter={e => {
              e.stopPropagation();
              setIsHovered(false);
            }}
            onMouseLeave={() => setIsHovered(true)}
          >
            <Button text="View full details" colour="indigo" />
          </Link>
        </div>
      )}
      {showEditDetailsButton && <EditPatient patient={patient} />}
    </div>
  );
}
