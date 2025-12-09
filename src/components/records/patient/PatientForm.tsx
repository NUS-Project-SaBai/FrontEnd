'use client';
import { Button } from '@/components/Button';
import { RHFBinaryOption } from '@/components/inputs/RHFBinaryOption';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { RHFUnitInputField } from '@/components/inputs/RHFUnitInputField';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { LoadingUI } from '@/components/LoadingUI';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { EMPTY_VITAL } from '@/types/Vital';
import { DateTime } from 'luxon';
import { FormEventHandler, useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ChildVitalsFields } from '../vital/ChildVitalsFields';

export function PatientForm({
  onSubmit,
  isSubmitting = false,
  closeForm = undefined,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
  closeForm?: () => void;
}) {
  const { village } = useContext(VillageContext);
  const { control, formState, getValues } = useFormContext();
  const genderDropdownOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 py-5">
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
            defaultValue={getValues('gender') || ''}
            isRequired={true}
          />
          <RHFInputField
            name="date_of_birth"
            label="Date of Birth"
            type="date"
            isRequired={true}
            min={DateTime.now().minus({ years: 150 }).toFormat('yyyy-MM-dd')}
            max={DateTime.now().toFormat('yyyy-MM-dd')}
          />
          <Controller
            name="village_prefix"
            defaultValue={village === VillagePrefix.ALL ? null : village}
            rules={{ required: true }}
            render={({ field, fieldState }) => (
              <VillageOptionDropdown
                label="Village"
                village={field.value}
                handleVillageChange={field.onChange}
                required={true}
                dropdownClassName={
                  fieldState.error && 'border-l-8 border-red-400'
                }
                excludeALLOption
              />
            )}
          />
          <RHFBinaryOption
            label="POOR Card"
            name="poor"
            defaultValue={getValues('poor') || 'No'}
          />
          <RHFBinaryOption
            label="BS2 Card"
            name="bs2"
            defaultValue={getValues('bs2') || 'No'}
          />
          <RHFBinaryOption
            label="Sabai Card"
            name="sabai"
            defaultValue={getValues('sabai') || 'No'}
          />
          <RHFBinaryOption
            label="Receive Reports"
            name="to_get_report"
            defaultValue={getValues('to_get_report') || 'No'}
          />
          <RHFUnitInputField
                      name="temperature"
                      label="Temperature"
                      unit="°C"
                      type="number"
                    />
        </div>
        <hr className = 'py-3 border-t-2 border-t-gray-300'/>
        <ChildVitalsFields
            patient={{ date_of_birth: '2020-12-09T11:39:10Z', gender: 'Female' }}
            curVital={EMPTY_VITAL}
          />
        <RHFInputField
          name="drug_allergy"
          label="Drug Allergies"
          type="textarea"
          isRequired={true}
        />
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
        {isSubmitting ? (
          <LoadingUI message="Submitting..." />
        ) : (
          <div className="mt-4 flex justify-center">
            <Button
              colour="green"
              text="Submit"
              type="submit"
              data-modal-submit
            />
          </div>
        )}
        {closeForm && (
          <Button
            colour="red"
            text="Cancel"
            type="button"
            onClick={closeForm}
          />
        )}
      </form>
    </>
  );
}
