import React, { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";

import { API_URL, CLOUDINARY_URL, NO_PHOTO_MESSAGE } from "@/utils/constants";
import { urltoFile } from "@/utils/helpers";
import withAuth from "@/utils/auth";
import AppWebcam from "@/utils/webcam";

import PatientModal from "@/pages/registration/PatientModal";
import ScanModal from "@/pages/registration/ScanModal";

import { DisplayField } from "@/components/textContainers/DisplayField";
import { Button } from "@/components/textContainers/Button";
import Loading from "@/components/Loading";

const PatientInfo = ({ patient, submitNewVisit }) => {
  return patient.pk ? (
    <div>
      <div>
        <img
          src={`${CLOUDINARY_URL}/${patient.picture}`}
          alt="Placeholder image"
          className="has-ratio"
          style={{ height: 200, width: 200, objectFit: "cover" }}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 mt-2">
        <DisplayField
          label="ID"
          content={`${patient.village_prefix}${patient.pk
            .toString()
            .padStart(3, "0")}`}
        />
        <DisplayField label="Name" content={patient.name} />
        <DisplayField
          label="ID Number"
          content={patient.identification_number}
        />
        <DisplayField label="Gender" content={patient.gender} />
        <DisplayField label="Date of Birth" content={patient.date_of_birth} />
        <DisplayField label="Drug Allergies" content={patient.drug_allergy} />

        <Button
          text="Create New Visit"
          onClick={submitNewVisit}
          colour="green"
        />
      </div>
    </div>
  ) : (
    <div></div>
  );
};

const Registration = () => {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [patientsList, setPatientsList] = useState([]);
  const [patient, setPatient] = useState({});
  const [scanModalIsOpen, setScanModalIsOpen] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [cameraIsOpen, setCameraIsOpen] = useState(false);
  const [webcam, setWebcam] = useState(null);
  const [imageDetails, setImageDetails] = useState(null);
  const [formDetails, setFormDetails] = useState({
    name: "",
    identification_number: "",
    contact_no: "",
    date_of_birth: "",
    drug_allergy: "",
    gender: "Male",
    village_prefix: "SV",
  });

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    let { data: patients } = await axios.get(`${API_URL}/patients`);
    setPatientsList(patients);
  };

  // Webcam functions

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

  // General functions

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

    if (checklist.some((item) => formDetails[item].length === 0)) {
      toast.error("Please complete the form before submitting!");
      return;
    }

    if (formDetails["date_of_birth"].length !== 10) {
      toast.error("Please enter a valid date of birth!");
      return;
    }

    if (imageDetails == null) {
      toast.error(NO_PHOTO_MESSAGE);
      return;
    }

    setLoading(true);

    const payload = {
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

    const { data: response } = await axios
      .post(`${API_URL}/patients`, patientFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .catch((error) => {
        console.log(error.response.data);
      });

    if (typeof response.error !== "undefined") {
      toast.error(`Please retake photo! ${response.error}`);
      return;
    }

    setPatient(response);
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      gender: "Male",
      village_prefix: "SV",
    }));
    setImageDetails(null);
    toast.success("New patient created!");

    setModalIsOpen(false);
    submitNewVisit(response);
    setLoading(false);
  };

  const submitNewVisit = async (patient) => {
    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD"),
    };
    await axios.post(`${API_URL}/visits`, payload);
    toast.success("New visit created for patient!");
  };

  // Auto Suggestions functions
  const renderSuggestion = (suggestion) => {
    const name = suggestion.name;
    const id = `${suggestion.village_prefix} ${suggestion.pk
      .toString()
      .padStart(3, "0")}`;
    const imageURL = suggestion.picture;

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
    return suggestion.name;
  };

  const onChange = (event, { newValue }) => {
    setValue(newValue);
  };

  // Autosuggest will call this function every time you need to update suggestions.
  const onSuggestionsFetchRequested = ({ value }) => {
    const inputValue = value.trim().toLowerCase();
    const query =
      inputValue.length === 0
        ? []
        : patientsList.filter((patient) =>
            patient.filterString.toLowerCase().includes(inputValue),
          );

    setSuggestions(query);
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
        closeModal={() => {
          setModalIsOpen(false);
        }}
        handleInputChange={handleInputChange}
        submitNewPatient={submitNewPatient}
        toggleCameraOpen={toggleCameraOpen}
        customStyles={{
          content: {
            left: "25%",
            right: "7.5%",
          },
        }}
        loading={loading}
      />
      <ScanModal
        modalIsOpen={scanModalIsOpen}
        cameraIsOpen={cameraIsOpen}
        imageDetails={imageDetails}
        closeScanModal={() => {
          setScanModalIsOpen(false);
        }}
        renderWebcam={() => (
          <AppWebcam
            webcamSetRef={webcamSetRef}
            webcamCapture={webcamCapture}
          />
        )}
        toggleCameraOpen={toggleCameraOpen}
        customStyles={{
          content: {
            left: "25%",
            right: "7.5%",
          },
        }}
      />

      <div>
        {loading ? (
          <Loading />
        ) : (
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
                onClick={() => {
                  setScanModalIsOpen(true);
                }}
              />
              <Button
                colour="green"
                text="New Patient"
                onClick={() => {
                  setModalIsOpen(true);
                }}
              />
            </div>
            <PatientInfo
              patient={patient}
              submitNewVisit={() => submitNewVisit(patient)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default withAuth(Registration);
