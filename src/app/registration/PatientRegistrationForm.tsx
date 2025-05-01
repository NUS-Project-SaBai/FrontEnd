'use client';
import { Button } from '@/components/Button';
import { RHFBinaryOption } from '@/components/inputs/RHFBinaryOption';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { FormEventHandler, useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export function PatientRegistrationForm({
  onSubmit,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const { village } = useContext(VillageContext);
  const { control, formState } = useFormContext();
  const genderDropdownOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <RHFInputField
            name="name"
            label="Name (english + local if possible)"
            type="text"
            isRequired={true}
          />
          <RHFInputField
            name="identification_number"
            label="ID Number"
            type="text"
          />
          <RHFInputField name="contact_no" label="Contact Number" type="tel" />
          <RHFDropdown
            label="Gender"
            name="gender"
            options={genderDropdownOptions}
            isRequired={true}
          />
          <RHFInputField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            isRequired={true}
          />
          <Controller
            name="village_prefix"
            defaultValue={village}
            rules={{
              validate: {
                required: value => value != 'ALL',
              },
            }}
            render={({ field, fieldState }) => (
              <VillageOptionDropdown
                label="Village"
                village={field.value}
                handleVillageChange={field.onChange}
                required={true}
                dropdownClassName={
                  fieldState.error && 'border-l-8 border-red-400'
                }
              />
            )}
          />
          <RHFBinaryOption label="POOR Card" name="poor" defaultValue="No" />
          <RHFBinaryOption label="BS2 Card" name="bs2" defaultValue="No" />
          <RHFBinaryOption label="Sabai Card" name="sabai" defaultValue="No" />
          <RHFInputField
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
        <Button colour="green" text="Submit" type="submit" />
      </form>
    </>
  );
}
