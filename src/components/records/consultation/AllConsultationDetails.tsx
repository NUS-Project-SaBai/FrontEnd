'use server';

import { Consult } from '@/types/Consult';
import { formatDate } from '@/utils/formatDate';
import ConsultationDetails from './ConsultationDetails';

export default async function AllConsultationDetails({
  consults,
}: {
  consults: Consult[];
}) {
  return (
    <div className="flex flex-1 flex-col gap-2">
      {consults.map(consult => (
        <div
          key={consult.id}
          className="flex flex-1 flex-col rounded-md border px-2"
        >
          <h2 className="mb-2 text-center">
            Consult on: {formatDate(consult.date, 'datetime')}
          </h2>
          <ConsultationDetails consult={consult} />
        </div>
      ))}
    </div>
  );
}
