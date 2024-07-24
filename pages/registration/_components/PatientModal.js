import Modal from "react-modal";
import { Button, InputField, InputBox } from "@/components/TextComponents";
import { villageOptions } from "@/components/TextComponents/VillageOptions";

import React, { useState, useRef, useEffect } from 'react';


const CustomDropdown = ({ name, label, options, onChange, value }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative inline-block w-full" ref={dropdownRef}>
      <label htmlFor={name} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <button
        type="button"
        className="mt-2 block w-full rounded-md border border-gray-300 bg-white py-1.5 pl-3 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm"
        onClick={handleToggle}
      >
        {selectedOption ? selectedOption.label : 'Select an option'}
      </button>
      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {options.map((option) => (
            <li
              key={option.value}
              className="cursor-pointer select-none relative py-2 pl-3 pr-9"
              style={option.style}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;

const venueOptions = [
  { value: 'PC', label: 'PC', style: { color: '#6D8A91' } },
  { value: 'CA', label: 'CA', style: { color: '#CC7685' } },
  { value: 'TT', label: 'TT', style: { color: '#7A7A70' } },
  { value: 'TK', label: 'TK', style: { color: '#CCCC45' } },
  { value: 'SV', label: 'Smong', style: { color: '#6A516D' } },
];





export function PatientModal({
  modalIsOpen,
  formDetails,
  imageDetails,
  cameraIsOpen,
  renderWebcam,
  closeModal,
  handleInputChange,
  submitNewPatient,
  toggleCameraOpen,
  customStyles,
  loading,
}) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div className="grid grid-cols-2 gap-4">
        <InputField
          name="name"
          label="Name (english + local if possible)"
          type="text"
          onChange={handleInputChange}
          value={formDetails.name}
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
        <div>
          <label
            htmlFor="Gender"
            className="block text-xs font-medium text-gray-900"
          >
            Gender
          </label>

          <select
            className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
            name="gender"
            onChange={handleInputChange}
            defaultValue="Male"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <InputField
          label="Date of Birth"
          name="date_of_birth"
          className="input"
          type="date"
          onChange={handleInputChange}
          value={formDetails.date_of_birth}
        />
        <CustomDropdown 
          label="village code"
          name="village_prefix"
          options={villageOptions}
          onChange={handleInputChange}
          value={formDetails.village_prefix}
        />
        <InputBox
          label="Drug Allergies"
          name="drug_allergy"
          className="textarea"
          placeholder="Textarea"
          onChange={handleInputChange}
          value={formDetails.drug_allergy}
        />

        <div>
          {!cameraIsOpen && (
            <div
              style={{
                margin: "0 auto",
                height: 250,
                width: 250,
                backgroundColor: "grey",
              }}
            >
              {imageDetails != null && <img src={imageDetails} />}
            </div>
          )}

          {cameraIsOpen && (
            <div>
              {/* <WebcamCapture /> */}
              {renderWebcam()}
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
      <hr className="my-2" />
      <div className="space-x-4">
        <Button colour="green" text="Submit" onClick={submitNewPatient} />

        <Button colour="red" text="Close" onClick={closeModal} />
      </div>
    </Modal>
  );
}
