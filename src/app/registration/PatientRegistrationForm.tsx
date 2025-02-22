'use client';
import { Button } from '@/components/Button';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { VILLAGES } from '@/constants';
import { FormEventHandler } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export function PatientRegistrationForm({
  onSubmit,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { register, control, formState } = useFormContext();
  const genderDropdownOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ];
  const villageDropdownOptions = VILLAGES.map(({ key }) => ({
    label: key,
    value: key,
  }));
  const yesNoOptions = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <RHFInputField
            register={register}
            formState={formState}
            name="name"
            label="Name (english + local if possible)"
            type="text"
            isRequired={true}
          />
          <RHFInputField
            register={register}
            formState={formState}
            name="identification_number"
            label="ID Number"
            type="text"
          />
          <RHFInputField
            register={register}
            formState={formState}
            name="contact_no"
            label="Contact Number"
            type="tel"
          />
          <RHFDropdown
            register={register}
            formState={formState}
            label="Gender"
            name="gender"
            options={genderDropdownOptions}
            isRequired={true}
          />
          <RHFInputField
            register={register}
            formState={formState}
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            isRequired={true}
          />
          <RHFDropdown
            register={register}
            formState={formState}
            label="Village"
            name="village_prefix"
            options={villageDropdownOptions}
            isRequired={true}
          />
          <RHFDropdown
            register={register}
            formState={formState}
            label="POOR Card"
            name="poor"
            options={yesNoOptions}
            defaultValue="No"
          />
          <RHFDropdown
            register={register}
            formState={formState}
            label="BS2 Card"
            name="bs2"
            options={yesNoOptions}
            defaultValue="No"
          />
          <RHFDropdown
            register={register}
            formState={formState}
            label="Sabai Card"
            name="sabai"
            options={yesNoOptions}
            defaultValue="No"
          />
          <RHFInputField
            register={register}
            formState={formState}
            name="drug_allergy"
            label="Drug Allergies"
            type="textarea"
            isRequired={true}
          />
        </div>
        <Controller
          name={'picture'}
          control={control}
          rules={{ required: { message: 'Please Take a Photo!', value: true } }}
          render={({ field: { value, onChange } }) => {
            return (
              <div>
                {formState.errors['picture'] && formState?.isSubmitted && (
                  <p className="justify-self-center font-medium text-red-500">
                    Please take a photo!
                  </p>
                )}
                <WebcamInput imageDetails={value} setImageDetails={onChange} />
              </div>
            );
          }}
        />
        <Button onClick={() => {}} text="Submit" type="submit" />
      </form>
    </>
  );
}
