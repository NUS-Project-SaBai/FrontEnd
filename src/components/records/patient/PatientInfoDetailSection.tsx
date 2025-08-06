import { Patient } from '@/types/Patient';
import { formatDate } from '@/utils/formatDate';
import { DisplayField } from '../../DisplayField';

export function PatientInfoDetailSection({ patient }: { patient: Patient }) {
  const fieldArray = [
    { label: 'Name', value: patient.name },
    { label: 'ID Number', value: patient.identification_number },
    { label: 'Contact', value: patient.contact_no },
    { label: 'Gender', value: patient.gender },
    {
      label: 'Date of Birth',
      value: formatDate(patient.date_of_birth, 'date'),
    },
    { label: 'Village', value: patient.village_prefix },
    { label: 'POOR', value: patient.poor },
    { label: 'BS2', value: patient.bs2 },
    { label: 'Sabai Card', value: patient.sabai },
    { label: 'Allergies', value: patient.drug_allergy },
  ];
  return (
    <div className={'grid gap-2 md:grid-cols-3'}>
      {fieldArray.map(({ label, value }) => (
        <DisplayField
          key={label}
          label={label}
          content={value || 'NOT FILLED'}
        />
      ))}
    </div>
  );
}
