'use client';
import { Button } from '@/components/Button';
import { RHFBinaryOption } from '@/components/inputs/RHFBinaryOption';
import { RHFCustomSelect } from '@/components/inputs/RHFCustomSelect';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { RHFUnitInputField } from '@/components/inputs/RHFUnitInputField';
import { WebcamInput } from '@/components/inputs/WebcamInput';
import { LoadingUI } from '@/components/LoadingUI';
import { VillageOptionDropdown } from '@/components/VillageOptionDropdown';
import { VillageContext } from '@/context/VillageContext';
import { getPatientAge } from '@/types/Patient';
import { VillagePrefix } from '@/types/VillagePrefixEnum';
import { EMPTY_VITAL } from '@/types/Vital';
import { DateTime } from 'luxon';
import { FormEventHandler, useContext } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import {
  ALL_CHILD_AGES,
  allPubertyFields,
  ChildPubertySection,
} from '../vital/ChildVitalsFields';
import { NAOption } from '@/constants';

export function PatientForm({
  onSubmit,
  isSubmitting = false,
  closeForm = undefined,
  isEditing = false,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  isSubmitting?: boolean;
  closeForm?: () => void;
  isEditing?: boolean;
}) {
  const { village } = useContext(VillageContext);
  const { control, formState, watch } = useFormContext();
  const genderDropdownOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
  ];
  const gender = watch('gender');
  const age = getPatientAge({ date_of_birth: watch('date_of_birth') }).year;
  const gridStyle = "grid grid-cols-2 gap-4 pb-4 md:grid-cols-3";
  const showChildVitals = age && ALL_CHILD_AGES.includes(age)
  const Divider = () => <hr className="border-t-2 border-t-gray-300 my-2" />
  return (
    <>
      <form onSubmit={onSubmit}>
        <div className={gridStyle}>
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
          <RHFCustomSelect
            label="Gender"
            name="gender"
            options={genderDropdownOptions}
            defaultValue={undefined}
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
            defaultValue={'No'}
          />
          <RHFBinaryOption
            label="BS2 Card"
            name="bs2"
            defaultValue={'No'}
          />
          <RHFBinaryOption
            label="Sabai Card"
            name="sabai"
            defaultValue={'No'}
          />
          <RHFBinaryOption
            label="Receive Reports"
            name="to_get_report"
            defaultValue={'No'}
          />
          <RHFInputField
            name="drug_allergy"
            label="Drug Allergies"
            type="textarea"
            isRequired={true}
            className='col-span-2'
          />
        </div>
        {!isEditing && (<div>
          <Divider />
          <h2>Vitals</h2>
          <RHFUnitInputField
            name="temperature"
            label="Temperature"
            unit="°C"
            type="number"
          />
          <h2 className='mt-2'>Child Vitals</h2>
          {showChildVitals ? (<div>
            {/* <div className={gridStyle}> */}
            <div className="flex flex-row gap-6">
              <RHFCustomSelect
                name="scoliosis"
                label="Scoliosis"
                defaultValue={NAOption}
                options={[
                  { label: 'Normal', value: 'Normal' },
                  { label: 'Abnormal', value: 'Abnormal' },
                ]}
                unselectedValue={NAOption}
              />
              <RHFCustomSelect
                name="pallor"
                label="Pallor"
                defaultValue={NAOption}
                options={[
                  { label: 'Yes', value: 'Yes' },
                  { label: 'No', value: 'No' },
                ]}
                unselectedValue={NAOption}
              />
            </div>
            <ChildPubertySection
              // curVital passed in here doesn't really matter in the current state of the codebase as they are just used to set the default values;
              // the only place where this is used is the registration modal, but curVitals are passed straight into the useForm values
              curVital={EMPTY_VITAL}
              pubertyFields={allPubertyFields.filter(
                field =>
                  (field[0].gender == undefined || field[0].gender == gender) &&
                  field[0].age.includes(age)
              )}
            />
          </div>
          ) : (
            <p className="w-full">
              {age ? "Not within child age range" : "Age not specified"}
            </p>
          )}
        </div>
        )}
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
