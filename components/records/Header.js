import React from 'react';
import moment from 'moment';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CLOUDINARY_URL, VILLAGE_COLOR_CLASSES } from '@/utils/constants';

export function Header({ patient, visits, handleVisitChange }) {
  const visitOptions = visits.map(visit => {
    const date = moment(visit.date).format('DD MMMM YYYY HH:mm');
    return (
      <option key={visit.id} value={visit.id}>
        {date}
      </option>
    );
  });

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 md:col-span-2">
        <img
          src={`${CLOUDINARY_URL}/${patient.picture}`}
          alt="Placeholder image"
          className="h-48 w-48 object-cover rounded-md"
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <div>
          <label className="block text-gray-700">Village ID</label>
          <p
            className={`${VILLAGE_COLOR_CLASSES[patient.village_prefix] || 'text-gray-500'}`}
          >{`${
            patient.village_prefix
          }${patient.pk.toString().padStart(3, '0')}`}</p>
        </div>
        <div className="mt-4">
          <label className="block text-gray-700">Visit on</label>
          <div className="relative">
            <select
              name="medication"
              onChange={handleVisitChange}
              className="block w-full bg-white border border-gray-300 rounded-md py-2 px-4 appearance-none focus:outline-none focus:border-blue-500"
            >
              {visitOptions}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDownIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <div>
          <label className="block text-gray-700">Name</label>
          <p className="text-lg font-medium">{patient.name}</p>
        </div>
      </div>
      <div className="col-span-12 md:col-span-4"></div>
    </div>
  );
}
