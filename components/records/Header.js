import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Button } from '../TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import useWithLoading from '@/utils/loading';
import CustomModal from '../CustomModal';
import { FileForm } from './FileForm';

export function Header({ patient, visits, handleVisitChange }) {
  const fileInputRef = useRef(null);
  const [fileModalIsOpen, setFileModalIsOpen] = useState(false);

  const toggleFileModal = () => {
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

  const visitOptions = visits.map(visit => {
    const date = moment(visit.date).format('DD MMMM YYYY HH:mm');
    return (
      <option key={visit.id} value={visit.id}>
        {date}
      </option>
    );
  });

  const PatientAge = ({ dob: dob }) => {
    const birth = new Date(dob);
    const today = new Date();

    // Calculate the difference in years
    let ageYears = today.getFullYear() - birth.getFullYear();

    // Calculate the difference in months
    let ageMonths = today.getMonth() - birth.getMonth();

    // Calculate the difference in days
    let ageDays = today.getDate() - birth.getDate();

    // Adjust for the case when the birthday hasn't occurred yet this year
    if (ageMonths < 0 || (ageMonths === 0 && ageDays < 0)) {
      ageYears--;
      ageMonths += 12; // Add 12 months if the birthday hasn't occurred yet this year
    }

    // Adjust days if the day difference is negative
    if (ageDays < 0) {
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0); // Get the last day of the previous month
      ageDays += lastMonth.getDate(); // Add the number of days in the last month
      ageMonths--; // Subtract one month
      if (ageMonths < 0) {
        ageMonths = 11; // If months go negative, set it to 11 and subtract one year
        ageYears--;
      }
    }

    return (
      <div>
        <span className="font-bold">{ageYears}</span>
        <span> YEARS </span>
        <span className="font-bold">{ageMonths}</span>
        <span> MONTHS </span>
        <span className="font-bold">{ageDays}</span>
        <span> DAYS </span>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-12 gap-4 mb-2">
      <div className="col-span-12 md:col-span-2">
        <img
          src={patient.picture}
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
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:border-blue-500 appearance-none"
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
        <label className="text-gray-700 block">Age</label>
        <PatientAge dob={patient.date_of_birth} />
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
      <CustomModal isOpen={fileModalIsOpen} onRequestClose={toggleFileModal}>
        <FileForm patient={patient} />
      </CustomModal>
    </div>
  );
}
