import React, { useState } from 'react';
import { Button, InputField, InputBox } from '@/components/TextComponents';
import VenueOptionsDropdown from '@/components/VenueOptionsDropdown';
import AppWebcam from '@/components/WebCamera';
import OptionButtons from '../TextComponents/OptionButtons';

export function PatientRegistrationForm({
  formDetails,
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
        <InputField
          name="name"
          label="Name (english + local if possible)"
          type="text"
          onChange={handleInputChange}
          value={formDetails.name}
          isRequired
        />
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
        <OptionButtons
          label="Gender"
          name={'gender'}
          options={['Male', 'Female']}
          onChange={handleInputChange}
          value={formDetails.gender}
          isRequired
        />
        <InputField
          label="Date of Birth"
          name="date_of_birth"
          className="input"
          type="date"
          onChange={handleInputChange}
          value={formDetails.date_of_birth}
          isRequired
        />

        <VenueOptionsDropdown
          handleInputChange={handleInputChange}
          value={formDetails.village_prefix}
          isRequired
        />

        <OptionButtons
          label="POOR Card"
          name={'poor'}
          options={['Yes', 'No']}
          onChange={handleInputChange}
          value={formDetails.poor}
          isRequired
        />

        <OptionButtons
          label="BS2 Card"
          name={'bs2'}
          options={['Yes', 'No']}
          onChange={handleInputChange}
          value={formDetails.bs2}
          isRequired
        />

        <OptionButtons
          label="Sabai Card"
          name={'sabai'}
          options={['Yes', 'No']}
          onChange={handleInputChange}
          value={formDetails.sabai}
          isRequired
        />

        <InputBox
          label="Drug Allergies"
          name="drug_allergy"
          className="textarea"
          placeholder="Enter Allergies"
          onChange={handleInputChange}
          value={formDetails.drug_allergy}
        />

        <div className="flex flex-col items-center">
          <label className="block text-sm font-medium leading-6 text-gray-900">
            Photo<span className="text-red-500"> *</span>
          </label>
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
      </div>
      <hr />
    </>
  );
}
