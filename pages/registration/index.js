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
import { DisplayField } from "@/components/textContainers/DispayField";
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
      "identification_number",
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
        className="card cursor-pointer grid grid-cols-2"
        onClick={() => setPatient(suggestion)}
      >
        <div className="self-center">
          <img
            src={`${CLOUDINARY_URL}/${imageURL}`}
            alt="Placeholder image"
            className="object-cover h-28 w-28 my-2"
          />
        </div>

        <div className="flex flex-col justify-center ml-2">
          <div className="text-s font-medium text-gray-900">{id}</div>
          <div className="text-s font-medium text-gray-900">{name}</div>
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
    className:
      "block w-full rounded-md border-0 py-1.5 px-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
  };

  const autosuggestTheme = {
    container: "react-autosuggest__container w-full",
    input: "react-autosuggest__input form-input w-full",
    suggestionsContainer:
      "react-autosuggest__suggestions-container w-full mt-2 border border-gray-300 rounded-md",
    suggestionsList: "react-autosuggest__suggestions-list w-full space-y-2 p-2",
    suggestion:
      "react-autosuggest__suggestion block w-full hover:bg-blue-100 transition-colors duration-300 ease-in-out p-2 border border-gray-300 rounded-md",
  };

  return (
    <div className="mx-4">
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
          <div className="flex items-center justify-center mb-2 w-full">
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={onSuggestionsFetchRequested}
              onSuggestionsClearRequested={onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              theme={autosuggestTheme}
            />
          </div>
          <div className="flex items-center justify-center mb-6 gap-3">
            <Button
              colour="green"
              text="Start Facial Recognition"
              onClick={openScanModal}
            />
            <Button colour="green" text="New Patient" onClick={openModal} />
          </div>
          {typeof patient.pk !== "undefined" && (
            <div>
              <div>
                <img
                  src={`${CLOUDINARY_URL}/${patient.fields.picture}`}
                  alt="Placeholder image"
                  className="has-ratio"
                  style={{ height: 200, width: 200, objectFit: "cover" }}
                />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-2">
                <DisplayField
                  label="ID"
                  content={`${patient.fields.village_prefix}${patient.pk
                    .toString()
                    .padStart(3, "0")}`}
                />
                <DisplayField label="Name" content={patient.fields.name} />
                <DisplayField
                  label="IC Number"
                  content={patient.fields.identification_number}
                />
                <DisplayField label="Gender" content={patient.fields.gender} />
                <DisplayField
                  label="Date of Birth"
                  content={patient.fields.date_of_birth}
                />
                <DisplayField
                  label="Drug Allergies"
                  content={patient.fields.drug_allergy}
                />

                <Button
                  text="Create New Visit"
                  onClick={() => submitNewVisit()}
                  colour="green"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default withAuth(Registration);
