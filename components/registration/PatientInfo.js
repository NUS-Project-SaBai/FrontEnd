import React from 'react';
import moment from 'moment';

import { DisplayField, Button } from '@/components/TextComponents/';
import { CLOUDINARY_URL, OFFLINE, defaultAPI_URL } from '@/utils/constants';

export function PatientInfo({ patient, submitNewVisit }) {
  if (!patient.pk) {
    return <div></div>;
  }

  const fieldsArray = [
    { label: 'Name', key: 'name' },
    { label: 'ID Number', key: 'identification_number' },
    { label: 'Contact', key: 'contact_no' },
    { label: 'Gender', key: 'gender' },
    {
      label: 'Date of Birth',
      key: 'date_of_birth',
      calculate: dob => moment(dob).format('DD-MMMM-YYYY'),
    },
    { label: 'Village', key: 'village_prefix' },
    { label: 'POOR', key: 'poor' },
    { label: 'BS2', key: 'bs2' },
    { label: 'Allergies', key: 'drug_allergy' },
  ];

  const imageUrl = OFFLINE
    ? `${defaultAPI_URL}/${patient.offline_picture}`
    : `${CLOUDINARY_URL}/${patient.picture}`;

  console.log(OFFLINE);

  return (
    <div>
      <div>
        <img
          src={imageUrl}
          alt="Placeholder image"
          className="has-ratio h-48 w-48 object-cover"
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-2">
        <div className="grid-cols-1" key={'ID'}>
          <DisplayField
            key={'ID'}
            label={'ID'}
            content={
              patient.pk
                ? `${patient.village_prefix}${patient.pk.toString().padStart(3, '0')}`
                : 'NOT FILLED'
            }
          />
        </div>

        {fieldsArray.map((field, index) => (
          <div className="grid-cols-1" key={index}>
            <DisplayField
              key={index}
              label={field.label}
              content={
                field.calculate
                  ? field.calculate(patient[field.key])
                  : patient[field.key] || 'NOT FILLED'
              }
            />
          </div>
        ))}

        <Button
          text="Create New Visit"
          onClick={submitNewVisit}
          colour="green"
        />
      </div>
    </div>
  );
}
