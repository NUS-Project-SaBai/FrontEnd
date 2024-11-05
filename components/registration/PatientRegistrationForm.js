import { Button, InputField, InputBox } from '@/components/TextComponents';
import AppWebcam from '@/components/WebCamera';
import React, { useState } from 'react';
import { VenueOptionsDropdown } from './VenueOptionsDropdown';

export function PatientRegistrationForm({
  formDetails,
  formValidationState,
  imageDetails,
  handleInputChange,
  setImageDetails,
  form_control,
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
        <InputField
          name="name"
          label="Name (english + local if possible)"
          type="text"
          onChange={handleInputChange}
          value={formDetails.name}
          control={form_control}
          rules={{ required: 'Name is required' }}
        />

        <InputField
          name="identification_number"
          label="ID Number"
          type="text"
          onChange={handleInputChange}
          value={formDetails.identification_number}
          control={form_control}
        />
        <InputField
          name="contact_no"
          label="Contact Number"
          className="input"
          type="tel"
          onChange={handleInputChange}
          value={formDetails.contact_no}
          control={form_control}
        />
        <div>
          <label
            htmlFor="gender"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Gender
          </label>
          <div className="flex mt-1 rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
            <select
              name="gender"
              onChange={handleInputChange}
              value={formDetails.gender}
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
          control={form_control}
          rules={{ required: 'Date of Birth is required' }}
        />

        <VenueOptionsDropdown
          handleInputChange={handleInputChange}
          value={formDetails.village_prefix}
        />

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
              value={formDetails.poor}
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
              value={formDetails.bs2}
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>
        </div>

        <div>
          <label
            htmlFor="Sabai"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Sabai Card
          </label>
          <div className="mt-1 flex rounded-md shadow-sm ring-1 ring-inset ring-gray-400">
            <select
              className="flex-1 block w-full rounded-md border-2 py-2 px-1.5 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm sm:leading-6"
              name="sabai"
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
          <label
            htmlFor="village_prefix"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Photo
            <span className="text-red-500">*</span> {/* indicate required */}
          </label>
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
