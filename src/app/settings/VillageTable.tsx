/**
 * VillageTable Component
 *
 * Displays all villages in a table format with sorting by visibility status.
 * Visible villages are shown first, followed by hidden villages.
 */

'use client';

import { VillageTableRow } from './VillageTableRow';

interface Village {
  id: number;
  village_name: string;
  colour_code: string;
  is_hidden: boolean;
}

interface VillageTableProps {
  villages: Village[]; // Array of villages to display
  onUpdate: () => void; // Callback to refresh data when a row is updated
  colorOptions: Array<{ label: string; value: string }>;
}

export function VillageTable({
  villages,
  onUpdate,
  colorOptions,
}: VillageTableProps) {
  // Sort villages: visible first, then hidden
  const sortedVillages = [...villages].sort((a, b) => {
    if (a.is_hidden === b.is_hidden) return 0;
    return a.is_hidden ? 1 : -1;
  });

  // Show empty state if no villages exist
  if (villages.length === 0) {
    return (
      <div className="px-6 py-8 text-center text-gray-500">
        No villages found. Add your first village to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Village Name
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Color
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Status
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {sortedVillages.map(village => (
            <VillageTableRow
              key={village.id}
              village={village}
              onUpdate={onUpdate}
              colorOptions={colorOptions}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
