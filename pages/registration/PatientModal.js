import Modal from "react-modal";
import VenueOptions from "./VenueOptions";
import { CreateButton } from "@/components/textContainers/CreateButton";
import { DeleteButton } from "@/components/textContainers/DeleteButton";

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
      <div className="columns">
        <div className="column is-8">
          <form>
            <div className="field">
              <label className="label">
                Name (english + local if possible)
              </label>
              <div className="control">
                <input
                  name="name"
                  className="input"
                  type="text"
                  onChange={handleInputChange}
                  value={formDetails.name}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">IC Number</label>
              <div className="control">
                <input
                  name="local_name"
                  className="input"
                  type="text"
                  onChange={handleInputChange}
                  value={formDetails.local_name}
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Gender</label>
              <div className="control">
                <div className="select">
                  <select name="gender" onChange={handleInputChange}>
                    <option
                      selected={formDetails.gender === "Male"}
                      value="Male"
                    >
                      Male
                    </option>
                    <option
                      selected={formDetails.gender === "Female"}
                      value="Female"
                    >
                      Female
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field is-grouped">
              <div className="control is-expanded">
                <label className="label">Contact Number</label>
                <div className="control">
                  <input
                    name="contact_no"
                    className="input"
                    type="tel"
                    onChange={handleInputChange}
                    value={formDetails.contact_no}
                  />
                </div>
              </div>

              <div className="control is-expanded">
                <label className="label">Date of Birth</label>
                <div className="control">
                  <input
                    name="date_of_birth"
                    className="input"
                    type="date"
                    onChange={handleInputChange}
                    value={formDetails.date_of_birth}
                  />
                </div>
              </div>
            </div>

            <VenueOptions handleInputChange={handleInputChange} />

            <div className="field">
              <label className="label">Drug Allergies</label>
              <div className="control">
                <textarea
                  name="drug_allergy"
                  className="textarea"
                  placeholder="Textarea"
                  onChange={handleInputChange}
                  value={formDetails.drug_allergy}
                />
              </div>
            </div>
          </form>
          <div className="levels" style={{ marginTop: 10 }}>
            <div className="level-left">
              <div className="level-item">
                <CreateButton
                  text="Submit"
                  onClick={submitNewPatient}
                  className="mt-4"
                />
              </div>

              <div className="level-item">
                <DeleteButton
                  text="Close"
                  onClick={closeModal}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="column is-4">
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
            <div className="control">
              {/* <WebcamCapture /> */}
              {renderWebcam()}
            </div>
          )}
          <div className="flex items-center justify-center mt-2">
            {cameraIsOpen ? (
              <DeleteButton text="Cancel" onClick={toggleCameraOpen} />
            ) : (
              <CreateButton text="Take Photo" onClick={toggleCameraOpen} />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default PatientModal;
