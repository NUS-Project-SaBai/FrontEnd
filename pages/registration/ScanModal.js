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
import { Button } from "@/components/textContainers/Button";

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
      await urltoFile(imageDetails, "patient_screenshot.jpg", "image/jpg"),
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
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Scan Face
        </h1>
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

          {cameraIsOpen && <div>{renderWebcam()}</div>}
          <div className="flex items-center justify-center mt-2 space-x-2">
            {cameraIsOpen ? (
              <Button text="Cancel" colour="red" onClick={toggleCameraOpen} />
            ) : (
              <Button
                text="Take Photo"
                colour="green"
                onClick={toggleCameraOpen}
              />
            )}

            <Button
              text="Search Image"
              onClick={() => scanPatient()}
              colour="green"
            />
          </div>
        </div>
        <hr className="my-4" />

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
