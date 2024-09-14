import React, { useRef } from 'react';
import axios from 'axios';
import moment from 'moment';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CLOUDINARY_URL } from '@/utils/constants';
import { Button } from '../TextComponents';
import { useEffect, useState } from 'react';

export function Header({ patient, visits, handleVisitChange }) {
  const fileInputRef = useRef(null);

  function uploadDocument() {
    fileInputRef.current.click(); //trigger file input click
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    if (file) {
      const currentDate = moment().format('YYYY-MM-DD');
      const patientName = patient.name;
      const documentName = file.name;

      const labeledDocumentName = `${patientName}-${currentDate}-${documentName}`;

      const formData = new FormData();
      formData.append('file', file, labeledDocumentName);
      formData.append('file_name', labeledDocumentName);

      axios
        .post('http://127.0.0.1:8000/upload/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then(response => {
          console.log('File uploaded successfully', response.data);
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    }
  }

  function viewDocument() {
    console.log('View document');
  }

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
            onChange={handleFileChange}
          />
        </div>
        <Button text="View Document" onClick={viewDocument} colour="blue" />
      </div>
    </div>
  );
}
