import Modal from 'react-modal';
import { Button, InputField, InputBox } from '@/components/TextComponents';
import { venueOptions } from '@/utils/constants';

const VenueOptions = ({ handleInputChange }) => (
  <div>
    <label
      htmlFor="Village"
      className="block text-xs font-medium text-gray-900"
    >
      Village
    </label>

    <select
      className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
      name="village_prefix"
      onChange={handleInputChange}
      default={Object.keys(venueOptions)[0]}
    >
      {Object.entries(venueOptions).map(([key, value]) => (
        <option value={key} key={value}>
          {value}
        </option>
      ))}{' '}
    </select>
  </div>
);

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
  loading,
}) {
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
      contentLabel="Patient Modal"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[80vh] overflow-y-auto">
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
          <VenueOptions handleInputChange={handleInputChange} />
          <InputBox
            label="Drug Allergies"
            name="drug_allergy"
            className="textarea"
            placeholder="Textarea"
            onChange={handleInputChange}
            value={formDetails.drug_allergy}
          />

          <div className="flex flex-col items-center">
            {!cameraIsOpen && (
              <div className="h-64 w-64 bg-gray-400 flex items-center justify-center">
                {imageDetails != null && <img src={imageDetails} />}
              </div>
            )}

            {cameraIsOpen && <div>{renderWebcam()}</div>}
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
      </div>
    </Modal>
  );
}
