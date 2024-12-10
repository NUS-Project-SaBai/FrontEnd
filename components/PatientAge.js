import React from 'react';
import { patientAge } from '@/utils/helpers';

export default function PatientAge({ dob: dob }) {
  const { year, month, day } = patientAge(dob);

  return (
    <div>
      <span className="font-bold">{year}</span>
      <span> YEARS </span>
      <span className="font-bold">{month}</span>
      <span> MONTHS </span>
      <span className="font-bold">{day}</span>
      <span> DAYS </span>
    </div>
  );
}
