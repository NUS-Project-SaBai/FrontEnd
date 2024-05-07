import Modal from "react-modal";
import VenueOptions from "./VenueOptions";
import { Button } from "@/components/textContainers/Button";
import { InputField } from "@/components/textContainers/InputField";
import { InputBox } from "@/components/textContainers/InputBox";

const PatientModal = ({
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
}) => {
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
          label="IC Number"
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
};

export default PatientModal;
