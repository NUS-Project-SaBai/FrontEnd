import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { getPatientAge, Patient } from '@/types/Patient';
import moment from 'moment';
import Link from 'next/link';

export function PatientDetails({ patient }: { patient: Patient }) {
  const age = getPatientAge(patient);
  const fieldArray = [
    { label: 'Village', value: patient.village_prefix },
    { label: 'ID Number', value: patient.identification_number },
    { label: 'Contact', value: patient.contact_no },
    { label: 'Gender', value: patient.gender },
    {
      label: 'Date of Birth',
      value: moment(patient.date_of_birth).format('DD-MMMM-YYYY'),
    },
    {
      label: 'Age',
      value: (
        <div className="text-lg">
          <span className="font-bold">{age.year}</span>
          <span> YEARS </span>
          <span className="font-bold">{age.month}</span>
          <span> MONTHS </span>
          <span className="font-bold">{age.day}</span>
          <span> DAYS </span>
        </div>
      ),
    },
    { label: 'POOR', value: patient.poor },
    { label: 'BS2', value: patient.bs2 },
    { label: 'Sabai Card', value: patient.sabai },
    { label: 'Allergies', value: patient.drug_allergy },
  ];
  return (
    <div
      className={
        'center-items m-2 grid w-full gap-2 border-t-2 pt-4 md:grid-cols-4'
      }
    >
      {fieldArray.map(({ label, value }) => (
        <DisplayField
          key={label}
          label={label}
          content={value || 'NOT FILLED'}
        />
      ))}
      <div className="h-full w-full content-end">
        <Link
          href={`/records/patient-record?id=${patient.pk}`}
          className="bg-blue-200"
        >
          <Button text="View full details" colour="blue" />
        </Link>
      </div>
    </div>
    // <div className={'flex flex-col flex-wrap'}>
    //   {fieldArray.map(({ label, value }) => (
    //     // <DisplayField
    //     //   key={label}
    //     //   label={label}
    //     //   content={value || 'NOT FILLED'}
    //     // />
    //     <div className='p-2 shadow'>
    //       {label}: {value || 'NOT FILLED'}
    //     </div>
    //   ))}
    // </div>
  );
}
