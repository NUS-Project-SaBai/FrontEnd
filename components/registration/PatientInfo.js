import React from 'react';
import moment from 'moment';

import { DisplayField, Button } from '@/components/TextComponents/';
import Router from 'next/router';
import { VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import PatientAge from '../PatientAge';

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
    { label: 'Sabai Card', key: 'sabai' },
    { label: 'Allergies', key: 'drug_allergy' },
  ];

  const imageUrl = patient.picture;

  return (
    <div>
      <div className="flex flex-row gap-4">
        <img
          src={imageUrl}
          alt="Placeholder image"
          className="has-ratio h-48 w-48 object-cover"
        />

        <div className="text-3xl">
          <p>ID</p>
          <p className={VILLAGE_COLOR_CLASSES[patient.village_prefix]}>
            {patient.pk
              ? `${patient.village_prefix}${patient.pk.toString().padStart(4, '0')}`
              : 'NOT FILLED'}
          </p>
        </div>
        <div className="text-3xl">
          <p>Age</p>
          <PatientAge dob={patient.date_of_birth} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-2">
        <div className="grid-cols-1" key={'ID'}>
          <DisplayField
            key={'ID'}
            label={'ID'}
            content={
              patient.pk
                ? `${patient.village_prefix}${patient.pk.toString().padStart(4, '0')}`
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
      </div>
      <div className="flex justify-center items-center space-x-4 mt-4">
        <Button
          text="Create New Visit"
          onClick={submitNewVisit}
          colour="green"
        />
        <Button
          text={'View records'}
          onClick={() =>
            Router.push(`/records/patient-record?id=${patient.pk}`)
          }
          colour="indigo"
        />
        <Button
          text={'Create vitals'}
          onClick={() =>
            Router.push(`/records/patient-vitals?id=${patient.pk}`)
          }
          colour="green"
        />
        <Button
          text={'Create consult'}
          onClick={() =>
            Router.push(`/records/patient-consultation?id=${patient.pk}`)
          }
          colour="green"
        />
      </div>
      <br />
    </div>
  );
}
