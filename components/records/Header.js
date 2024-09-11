import React, { useState } from 'react';
import moment from 'moment';
import { CLOUDINARY_URL, VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import { Button } from '../TextComponents';
import CustomModal from '@/components/CustomModal';

export function Header({ patient, visits, handleVisitChange }) {
  const [modal, setModal] = useState({ isOpen: false, content: null });

  const openModal = content => setModal({ isOpen: true, content });
  const closeModal = () => setModal({ isOpen: false, content: null });

  const visitOptions = visits.map(visit => (
    <option key={visit.id} value={visit.id}>
      {moment(visit.date).format('DD MMMM YYYY HH:mm')}
    </option>
  ));

  const ModalContent = () => {
    switch (modal.content) {
      case 'upload':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            <input
              type="file"
              className="border border-gray-300 rounded-md p-2 w-full"
            />
          </div>
        );
      case 'view':
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">View Document</h2>
            <p>Document viewer component goes here.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-12 gap-4 mb-2">
      <div className="col-span-12 md:col-span-2">
        <img
          src={`${CLOUDINARY_URL}/${patient.picture}`}
          alt="Patient"
          className="h-48 w-48 object-cover rounded-md shadow-sm"
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

        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">
            Visit on
          </label>
          <select
            name="visit"
            onChange={handleVisitChange}
            className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          >
            {visitOptions}
          </select>
        </div>
      </div>

      <div className="col-span-12 md:col-span-3">
        <div className="mb-4">
          <label className="text-sm font-semibold text-gray-700">Name</label>
          <p className="text-lg font-medium text-gray-800">{patient.name}</p>
        </div>
      </div>

      <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-start md:space-x-4 mt-4 md:mt-0">
        <Button
          text="Upload Document"
          onClick={() => openModal('upload')}
          colour="green"
        />
        <Button
          text="View Document"
          onClick={() => openModal('view')}
          colour="blue"
        />
      </div>

      <CustomModal isOpen={modal.isOpen} onRequestClose={closeModal}>
        <ModalContent />
      </CustomModal>
    </div>
  );
}
