import React from "react";
import { withAuthSync, logInCheck } from "../utils/auth";
import Autosuggest from "react-autosuggest";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import Webcam from "react-webcam";
import moment from "moment";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import { urltoFile } from "../utils/helpers";
import record from "./record";

// put id

Modal.setAppElement("#__next");

class Patients extends React.Component {
  static async getInitialProps(ctx) {
    let authentication = await logInCheck(ctx);

    let { query } = ctx;

    return { query };
  }

  constructor() {
    super();

    // Autosuggest is a controlled component.
    // This means that you need to provide an input value
    // and an onChange handler that updates this value (see below).
    // Suggestions also need to be provided to the Autosuggest,
    // and they are initially empty because the Autosuggest is closed.
    this.state = {
      value: "",
      suggestions: [],
      patients: [],
      patient: {},
      scanModalIsOpen: false,
      modalIsOpen: false,
      cameraIsOpen: false,
      imageDetails: null,
      formDetails: {
        gender: "Male",
        village_prefix: "CATT",
      },
      scanOptions: {
        gender: "Male",
        village_prefix: "CATT",
      },
      possibleOptions: [],
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openScanModal = this.openScanModal.bind(this);
    this.closeScanModal = this.closeScanModal.bind(this);
    this.renderSuggestion = this.renderSuggestion.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.webcamSetRef = this.webcamSetRef.bind(this);
    this.webcamCapture = this.webcamCapture.bind(this);
    this.submitNewPatient = this.submitNewPatient.bind(this);
    this.handleScanOptionsChange = this.handleScanOptionsChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: patients } = await axios.get(`${API_URL}/patients`);
    let patientsEnriched = this.patientsEnrich(patients);
    this.setState({ patients: patientsEnriched });
  }

  /**
   * Webcam functions
   */

  webcamSetRef(webcam) {
    this.webcam = webcam;
  }

  webcamCapture() {
    const imageSrc = this.webcam.getScreenshot();
    this.setState({
      imageDetails: imageSrc,
      isCameraOpen: false,
    });
  }

  renderWebcam() {
    return (
      <div
        style={{
          height: 250,
          width: 250,
          margin: "0 auto",
        }}
      >
        <Webcam
          audio={false}
          height={250}
          width={250}
          ref={this.webcamSetRef}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
        />

        <div
          style={{
            textAlign: "center",
          }}
        >
          <button
            className="button is-dark is-medium"
            onClick={this.webcamCapture}
          >
            Capture
          </button>
        </div>
      </div>
    );
  }

  /**
   * General functions
   */
  // for noww, all we want to do is to add a filter string to this
  // perhaps in the future, we would want to let our backend do this for us
  patientsEnrich(patients) {
    let patientsEnriched = patients.map((patient) => {
      let patient_details = patient.fields;
      let name = patient_details.name;
      let contact_no = patient_details.contact_no;
      let village = patient_details.village_prefix;
      let id = patient.pk;
      let localName = patient_details.local_name;

      return {
        ...patient,
        filterString: `${village}` + `${id}`.padStart(3,'0') 
                      + ` ${village}${id} ${name} ${contact_no} ${localName}`,
      };
    });

    return patientsEnriched;
  }

  handleInputChange(event) {
    let { formDetails } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    formDetails[name] = value;

    this.setState({
      formDetails,
    });
  }

  handleScanOptionsChange(event) {
    let { scanOptions } = this.state;

    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    scanOptions[name] = value;

    this.setState({
      scanOptions,
    });
  }

  async submitNewPatient() {
    // console.log("In submit new patient");
    let { formDetails, imageDetails } = this.state;

    let checklist = [
      "name",
      "local_name",
      "gender",
      "contact_no",
      "travelling_time_to_village",
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
      alert("Please complete the form before submitting!");
    } else if (imageDetails == null) {
      alert("Please take a photo before submitting!");
    } else {
      let payload = {
        ...formDetails,
        picture: await urltoFile(
          imageDetails,
          "patient_screenshot.jpg",
          "image/jpg"
        ),
      };
      const patientFormData = new FormData();
      Object.keys(payload).forEach((key) =>
        patientFormData.append(key, payload[key])
      );

      let { data: response } = await axios.post(
        `${API_URL}/patients`,
        patientFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (typeof response.error == "undefined") {
        // await this.submitNewVisit();
        //console.log(response[0]);
        this.setState({
          patient: response[0],
          formDetails: {
            gender: "Male",
            village_prefix: "CATT",
          },
          imageDetails: null,
        });
        //console.log(this.state);
        //console.log("testing!!!!!!!!");
        alert("New patient registered!");
        this.closeModal();
        this.setState({ patient: "test" });
        //console.log(this.state);
        //console.log(response[0]);
        this.setState({patient: response[0]});
        this.autoSubmitNewVisit(response[0]);
      } else {
        alert("Please retake photo!");
      }
    }
  }

  async scanPatient() {
    let { scanOptions, imageDetails } = this.state;
    let payload = {
      imageDetails,
    };

    let gender = scanOptions.gender;
    let scanUrl = `${API_URL}/patients/find_by_scan?`;
    scanUrl += `gender=${gender}`;
    if (typeof scanOptions.village_prefix != "undefined") {
      scanUrl += `&village_prefix=${scanOptions.village_prefix}`;
    }

    let { data: possibleOptions } = await axios.post(scanUrl, payload);
    if (possibleOptions.length > 0) alert("Options found!");
    else alert("No options found!");

    this.setState({ possibleOptions });
  }

  async submitNewVisit() {
    let { patient } = this.state;
    //console.log("In submit new visit");
    // future helper function
    // get all active visits
    // sort them by their statuses
    // from there, determine where to put this guy
    //console.log(patient);
    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD"),
    };
    //console.log(payload);
    await axios.post(`${API_URL}/visits`, payload);

    this.setState({
      patient: {},
    });
    alert("Visit started!");
  }

  async autoSubmitNewVisit(patient) {
    //console.log("Auto submit new visit");
    // future helper function
    // get all active visits
    // sort them by their statuses
    // from there, determine where to put this guy
    //console.log(patient);
    let payload = {
      patient: patient.pk,
      status: "started",
      visit_date: moment().format("YYYY-MM-DD"),
    };
    //console.log(payload);
    await axios.post(`${API_URL}/visits`, payload);
    alert("Patient successfully registered!");
  }

  /**
   * Modal functions
   */

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  openScanModal() {
    this.setState({ scanModalIsOpen: true });
  }

  closeScanModal() {
    this.setState({ scanModalIsOpen: false });
  }

  renderScanModal() {
    let { scanOptions, possibleOptions } = this.state;

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
            this.closeScanModal();
            this.setState({ patient: option });
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

    return (
      <Modal
        isOpen={this.state.scanModalIsOpen}
        // onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeScanModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div>
          <h1 style={{ color: "black", fontSize: "1.5em", marginBottom: 15 }}>
            Scan Face
          </h1>
          <div className="columns">
            <div className="column is-4">
              {!this.state.isCameraOpen && (
                <div
                  style={{
                    margin: "0 auto",
                    height: 250,
                    width: 250,
                    backgroundColor: "grey",
                  }}
                >
                  {this.state.imageDetails != null && (
                    <img src={this.state.imageDetails} />
                  )}
                </div>
              )}

              {this.state.isCameraOpen && (
                <div className="control">
                  {/* <WebcamCapture /> */}
                  {this.renderWebcam()}
                </div>
              )}
              <div
                style={{
                  textAlign: "center",
                }}
              >
                <button
                  className="button is-dark is-medium"
                  onClick={() =>
                    this.setState({ isCameraOpen: !this.state.isCameraOpen })
                  }
                  style={{ marginTop: this.state.isCameraOpen ? 60 : 15 }}
                >
                  {this.state.isCameraOpen ? "Cancel" : "Take Photo"}
                </button>
              </div>
            </div>
            <div className="column is-4">
              <div className="field">
                <label className="label">Gender</label>
                <div className="control">
                  <div className="select" style={{ margin: "0 auto" }}>
                    <select
                      name="gender"
                      onChange={this.handleScanOptionsChange}
                    >
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
                    onChange={this.handleScanOptionsChange}
                    value={scanOptions.village_prefix}
                  />
                </div>
              </div>

              <div>
                <button
                  className="button is-dark is-medium"
                  onClick={() => this.scanPatient()}
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
  }

  // submitNewPatientAndStartVisit = (event) => {
  //   this.submitNewPatient();
  //   this.submitNewVisit();
  //   console.log("Submit both");
  // };

  renderModal() {
    const { formDetails } = this.state;

    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
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
                    onChange={this.handleInputChange}
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
                    onChange={this.handleInputChange}
                    value={formDetails.local_name}
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Gender</label>
                <div className="control">
                  <div className="select">
                    <select name="gender" onChange={this.handleInputChange}>
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
                      onChange={this.handleInputChange}
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
                      onChange={this.handleInputChange}
                      value={formDetails.date_of_birth}
                    />
                  </div>
                </div>
              </div>

              <div className="field is-grouped">
                <div className="control is-expanded">
                  <label className="label">Village Prefix</label>
                  <div className="control">
                    <div className="select">
                      <select
                        name="village_prefix"
                        onChange={this.handleInputChange}
                        default="CATT"
                      >
                        <option value="CATT">CATT</option>
                        <option value="PC">PC</option>
                        <option value="TK">TK</option>
                        <option value="TT">TT</option>
                      </select>
                    </div>
                    {/* <input
                      name="village_prefix"
                      className="input"
                      type="text"
                      onChange={this.handleInputChange}
                      value={formDetails.village_prefix}
                    /> */}
                  </div>
                </div>

                <div className="control is-expanded">
                  <label className="label">Travelling Time to Village</label>
                  <div className="control">
                    <input
                      name="travelling_time_to_village"
                      className="input"
                      type="number"
                      onChange={this.handleInputChange}
                      value={formDetails.travelling_time_to_village}
                    />
                  </div>
                </div>
              </div>

              <div className="field">
                <label className="label">Drug Allergies</label>
                <div className="control">
                  <textarea
                    name="drug_allergy"
                    className="textarea"
                    placeholder="Textarea"
                    onChange={this.handleInputChange}
                    value={formDetails.drug_allergy}
                  />
                </div>
              </div>
            </form>
            <div className="levels" style={{ marginTop: 10 }}>
              <div className="level-left">
                <div className="level-item">
                  <button
                    className="button is-dark is-medium"
                    onClick={this.submitNewPatient}
                    // onClick={this.submitNewPatientAndStartVisit}
                  >
                    Submit
                  </button>
                </div>

                <div className="level-item">
                  <button
                    className="button is-dark is-medium"
                    onClick={this.closeModal}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="column is-4">
            {!this.state.isCameraOpen && (
              <div
                style={{
                  margin: "0 auto",
                  height: 250,
                  width: 250,
                  backgroundColor: "grey",
                }}
              >
                {this.state.imageDetails != null && (
                  <img src={this.state.imageDetails} />
                )}
              </div>
            )}

            {this.state.isCameraOpen && (
              <div className="control">
                {/* <WebcamCapture /> */}
                {this.renderWebcam()}
              </div>
            )}
            <div
              style={{
                textAlign: "center",
              }}
            >
              <button
                className="button is-dark is-medium"
                onClick={() =>
                  this.setState({ isCameraOpen: !this.state.isCameraOpen })
                }
                style={{ marginTop: this.state.isCameraOpen ? 60 : 15 }}
              >
                {this.state.isCameraOpen ? "Cancel" : "Take Photo"}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    );
  }

  /**
   * Auto Suggestions functions
   */

  getSuggestions(filter) {
    let { patients } = this.state;
    //console.log(patients);
    let inputValue = filter.trim().toLowerCase();
    let inputLength = inputValue.length;
    let query =
      inputLength === 0
        ? []
        : patients.filter(
            (patient) =>
              patient.filterString.toLowerCase().includes(inputValue)
          );
    return query;
  }

  renderSuggestion(suggestion) {
    let name = suggestion.fields.name;
    let id = `${suggestion.fields.village_prefix} ${suggestion.pk
      .toString()
      .padStart(3, "0")}`;
    let imageURL = suggestion.fields.picture;
    //console.log(suggestion);

    return (
      <div
        className="card"
        style={{ width: 500, margin: 0, padding: 0 }}
        onClick={() => this.setState({ patient: suggestion })}
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
  }

  // When suggestion is clicked, Autosuggest needs to populate the input
  // based on the clicked suggestion. Teach Autosuggest how to calculate the
  // input value for every given suggestion.
  getSuggestionValue(suggestion) {
    return suggestion.fields.name;
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue,
    });
  };

  // Autosuggest will call this function every time you need to update suggestions.
  // You already implemented this logic above, so just use it.
  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value),
    });
  };

  // Autosuggest will call this function every time you need to clear suggestions.
  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  renderPatient() {
    let { patient } = this.state;

    return (
      <div>
        <h1>{patient.fields.name}</h1>
        <h1>
          {patient.fields.village_prefix} {patient.pk}
        </h1>
      </div>
    );
  }

  render() {
    const { value, suggestions, patient } = this.state;

    // Autosuggest will pass through all these props to the input.
    const inputProps = {
      placeholder: "Search Patient",
      type: "search",
      value,
      onChange: this.onChange,
      className: "input is-medium level-item",
      style: { width: 500 },
    };

    // Finally, render it!
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
          // position: "relative"
        }}
      >
        {this.renderModal()}
        {this.renderScanModal()}
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Registration</h1>
          <div className="columns is-vcentered">
            <div className="column is-12">
              <div className="levels" style={{ marginBottom: 10 }}>
                <div className="level-left">
                  <button
                    className="button is-dark is-medium level-item"
                    onClick={this.openModal}
                  >
                    New Patient
                  </button>
                </div>
              </div>

              <div>
                <Autosuggest
                  suggestions={suggestions}
                  onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                  onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                  getSuggestionValue={this.getSuggestionValue}
                  renderSuggestion={this.renderSuggestion}
                  inputProps={inputProps}
                />
              </div>
            </div>
          </div>
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
                <div className="message-body">{patient.fields.local_name}</div>
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
              <label className="label">Travelling Time to Village</label>
              <article className="message">
                <div className="message-body">
                  {patient.fields.travelling_time_to_village}
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
                onClick={() => this.submitNewVisit()}
              >
                Start
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const customStyles = {
  content: {
    left: "25%",
    right: "7.5%",
  },
};

const videoConstraints = {
  width: 720,
  height: 720,
  facingMode: "user",
};

export default withAuthSync(Patients);
