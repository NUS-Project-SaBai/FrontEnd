import { VENUE_OPTIONS, VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import React from 'react';
import { useController } from 'react-hook-form';

export const VenueOptionsDropdown = () => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name: 'village_prefix',
    rules: { required: 'Village is required' },
  });

  const handleDropdownChangeWithStyle = event => {
    const selectedValue = event.target.value;
    event.target.className = `flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
      VILLAGE_COLOR_CLASSES[selectedValue] || 'text-gray-500'
    }`;
    onChange(event);
  };

  return (
    <div>
      <label
        htmlFor="village_prefix"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Village
        <span className="text-red-500">*</span> {/* indicate required */}
      </label>
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <select
          name="village_prefix"
          id="village_prefix"
          onChange={handleDropdownChangeWithStyle}
          defaultValue={value}
          className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
        >
          <option hidden value="">
            Please select an option
          </option>
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
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};
