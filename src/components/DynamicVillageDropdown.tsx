// Reusable dropdown component that dynamically fetches and displays available villages
'use client';
import { useVillages } from '@/hooks/useVillages';

interface VillageOption {
  key: string;
  label: string;
  color: string;
}

// Props interface for the dropdown component
interface DynamicVillageDropdownProps {
  village: string; // Currently selected village
  handleVillageChange: (village: string) => void; // Selection change callback
  label?: string; // Label text (default: "Village:")
  required?: boolean; // Whether field is required (adds red asterisk)
  excludeALLOption?: boolean; // Whether to exclude "ALL" option
  dropdownClassName?: string; // Additional CSS classes
}

// Dropdown component that fetches villages from API and handles loading/error states
export function DynamicVillageDropdown({
  village,
  handleVillageChange,
  label = 'Village:',
  required = false,
  excludeALLOption = false,
  dropdownClassName = '',
}: DynamicVillageDropdownProps) {
  const { villages, loading, error } = useVillages(); // Fetch villages using custom hook

  // Loading state: Show disabled dropdown with loading message
  if (loading) {
    return (
      <div className="text-sm font-semibold">
        <label className="block">{label}</label>
        <select disabled className="w-full rounded border-2 bg-gray-100 p-1">
          <option>Loading...</option>
        </select>
      </div>
    );
  }

  // Error state: Show disabled dropdown with error message
  if (error) {
    return (
      <div className="text-sm font-semibold">
        <label className="block">{label}</label>
        <select disabled className="w-full rounded border-2 bg-red-100 p-1">
          <option>Error loading villages</option>
        </select>
      </div>
    );
  }

  // Transform village data into dropdown options
  const options: VillageOption[] = villages.map(v => ({
    key: v.village_name,
    label: v.village_name,
    color: v.colour_code,
  }));

  // Add "ALL" option at the beginning if not excluded
  if (!excludeALLOption) {
    options.unshift({
      key: 'ALL',
      label: 'ALL',
      color: 'text-gray-800',
    });
  }

  return (
    <div className="text-sm font-semibold">
      <label htmlFor="village_select" className="block">
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name="village_select"
        id="village_select"
        value={village}
        onChange={e => handleVillageChange(e.target.value)}
        className={`w-full rounded border-2 p-1 ${dropdownClassName}`}
      >
        {options.map(({ key, label, color }) => (
          <option key={key} value={key} className={`font-semibold ${color}`}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
}
