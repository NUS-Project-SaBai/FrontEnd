import React from 'react';
import moment from 'moment';
import { DisplayField } from '@/components/TextComponents';

export function PatientView({ patient }) {
  const calculate_age = dob => {
    const birthDate = new Date(dob);
    const difference = Date.now() - birthDate.getTime();
    const age = new Date(difference);

    return Math.abs(age.getUTCFullYear() - 1970);
  };
  const fieldsArray = [
    { label: 'ID Number', key: 'identification_number' },
    { label: 'Contact', key: 'contact_no' },
    { label: 'Gender', key: 'gender' },
    { label: 'Age', key: 'date_of_birth', calculate: calculate_age },
    {
      label: 'Date of Birth',
      key: 'date_of_birth',
      calculate: dob => moment(dob).format('DD-MMMM-YYYY'),
    },
    { label: 'POOR Card', key: 'poor' },
    { label: 'BS2 Card', key: 'bs2' },
    { label: 'Allergies', key: 'drug_allergy' },
  ];

  return fieldsArray.map((field, index) => (
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
  ));
}
