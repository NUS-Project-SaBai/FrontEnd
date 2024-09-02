import React, { useState } from 'react';
import moment from 'moment';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CLOUDINARY_URL } from '@/utils/constants';
import { Button } from '../TextComponents';
import CustomModal from '@/components/CustomModal';

export function Header({ patient, visits, handleVisitChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  function openUploadModal() {
    setModalContent('upload');
    setIsModalOpen(true);
  }

  function openViewModal() {
    setModalContent('view');
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const visitOptions = visits.map(visit => {
    const date = moment(visit.date).format('DD MMMM YYYY HH:mm');
    return (
      <option key={visit.id} value={visit.id}>
        {date}
      </option>
    );
  });

  return (
    <div className="grid grid-cols-12 gap-4 mb-2">
      <div className="col-span-12 md:col-span-2">
        <img
          src={`${CLOUDINARY_URL}/${patient.picture}`}
          alt="Patient"
          className="h-48 w-48 object-cover rounded-md"
        />
      </div>
      <div className="col-span-12 md:col-span-3">
        <label className="text-gray-700 block">Village ID</label>
        <p className="text-lg font-medium">{`${patient.village_prefix}${patient.pk.toString().padStart(3, '0')}`}</p>

        <div className="mt-4">
          <label className="text-gray-700 block">Visit on</label>
          <div className="relative">
            <select
              name="medication"
              onChange={handleVisitChange}
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500"
            >
              {visitOptions}
            </select>
            <ChevronDownIcon className="absolute inset-y-0 right-0 h-5 w-5 text-gray-700 pointer-events-none my-auto mr-2" />
          </div>
        </div>
      </div>
      <div className="col-span-12 md:col-span-3">
        <label className="text-gray-700 block">Name</label>
        <p className="text-lg font-medium">{patient.name}</p>
      </div>
      <div className="col-span-12 md:col-span-4 flex items-center justify-between md:justify-start md:space-x-4 mt-4 md:mt-0">
        <Button
          text="Upload Document"
          onClick={openUploadModal}
          colour="green"
        />
        <Button text="View Document" onClick={openViewModal} colour="blue" />
      </div>

      <CustomModal isOpen={isModalOpen} onRequestClose={closeModal}>
        {modalContent === 'upload' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Upload Document</h2>
            {/* Add upload form or file input here once decided*/}
            <input type="file" />
          </div>
        )}
        {modalContent === 'view' && (
          <div>
            <h2 className="text-xl font-bold mb-4">View Document</h2>
            {/* Add document viewer here once decided*/}
            <p>view component goes here.</p>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
