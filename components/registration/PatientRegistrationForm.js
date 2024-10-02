import { Button, InputField, InputBox } from '@/components/TextComponents';
import { VENUE_OPTIONS, VILLAGE_COLOR_CLASSES } from '@/utils/constants';
import AppWebcam from '@/components/WebCamera';
import React, { useState } from 'react';

export const VenueOptionsDropdown = ({
  handleInputChange,
  current_selection,
}) => {
  const handleDropdownChangeWithStyle = event => {
    const selectedValue = event.target.value;
    event.target.className = `flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6 ${
      VILLAGE_COLOR_CLASSES[selectedValue] || 'text-gray-500'
    }`;
    handleInputChange(event);
  };

  return (
    <div>
      <label
        htmlFor="village_prefix"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Village
      </label>
      <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
        <select
          name="village_prefix"
          id="village_prefix"
          onChange={handleDropdownChangeWithStyle}
          defaultValue={current_selection}
          className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
        >
          <option hidden value="">
            Please select an option
          </option>
          {Object.entries(VENUE_OPTIONS).map(([key, value]) => (
            <option
              className={`${VILLAGE_COLOR_CLASSES[key] || 'text-gray-500'}`}
              value={key}
              key={key}
            >
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export function PatientRegistrationForm({
  formDetails,
  formValidationState,
  imageDetails,
  handleInputChange,
  setImageDetails,
}) {
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [webcam, setWebcam] = useState(null);

  const webcamSetRef = webcam => {
    setWebcam(webcam);
  };

  const toggleCameraOpen = () => {
    setCameraIsOpen(!cameraIsOpen);
  };

  const webcamCapture = () => {
    const imageSrc = webcam.getScreenshot();
    setImageDetails(imageSrc);
    setCameraIsOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <InputField
            name="name"
            label="Name (english + local if possible)"
            type="text"
            onChange={handleInputChange}
            value={formDetails.name}
          />
          {formValidationState.name.hasError && (
            <p className="text-red-500 text-sm">
              {formValidationState.name.message}
            </p>
          )}
        </div>

        <InputField
          name="identification_number"
          label="ID Number"
          type="text"
          onChange={handleInputChange}
          value={formDetails.identification_number}
        />
        <InputField
          name="contact_no"
          label="Contact Number"
          className="input"
          type="tel"
          onChange={handleInputChange}
          value={formDetails.contact_no}
        />
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Gender
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
            <select
              name="gender"
              onChange={handleInputChange}
              defaultValue="Unspecified"
              className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unspecified">Unspecified</option>
            </select>
          </div>
        </div>
        <InputField
          label="Date of Birth"
          name="date_of_birth"
          className="input"
          type="date"
          onChange={handleInputChange}
          value={formDetails.date_of_birth}
        />
        {formValidationState.date_of_birth.hasError && (
          <p className="text-red-500 text-sm">
            {formValidationState.date_of_birth.message}
          </p>
        )}

        <div>
          <VenueOptionsDropdown
            handleInputChange={handleInputChange}
            current_selection={formDetails.village_prefix}
          />
          {formValidationState.village_prefix.hasError && (
            <p className="text-red-500 text-sm">
              {formValidationState.village_prefix.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="Poor"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            POOR Card
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
            <select
              className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
              name="poor"
              onChange={handleInputChange}
              defaultValue="No"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="BS2"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            BS2 Card
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
            <select
              className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
              name="bs2"
              onChange={handleInputChange}
              defaultValue="No"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <InputBox
          label="Drug Allergies"
          name="drug_allergy"
          className="textarea"
          placeholder="Enter Allergies"
          onChange={handleInputChange}
          value={formDetails.drug_allergy}
        />

        <div>
          <div className="flex flex-col items-center">
            {!cameraIsOpen && (
              <div className="h-64 w-64 bg-gray-400 flex items-center justify-center">
                {imageDetails != null && <img src={imageDetails} />}
              </div>
            )}

            {cameraIsOpen && (
              <div>
                <AppWebcam
                  webcamSetRef={webcamSetRef}
                  webcamCapture={webcamCapture}
                />
              </div>
            )}
            <div className="flex items-center justify-center mt-2">
              {cameraIsOpen ? (
                <Button colour="red" text="Cancel" onClick={toggleCameraOpen} />
              ) : (
                <Button
                  colour="green"
                  text="Take Photo"
                  onClick={toggleCameraOpen}
                />
              )}
            </div>
          </div>
          {formValidationState.imageDetails.hasError && (
            <p className="text-red-500 text-sm text-center">
              {formValidationState.imageDetails.message}
            </p>
          )}
        </div>
      </div>
      <hr />
    </>
  );
}
