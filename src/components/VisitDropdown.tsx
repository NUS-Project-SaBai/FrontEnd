'use client';

import { Visit } from '@/types/Visit';
import moment from 'moment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

type DropdownProps = {
  name: string;
  visits: Visit[];
};
export function VisitDropdown({ name, visits }: DropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(useSearchParams());

  const setVisitId = (visitId: string) => {
    if (visitId == null) {
      params.delete('visit');
    }
    params.set('visit', visitId);
    router.replace(`${pathname}?${params.toString()}`);
  };

  const visitId = params.get('visit');
  if (visitId == null) {
    setVisitId(visits[0].id);
    return <div>No visits found</div>;
  }

  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium">
        Visit on:
      </label>
      <select
        name={name}
        className={'block w-full rounded-md border-2 p-2 text-sm'}
        value={visitId}
        onChange={e => setVisitId(e.target.value)}
      >
        <option hidden value="">
          Please select an option
        </option>
        {visits.map(({ date: label, id: value }) => (
          <option value={value} key={value}>
            {moment(label).format('DD MMM YYYY HH:mm')}
          </option>
        ))}
      </select>
    </div>
  );
}
