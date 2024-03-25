import React, { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import toast from "react-hot-toast";
import moment from "moment";
import {
  API_URL,
  CLOUDINARY_URL,
  NO_PHOTO_MESSAGE,
} from "../../utils/constants";
import { urltoFile } from "../../utils/helpers";
import withAuth from "../../utils/auth";
import AppWebcam from "../../utils/webcam";
import PatientModal from "./PatientModal";
import ScanModal from "./ScanModal";

import { Button } from "@/components/textContainers/Button";

const customStyles = {
  content: {
    left: "25%",
    right: "7.5%",
  },
};

// put id

Modal.setAppElement("#__next");

const Registration = () => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({});
  const [scanModalIsOpen, setScanModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [webcam, setWebcam] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [formDetails, setFormDetails] = useState({
    gender: "Male",
    village_prefix: "SV",
  });

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    let { data: patients } = await axios.get(`${API_URL}/patients`);
    let patientsEnriched = patientsEnrich(patients);
    setPatients(patientsEnriched);
  };

  /**
   * Webcam functions
   */

  const webcamSetRef = (webcam) => {
    setWebcam(webcam);
  };

  const webcamCapture = () => {
    const imageSrc = webcam.getScreenshot();
    setImageDetails(imageSrc);
    setCameraIsOpen(false);
  };

  const toggleCameraOpen = () => {
    setCameraIsOpen(!cameraIsOpen);
  };

  /**
   * General functions
   */
  // for noww, all we want to do is to add a filter string to this
  // perhaps in the future, we would want to let our backend do this for us
  const patientsEnrich = (patients) => {
    let patientsEnriched = patients.map((patient) => {
      let patient_details = patient.fields;
      let name = patient_details.name;
      let contact_no = patient_details.contact_no;
      let village = patient_details.village_prefix;
      let id = patient.pk;
      let localName = patient_details.local_name;

      return {
        ...patient,
        filterString:
          `${village}` +
          `${id}`.padStart(3, "0") +
          ` ${village}${id} ${name} ${contact_no} ${localName}`,
      };
    });

    return patientsEnriched;
  };

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const inputName = target.name;

    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [inputName]: value,
    }));
  };

  const submitNewPatient = async () => {
    let checklist = [
      "name",
      "local_name",
      "gender",
      "contact_no",
      "date_of_birth",
      "drug_allergy",
      "village_prefix",
    ];

    let errorCount = 0;
    checklist.forEach((item) => {
      if (typeof formDetails[item] == "undefined") {
        errorCount += 1;
      }
    });

    if (errorCount > 0) {
      toast.error("Please complete the form before submitting!");
    } else if (imageDetails == null) {
      toast.error(NO_PHOTO_MESSAGE);
    } else {
      let payload = {
        ...formDetails,
        picture: await urltoFile(
          imageDetails,
          "patient_screenshot.jpg",
          "image/jpg",
        ),
      };
      const patientFormData = new FormData();
      Object.keys(payload).forEach((key) =>
        patientFormData.append(key, payload[key]),
      );

      let { data: response } = await axios.post(
        `${API_URL}/patients`,
        patientFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (typeof response.error == "undefined") {
        setPatient(response[0]);
        setFormDetails((prevDetails) => ({
          ...prevDetails,
          gender: "Male",
          village_prefix: "SV",
        }));
        setImageDetails(null);
        toast.success("New patient created!");
        closeModal();
        setPatient("test"); // redundant code?
        setPatient(response[0]);
        autoSubmitNewVisit(response[0]);
      } else {
        toast.error("Please retake photo!");
      }
    }
  };

  const submitNewVisit = async () => {
    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD"),
    };
    await axios.post(`${API_URL}/visits`, payload);

    setPatient({});
    toast("Visit started!");
  };

  const autoSubmitNewVisit = async (patient) => {
    // future helper function
    // get all active visits
    // sort them by their statuses
    // from there, determine where to put this guy
    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD"),
    };
    await axios.post(`${API_URL}/visits`, payload);
    toast.success("New visit created for patient!");
  };

  /**
   * Modal functions
   */

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const openScanModal = () => {
    setScanModalIsOpen(true);
  };

  const closeScanModal = () => {
    setScanModalIsOpen(false);
  };

  /**
   * Auto Suggestions functions
   */

  const getSuggestions = (filter) => {
    let inputValue = filter.trim().toLowerCase();
    let inputLength = inputValue.length;
    let query =
      inputLength === 0
        ? []
        : patients.filter((patient) =>
            patient.filterString.toLowerCase().includes(inputValue),
          );
    return query;
  };

  const renderSuggestion = (suggestion) => {
    let name = suggestion.fields.name;
    let id = `${suggestion.fields.village_prefix} ${suggestion.pk
      .toString()
      .padStart(3, "0")}`;
    let imageURL = suggestion.fields.picture;

    return (
      <div
        className="card"
        style={{ width: 500, margin: 0, padding: 0 }}
        onClick={() => setPatient(suggestion)}
      >
        <div className="card-content">
          <div className="media">
            <div className="media-left">
              <figure className="image is-96x96">
                <img
                  // src="https://bulma.io/images/placeholders/96x96.png"
                  src={`${CLOUDINARY_URL}/${imageURL}`}
                  alt="Placeholder image"
                  style={{ height: 96, width: 96, objectFit: "cover" }}
                />
              </figure>
            </div>
            <div className="media-content">
              <div className="title is-4">{name}</div>
              <div className="subtitle is-6">{id}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  const getSuggestionValue = (suggestion) => {
    return suggestion.fields.name;
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  const onSuggestionsFetchRequested = ({ value }) => {
    setSuggestions(getSuggestions(value));
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  // Autosuggest will pass through all these props to the input.
  const inputProps = {
    placeholder: "Search Patient",
    type: "search",
    value,
    onChange: onChange,
    className: "input is-medium level-item",
    style: { width: 500 },
  };

  return (
    <div
      style={{
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        // position: "relative"
      }}
    >
      <PatientModal
        modalIsOpen={modalIsOpen}
        formDetails={formDetails}
        imageDetails={imageDetails}
        cameraIsOpen={cameraIsOpen}
        renderWebcam={() => (
          <AppWebcam
            webcamSetRef={webcamSetRef}
            webcamCapture={webcamCapture}
          />
        )}
        closeModal={closeModal}
        handleInputChange={handleInputChange}
        submitNewPatient={submitNewPatient}
        toggleCameraOpen={toggleCameraOpen}
        customStyles={customStyles}
      />
      <ScanModal
        modalIsOpen={scanModalIsOpen}
        cameraIsOpen={cameraIsOpen}
        imageDetails={imageDetails}
        closeScanModal={closeScanModal}
        renderWebcam={() => (
          <AppWebcam
            webcamSetRef={webcamSetRef}
            webcamCapture={webcamCapture}
          />
        )}
        toggleCameraOpen={toggleCameraOpen}
        customStyles={customStyles}
      />
      <div>
        <div>
          <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
            Registration
          </h1>
          <div className="flex items-center justify-center  mb-2">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
            />
          </div>
          <div className="flex items-center justify-center mb-6 gap-3">
            <Button
              colour="green"
              text="Start Facial Recognition"
              onClick={openScanModal}
            />
            <Button colour="green" text="New Patient" onClick={openModal} />
            <Button text="trial" colour="sky" onClick={openModal} />
          </div>
          {typeof patient.pk !== "undefined" && (
            <div className="columns">
              <div className="column is-2">
                <figure className="image is-1by1">
                  <img
                    src={`${CLOUDINARY_URL}/${patient.fields.picture}`}
                    alt="Placeholder image"
                    className="has-ratio"
                    style={{ height: 200, width: 200, objectFit: "cover" }}
                  />
                </figure>
              </div>
              <div className="column is-5">
                <label className="label">ID</label>
                <article className="message">
                  <div className="message-body">{`${
                    patient.fields.village_prefix
                  }${patient.pk.toString().padStart(3, "0")}`}</div>
                </article>
                <label className="label">Name</label>
                <article className="message">
                  <div className="message-body">{patient.fields.name}</div>
                </article>
                <label className="label">IC Number</label>
                <article className="message">
                  <div className="message-body">
                    {patient.fields.local_name}
                  </div>
                </article>
                <label className="label">Gender</label>
                <article className="message">
                  <div className="message-body">{patient.fields.gender}</div>
                </article>
                <label className="label">Date of Birth</label>
                <article className="message">
                  <div className="message-body">
                    {patient.fields.date_of_birth}
                  </div>
                </article>
                <label className="label">Drug Allergies</label>
                <article className="message">
                  <div className="message-body">
                    {patient.fields.drug_allergy}
                  </div>
                </article>
              </div>
              <div
                className="column is-5"
                // style={{ backgroundColor: "yellow" }}
              >
                <label className="label">Start a Visit</label>
                <button
                  className="button is-dark is-medium level-item"
                  onClick={() => submitNewVisit()}
                >
                  Start
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Registration);
