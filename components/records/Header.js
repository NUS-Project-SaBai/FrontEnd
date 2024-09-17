import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { CLOUDINARY_URL, VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import { Button } from '../TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import useWithLoading from '@/utils/loading';
import CustomModal from '../CustomModal';
import { FileForm } from './FileForm';

export function Header({ patient, visits, handleVisitChange }) {
  const fileInputRef = useRef(null);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);

  const toggleFileModal = medication => {
    setFileModalIsOpen(!fileModalIsOpen);
  };

  const uploadFile = useWithLoading(async file => {
    const currentDate = moment().format('YYYY-MM-DD');
    const patientIdentifier = `${patient.village_prefix}${patient.pk.toString().padStart(3, '0')}`;
    const documentName = file.name;

    const labeledDocumentName = `${patientIdentifier}-${currentDate}-${documentName}`;

    const formData = new FormData();
    formData.append('file', file, labeledDocumentName);
    formData.append('file_name', labeledDocumentName);
    formData.append('patient_pk', patient.pk);

    try {
      await axiosInstance.post('/upload/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('File uploaded successfully');
    } catch (error) {
      toast.error('Error uploading file: ' + error);
    }
  });

  const uploadDocument = () => {
    fileInputRef.current.click(); // trigger file input click
  };

  const handleFileChange = event => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  const viewDocument = () => {
    toggleFileModal();
  };

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
      <CustomModal isOpen={fileModalIsOpen} onRequestClose={toggleFileModal}>
        <FileForm patient={patient} />
      </CustomModal>
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
        <div>
          <Button
            text="Upload Document"
            onClick={uploadDocument}
            colour="green"
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              handleFileChange(e);
              e.target.value = '';
            }}
          />
        </div>
        <Button text="View Document" onClick={viewDocument} colour="blue" />
      </div>

      <CustomModal isOpen={modal.isOpen} onRequestClose={closeModal}>
        <ModalContent />
      </CustomModal>
    </div>
  );
}
