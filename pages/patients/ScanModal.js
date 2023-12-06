import axios from "axios";
import Modal from "react-modal";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  API_URL,
  CLOUDINARY_URL,
  MATCH_FOUND_MESSAGE,
  NO_MATCHES_FOUND_MESSAGE,
  NO_PHOTO_MESSAGE,
} from "../../utils/constants";
import { urltoFile } from "../../utils/helpers";

const ScanModal = ({
  modalIsOpen,
  cameraIsOpen,
  imageDetails,
  closeScanModal,
  renderWebcam,
  toggleCameraOpen,
  customStyles,
}) => {
  const [matchedPatientData, setMatchedPatientData] = useState(null);

  const scanPatient = async () => {
    if (imageDetails == null) {
      toast.error(NO_PHOTO_MESSAGE);
      return;
    }

    const scanPatientFormData = new FormData();
    scanPatientFormData.append(
      "picture",
      await urltoFile(imageDetails, "patient_screenshot.jpg", "image/jpg")
    );

    const response = await axios
      .post(`${API_URL}/patients/search`, scanPatientFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setMatchedPatientData(response.data);
        toast.success(MATCH_FOUND_MESSAGE);
      })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 404) {
          toast.error(NO_MATCHES_FOUND_MESSAGE);
        } else if (error.response.status === 400) {
          toast.error(NO_PHOTO_MESSAGE);
        }
      });

    // if (possibleOptions.length > 0) toast.success("Options found!");
    // else toast.error("No options found!");
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
            <div>
              <button
                className="button is-dark is-medium"
                onClick={() => scanPatient()}
                style={{
                  marginTop: 10,
                }}
              >
                <span
                  style={{
                    marginRight: 15,
                  }}
                >
                  Search
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="16"
                  width="16"
                  viewBox="0 0 512 512"
                  style={{ fill: "white", float: "right" }}
                >
                  {
                    "Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc."
                  }
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <hr />

        <label className="label">Results</label>
        {matchedPatientData ? (
          <div>
            <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Photo</th>
                  <th>Confidence (%)</th>
                </tr>
              </thead>
              <tbody>
                <td> {matchedPatientData.patient.id}</td>
                <td>{matchedPatientData.patient.name}</td>
                <td>
                  <img
                    src={`${CLOUDINARY_URL}/${matchedPatientData.patient.picture}`}
                  ></img>
                </td>
                <td>{matchedPatientData.confidence.toFixed(2)}</td>
              </tbody>
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
