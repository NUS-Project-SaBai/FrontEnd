import React from 'react';
import { VENUE_OPTIONS, VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import { VILLAGE_CODE_ALL } from '@/hooks/useCachedVillageCode';

export default function VenueOptionsDropdown({
  handleInputChange,
  value,
  showRequiredAsterisk,
  smaller = false,
  showAllOption = false,
}) {
  return (
    <div>
      {!smaller && (
        <label
          htmlFor="village_prefix"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Village
          {showRequiredAsterisk && <span className="text-red-500"> *</span>}
        </label>
      )}
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <select
          name="village_prefix"
          id="village_prefix"
          onChange={handleInputChange}
          value={value}
          className={`flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6 ${VILLAGE_COLOR_CLASSES[value] || 'text-gray-500'}`}
        >
          <option hidden value="">
            Please select {smaller ? '' : 'an option'}
          </option>
          {showAllOption && (
            <option value={VILLAGE_CODE_ALL}>{`${VILLAGE_CODE_ALL}`}</option>
          )}
          {Object.entries(VENUE_OPTIONS).map(([key, value]) => (
            <option
              className={`${VILLAGE_COLOR_CLASSES[key] || 'text-gray-500'}`}
              value={key}
              key={key}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
