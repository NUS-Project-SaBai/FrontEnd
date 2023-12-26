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
import Link from "next/link";
import SearchIcon from "../../components/icons/SearchIcon";

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
          <div className="column is-6">
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

            {cameraIsOpen && <div className="control">{renderWebcam()}</div>}
            <div
              style={{
                fisplay: "flex",
                justifyContent: "center",
                margin: "0px auto 0px",
                width: "60%",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  className={`button is-medium ${
                    cameraIsOpen ? "is-danger" : "is-dark"
                  }`}
                  onClick={toggleCameraOpen}
                  style={{ marginTop: 15 }}
                >
                  <span>{cameraIsOpen ? "Cancel" : "Take Photo"}</span>
                </button>
              </div>
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  className="button is-dark is-medium"
                  onClick={() => scanPatient()}
                  style={{
                    marginTop: 15,
                  }}
                >
                  <span
                    style={{
                      marginRight: 15,
                    }}
                  >
                    Search
                  </span>
                  <SearchIcon />
                </button>
              </div>
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
                <td>
                  <Link href={`/record?id=${matchedPatientData.patient.id}`}>
                    {matchedPatientData.patient.id}
                  </Link>
                </td>
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
