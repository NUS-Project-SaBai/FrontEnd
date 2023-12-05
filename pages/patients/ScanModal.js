import axios from "axios";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { API_URL } from "../../utils/constants";
import { urltoFile } from "../../utils/helpers";

const ScanModal = ({
  modalIsOpen,
  scanOptions,
  possibleOptions,
  cameraIsOpen,
  imageDetails,
  closeScanModal,
  renderWebcam,
  handleScanOptionsChange,
  toggleCameraOpen,
  setPatientOption,
  setPossibleOptions,
  customStyles,
}) => {
  let tableContents = possibleOptions.map((option) => {
    let fields = option.fields;
    let name = fields.name;
    let id = `${fields.village_prefix}${option.pk}`;
    let imageUrl = `${API_URL}/${fields.picture}`;
    let dateOfBirth = moment(fields.date_of_birth).format("DD MMM YYYY");

    let select = (
      <button
        className="button is-dark level-item"
        onClick={() => {
          closeScanModal();
          setPatientOption(option);
        }}
      >
        Select
      </button>
    );

    return (
      <tr>
        <td>{id}</td>
        <td>
          <figure className="image is-96x96">
            <img
              src={imageUrl}
              alt="Placeholder image"
              style={{ height: 96, width: 96, objectFit: "cover" }}
            />
          </figure>
        </td>
        <td>{name}</td>
        <td>{dateOfBirth}</td>
        <td>{select}</td>
      </tr>
    );
  });

  const scanPatient = async () => {
    const scanPatientFormData = new FormData();
    scanPatientFormData.append(
      "picture",
      await urltoFile(imageDetails, "patient_screenshot.jpg", "image/jpg")
    );

    const response = await axios.post(
      `${API_URL}/patients/search`,
      scanPatientFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log(response);

    // if (possibleOptions.length > 0) toast.success("Options found!");
    // else toast.error("No options found!");

    // setPossibleOptions(possibleOptions);
  };

  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeScanModal}
      style={customStyles}
      contentLabel="Example Modal"
    >
      <div>
        <h1 style={{ color: "black", fontSize: "1.5em", marginBottom: 15 }}>
          Scan Face
        </h1>
        <div className="columns">
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
            <div
              style={{
                textAlign: "center",
              }}
            >
              <button
                className="button is-dark is-medium"
                onClick={toggleCameraOpen}
                style={{ marginTop: cameraIsOpen ? 60 : 15 }}
              >
                {cameraIsOpen ? "Cancel" : "Take Photo"}
              </button>
            </div>
          </div>
          <div className="column is-4">
            <div className="field">
              <label className="label">Gender</label>
              <div className="control">
                <div className="select" style={{ margin: "0 auto" }}>
                  <select name="gender" onChange={handleScanOptionsChange}>
                    <option
                      selected={scanOptions.gender === "Male"}
                      value="Male"
                    >
                      Male
                    </option>
                    <option
                      selected={scanOptions.gender === "Female"}
                      value="Female"
                    >
                      Female
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="field">
              <label className="label">Village Prefix</label>
              <div className="control">
                <input
                  name="village_prefix"
                  className="input"
                  type="text"
                  onChange={handleScanOptionsChange}
                  value={scanOptions.village_prefix}
                />
              </div>
            </div>

            <div>
              <button
                className="button is-dark is-medium"
                onClick={() => scanPatient()}
                style={{ marginTop: 10 }}
              >
                Search
              </button>
            </div>
          </div>
        </div>
        <hr />

        <label className="label">Results</label>
        {possibleOptions.length > 0 ? (
          <div>
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Photo</th>
                  <th>Full Name</th>
                  <th>Date of Birth </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>{tableContents}</tbody>
            </table>
          </div>
        ) : (
          <h2>No matches found!</h2>
        )}
      </div>
    </Modal>
  );
};

export default ScanModal;
