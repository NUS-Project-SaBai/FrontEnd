import React from 'react';
import { InputField, DropDown } from '@/components/TextComponents';

export function ChildrenVitalsFields({
  handleOnChange,
  formDetails,
  patient,
  visit,
}) {
  const age =
    new Date(visit.date).getFullYear() -
    new Date(patient.date_of_birth).getFullYear();

  const maleStatFields = [{}];

  const femaleStatFields = [
    {
      component: 'dropdown',
      name: 'gross_motor',
      label: 'Gross Motor: Stand on 1 foot for 3s',
      value: formDetails.gross_motor,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [4, 5],
    },
    {
      component: 'dropdown',
      name: 'gross_motor',
      label: 'Gross Motor: Stand on 1 foot for 10s',
      value: formDetails.gross_motor,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [6],
    },
    {
      component: 'input',
      name: 'red_reflex',
      label: 'Red Reflex',
      value: formDetails.red_reflex,
      type: 'text',
      age: [4, 5, 6],
    },
    {
      component: 'input',
      name: 'scoliosis',
      label: 'Scoliosis',
      value: formDetails.scoliosis,
      type: 'text',
      age: [13, 14, 15, 16],
    },
    {
      component: 'dropdown',
      name: 'thelarche',
      label: 'Thelarche',
      value: formDetails.thelarche,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'input',
      name: 'thelarche_age',
      label: 'Thelarche Age',
      value: formDetails.scoliosis_age,
      type: 'number',
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'dropdown',
      name: 'pubarche',
      label: 'Pubarche',
      value: formDetails.pubarche,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'input',
      name: 'pubarche_age',
      label: 'Pubarche Age',
      value: formDetails.pubarche_age,
      type: 'number',
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'dropdown',
      name: 'menarche',
      label: 'Menarche',
      value: formDetails.menarche,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'input',
      name: 'menarche_age',
      label: 'Menarche Age',
      value: formDetails.menarche_age,
      type: 'number',
      age: [13, 14, 15, 16, 17, 18],
    },
    {
      component: 'input',
      name: 'pallor',
      label: 'Pallor',
      value: formDetails.pallor,
      type: 'text',
      age: [4, 5, 7, 8, 11, 12],
    },
    {
      component: 'input',
      name: 'oral_cavity',
      label: 'Oral Cavity',
      value: formDetails.oral_cavity,
      type: 'text',
      age: [4, 5, 7, 8, 11, 12],
    },
    {
      component: 'input',
      name: 'heart',
      label: 'Heart',
      value: formDetails.heart,
      type: 'text',
      age: [4, 5, 7, 8, 11, 12],
    },
    {
      component: 'input',
      name: 'abdomen',
      label: 'Abdomen',
      value: formDetails.abdomen,
      type: 'text',
      age: [4, 5, 7, 8, 11, 12],
    },
    {
      component: 'input',
      name: 'lungs',
      label: 'Lungs',
      value: formDetails.lungs,
      type: 'text',
      age: [4, 5, 7, 8, 11, 12],
    },
    {
      component: 'input',
      name: 'hernial_orifices',
      label: 'Hernial Orifices',
      value: formDetails.hernial_orifices,
      type: 'text',
      age: [4, 5, 7, 8],
    },
  ];

  const femaleStatFieldsComponent = femaleStatFields
    .filter(field => field.age.includes(age))
    .map(field => {
      switch (field.component) {
        case 'input':
          return (
            <InputField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              value={field.value}
              onChange={handleOnChange}
              unit={field.unit}
            />
          );
        case 'dropdown':
          return (
            <DropDown
              key={field.name}
              name={field.name}
              label={field.label}
              value={field.value}
              onChange={handleOnChange}
              defaultValue={field.defaultValue}
              options={field.options}
            />
          );
        default:
          return <div></div>;
      }
    });
  if (age > 18 || age < 4) {
    return <div></div>;
  }

  if (patient.gender === 'Male') {
    return <div>{'male test in the works'}</div>;
  }

  if (patient.gender === 'Female') {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {femaleStatFieldsComponent}
      </div>
    );
  }
}
