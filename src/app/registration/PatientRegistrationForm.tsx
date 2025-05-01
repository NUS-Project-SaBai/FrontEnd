'use client';
import { Button } from '@/components/Button';
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
  const { register, control, formState } = useFormContext();
  const genderDropdownOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  // TODO: replace all yesNoOption with the specialised RHFYesNoOption
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
        <Button colour="green" text="Submit" type="submit" />
      </form>
    </>
  );
}
