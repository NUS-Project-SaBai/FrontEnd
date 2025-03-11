import { Patient } from '@/types/Patient';
import moment from 'moment';
import { DisplayField } from '../DisplayField';

export function PatientInfoDetailSection({
  patient,
  displayType = 'flex',
}: {
  patient: Patient;
  displayType?: 'flex' | 'grid';
}) {
  const fieldArray = [
    { label: 'Name', value: patient.name },
    { label: 'ID Number', value: patient.identification_number },
    { label: 'Contact', value: patient.contact_no },
    { label: 'Gender', value: patient.gender == 'male' ? 'Male' : 'Female' },
    {
      label: 'Date of Birth',
      value: moment(patient.date_of_birth).format('DD-MMMM-YYYY'),
    },
    { label: 'Village', value: patient.village_prefix },
    { label: 'POOR', value: patient.poor },
    { label: 'BS2', value: patient.bs2 },
    { label: 'Sabai Card', value: patient.sabai },
    { label: 'Allergies', value: patient.drug_allergy },
  ];
  return (
    <div className={displayType + ' grid-cols-2 flex-col gap-2 sm:grid-cols-3'}>
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
