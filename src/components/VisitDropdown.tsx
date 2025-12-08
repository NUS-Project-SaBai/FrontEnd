'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Visit } from '@/types/Visit';
import { formatDate } from '@/utils/formatDate';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// Optional: if you have a cn util
// import { cn } from '@/lib/utils';

type DropdownProps = {
  name: string;
  visits: Visit[];
  placeholder?: string;
  className?: string;
};

export function VisitDropdown({
  name,
  visits,
  placeholder = 'Please select a visit',
  className = '',
}: DropdownProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Radix requires string values
  const items = useMemo(
    () =>
      (visits ?? []).map(v => ({
        value: String(v.id),
        label: formatDate(v.date, 'datetime'),
      })),
    [visits]
  );

  const [visitId, setVisitId] = useState<string>(
    searchParams.get('visit') ?? ''
  );

  useEffect(() => {
    setVisitId(items[0].value)
  }, [])

  // Ensure selected visit exists; if not, default to first (if any)
  useEffect(() => {
    if (!items.length) return;
    if (!visitId || !items.some(i => i.value === visitId)) {
      setVisitId(items[0].value);
    }
  }, [items, visitId]);

  // Sync the selection into the URL ?visit=<id>
  useEffect(() => {
    const params = new URLSearchParams(searchParams); // clone
    if (visitId) params.set('visit', visitId);
    else params.delete('visit');
    router.replace(`${pathname}?${params.toString()}`);
  }, [pathname, router, visitId, searchParams]);

  useEffect(() => {
    // If the visitId is not in the list of visits, set it to the first visit
    if (visits && !visits.some(v => v.id.toString() == visitId)) {
      setVisitId(visits[0].id.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitId, pathname, searchParams]); // keep deps minimal to avoid loops

  if (!items.length) return <div>No visits found</div>;

  return (
    <div className={className /* or cn('space-y-1', className) */}>
      <label htmlFor={name} className="mb-1 block text-sm font-medium">
        Visit on:
      </label>

      <Select value={visitId} onValueChange={setVisitId}>
        <SelectTrigger
          id={name}
          className="w-full bg-white text-gray-900" // keeps it white on blue panels
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="border bg-white text-gray-900">
          {items.map(i => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
