import { VILLAGES } from '@/constants';
import { createVisit } from '@/data/visit/createVisit';
import { getPatientAge, Patient } from '@/types/Patient';
import moment from 'moment';
import Image from 'next/image';
import { redirect, RedirectType } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from './Button';
import { DisplayField } from './DisplayField';

export function PatientInfo({ patient }: { patient: Patient | null }) {
  if (patient == null) {
    return <></>;
  }

  const actions: Action[] = [
    {
      text: 'Create New Visit',
      onClick: () => {
        createVisit(patient);
        toast.success('Visit Created');
      },
    },
    {
      text: 'View Records',
      onClick: getClickableUrl(`/records/patient-record?id=${patient.pk}`),
    },
    {
      text: 'Create Vitals',
      onClick: getClickableUrl(`/records/patient-vitals?id=${patient.pk}`),
    },
    {
      text: 'Create Consult',
      onClick: getClickableUrl(
        `/records/patient-consultation?id=${patient.pk}`
      ),
    },
  ];

  return (
    <div>
      <HeaderSection patient={patient} />
      <InfoSection patient={patient} />
      <ActionBar actions={actions} />
    </div>
  );
}

function HeaderSection({ patient }: { patient: Patient }) {
  const age = getPatientAge(patient);
  return (
    <div className="flex gap-x-10">
      <Image
        src={patient.picture}
        alt="Patient Picture"
        width={160}
        height={160}
      />
      <div>
        <div className="mb-6 text-3xl">
          <p>ID:</p>
          <p className={'font-bold ' + VILLAGES[patient.village_prefix].color}>
            {patient.patient_id}
          </p>
        </div>
        <div className="mb-4 text-3xl">
          <p>Age:</p>
          <p className="text-2xl">
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

function InfoSection({ patient }: { patient: Patient }) {
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
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
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

type Action = { text: string; onClick: () => void };
function getClickableUrl(url: string): () => void {
  return () => {
    redirect(url, RedirectType.push);
  };
}
function ActionBar({ actions }: { actions: Action[] }) {
  return (
    <div className="mt-6 flex justify-center space-x-2">
      {actions.map(({ text, onClick }) => (
        <Button key={text} text={text} onClick={onClick} />
      ))}
    </div>
  );
}
