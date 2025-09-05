'use client';
import { createVisit } from '@/data/visit/createVisit';
import { Patient } from '@/types/Patient';
import { redirect, RedirectType } from 'next/navigation';
import toast from 'react-hot-toast';
import { Button } from '../../Button';

export function PatientInfoActionBar({ patient }: { patient: Patient }) {
  const actions: Action[] = [
    {
      text: 'Create New Visit',
      onClick: async () => {
        console.log('CLICKED');
        await createVisit(patient);
        console.log('POST CREATION');
        toast.success('Visit Created');
        window.location.reload();
      },
    },
    {
      text: 'View Records',
      onClick: getClickableUrl(`/records/patient-record?id=${patient.pk}`),
    },
    {
      text: 'View Vitals',
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
    <div className="mt-6 flex justify-center space-x-2">
      {actions.map(({ text, onClick }) => (
        // TODO: implement colour/icon?
        <Button key={text} text={text} onClick={onClick} />
      ))}
    </div>
  );
}

export type Action = { text: string; onClick: () => void };
export function getClickableUrl(url: string): () => void {
  return () => {
    redirect(url, RedirectType.push);
  };
}
