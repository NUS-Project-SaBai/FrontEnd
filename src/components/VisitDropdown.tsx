'use client';
import { Visit } from '@/types/Visit';
import moment from 'moment';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type DropdownProps = {
  name: string;
  visits: Visit[];
};
export function VisitDropdown({ name, visits }: DropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useMemo(
    () => new URLSearchParams(searchParams),
    [searchParams]
  );
  const [visitId, setVisitId] = useState(params.get('visit') || '');

  useEffect(() => {
    if (visitId) {
      params.set('visit', visitId);
    } else {
      params.delete('visit');
    }
    router.replace(`${pathname}?${params.toString()}`);
  }, [params, pathname, router, visitId]);

  useEffect(() => {
    // If the visitId is not in the list of visits, set it to the first visit
    if (visits && !visits.some(v => v.id == visitId)) {
      setVisitId(visits[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visits]);

  if (!visits && !visitId) {
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
