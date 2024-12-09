import React from 'react';
import { InputField, DropDown } from '@/components/TextComponents';
import { ChildAges } from '@/utils/childAges';

export function ChildrenVitalsFields({
  handleOnChange,
  formDetails,
  patient,
  visit,
}) {
  const age =
    new Date(visit.date).getFullYear() -
    new Date(patient.date_of_birth).getFullYear();

  const StatFields = [
    {
      component: 'dropdown',
      name: 'gross_motor',
      label: 'Gross Motor: Stand on 1 foot for 3s',
      value: formDetails.gross_motor,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: new ChildAges().ageList,
    },
    {
      component: 'dropdown',
      name: 'gross_motor',
      label: 'Gross Motor: Stand on 1 foot for 10s',
      value: formDetails.gross_motor,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'red_reflex',
      label: 'Red Reflex',
      value: formDetails.red_reflex,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'scoliosis',
      label: 'Scoliosis',
      value: formDetails.scoliosis,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'pallor',
      label: 'Pallor',
      value: formDetails.pallor,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'oral_cavity',
      label: 'Oral Cavity',
      value: formDetails.oral_cavity,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'heart',
      label: 'Heart',
      value: formDetails.heart,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'abdomen',
      label: 'Abdomen',
      value: formDetails.abdomen,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'lungs',
      label: 'Lungs',
      value: formDetails.lungs,
      type: 'text',
      age: new ChildAges().ageList,
    },
    {
      component: 'input',
      name: 'hernial_orifices',
      label: 'Hernial Orifices',
      value: formDetails.hernial_orifices,
      type: 'text',
      age: new ChildAges().ageList,
    },
  ];

  const PubertyFields = [
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
      name: 'thelarche',
      label: 'Thelarche',
      value: formDetails.thelarche,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      component: 'input',
      name: 'thelarche_age',
      label: 'Thelarche Age',
      value: formDetails.scoliosis_age,
      type: 'number',
      age: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      component: 'dropdown',
      name: 'menarche',
      label: 'Menarche',
      value: formDetails.menarche,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      component: 'input',
      name: 'menarche_age',
      label: 'Menarche Age',
      value: formDetails.menarche_age,
      type: 'number',
      age: [13, 14, 15, 16, 17, 18],
      gender: 'Female',
    },
    {
      component: 'dropdown',
      name: 'voice_change',
      label: 'Voice Change',
      value: formDetails.voice_change,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      component: 'input',
      name: 'voice_change_age',
      label: 'Voice Change Age',
      value: formDetails.voice_change_age,
      type: 'number',
      age: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      component: 'dropdown',
      name: 'testicular_growth',
      label: 'Testicular Growth >= 4ml',
      value: formDetails.testicular_growth,
      defaultValue: 'Please select...',
      options: ['Please select...', 'Yes', 'No'],
      age: [13, 14, 15, 16],
      gender: 'Male',
    },
    {
      component: 'input',
      name: 'testicular_growth_age',
      label: 'Testicular Growth Age',
      value: formDetails.testicular_growth_age,
      type: 'number',
      age: [13, 14, 15, 16],
      gender: 'Male',
    },
  ];

  const StatFieldsComponent = StatFields.filter(field => {
    console.log(
      field.name,
      field.age.includes(age),
      field.gender ? field.gender === patient.gender : true
    );
    return (
      field.age.includes(age) &&
      (field.gender ? field.gender === patient.gender : true)
    );
  }).map(field => {
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

  console.dir(StatFieldsComponent);

  const PubertyFieldsComponent = PubertyFields.filter(
    field =>
      field.age.includes(age) &&
      (field.gender ? field.gender === patient.gender : true)
  ).map(field => {
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

  if (age > 18 || age < 2) {
    return <div></div>;
  }

  return (
    <div>
      <label className="label text-lg font-semibold">
        Children Vital Fields
      </label>
      <div className="grid gap-6 md:grid-cols-2">{StatFieldsComponent}</div>
      <div className="grid gap-6 md:grid-cols-2">{PubertyFieldsComponent}</div>
    </div>
  );
}
