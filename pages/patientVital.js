import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import { VitalsForm } from "../components/forms/patient";
import { ConsultationsView } from "@/components/views/Consultations/ConsultationsView";
import { VitalsView } from "@/components/views/Vitals/VitalsView";
import { ConsultationsTable } from "@/components/views/Consultations/ConsultationsTable";
import { VisitPrescriptionsTable } from "@/components/views/Prescriptions/VisitPrescriptionsTable";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";
import toast from "react-hot-toast";
import { CreateButton } from "@/components/textContainers.js/CreateButton";
import { ViewButton } from "@/components/textContainers.js/ViewButton";

Modal.setAppElement("#__next");

const Patient = () => {
  const [state, setState] = useState({
    mounted: false,
    patient: {},
    medications: [],
    visits: [],
    visitID: null,
    consults: [],
    orders: [],
    referredFor: [],
    vitals: {},
    formDetails: { diagnoses: [] },
    medicationDetails: {},
    formModalOpen: false,
    isEditing: false,
    viewModalOpen: false,
    modalContent: {},
  });

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    // let { id: patientId } = this.props.query;
    const router = Router;
    const { query } = router;
    const { id: patientId } = query;

    // gets patient data
    let { data: patient } = await axios.get(`${API_URL}/patients/${patientId}`);

    // gets all visit data
    let { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientId}`,
    );

    // sorts
    let visitsSorted = visits.sort((a, b) => {
      return b.id - a.id;
    });

    setState((prevState) => ({
      ...prevState,
      patient: patient[0],
      visits: visitsSorted,
    }));

    let visitID = visitsSorted[0].id;
    loadVisitDetails(visitID);
  }

  function toggleViewModal(viewType = null, consult = {}) {
    setState((prevState) => ({
      ...prevState,
      viewModalOpen: !state.viewModalOpen,
      viewType,
      consult,
    }));
  }

  function renderViewModal() {
    let { vitals, viewModalOpen, consult, viewType } = state;

    let modalContent =
      viewType == "vitals" ? (
        <VitalsView content={vitals} />
      ) : (
        <ConsultationsView content={consult} />
      );

    return (
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={() => toggleViewModal()}
        style={viewModalStyles}
        contentLabel="Example Modal"
      >
        {modalContent}
      </Modal>
    );
  }

  async function loadVisitDetails(visitID) {
    let { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`,
    );

    let { data: prescriptions } = await axios.get(
      `${API_URL}/orders?visit=${visitID}`,
    );

    let consultsEnriched = consults.map((consult) => {
      let consultPrescriptions = prescriptions.filter((prescription) => {
        return prescription.consult.id === consult.id;
      });

      return {
        ...consult,
        prescriptions: consultPrescriptions,
      };
    });

    let { data: vitals } = await axios.get(
      `${API_URL}/vitals?visit=${visitID}`,
    );

    setState((prevState) => ({
      ...prevState,
      consults: consultsEnriched,
      vitals: vitals[0] || {},
      visitPrescriptions: consultsEnriched.flatMap((x) => x.prescriptions),
      mounted: true,
      visitID,
    }));
  }

  async function submitForm() {
    //Post 405 error
    let { formDetails, visitID } = state;
    console.log(formDetails);

    var formPayload = {
      visit: visitID,
      ...formDetails,
    };

    if (formDetails.referred_for) {
      const referrals = `
          Referred For: ${formDetails.referred_for}
          Notes:
          ${formDetails.referred_notes || "No Notes Provided"}`;
      formPayload = {
        ...formPayload,
        referrals: referrals,
      };
    }

    await axios.post(`${API_URL}/vitals`, formPayload);
    toast.success("Vitals completed!");

    Router.push("/queue");
  }

  function handleInputChange(e) {
    let { formDetails } = state;

    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    formDetails[name] = value;

    setState((prevState) => ({
      ...prevState,
      formDetails,
    }));
  }

  function handleVisitChange(e) {
    const value = e.target.value;

    // pull the latest visit

    // this.setState({ visitID: value });
    loadVisitDetails(value);
  }

  function renderHeader() {
    let { patient, visits } = state;
    let visitOptions = visits.map((visit) => {
      let date = moment(visit.visit_date).format("DD MMMM YYYY");

      return (
        <option key={visit.id} value={visit.id}>
          {date}
        </option>
      );
    });

    return (
      <div className="column is-12">
        <div className="columns is-12">
          <div className="column is-2">
            <img
              src={`${CLOUDINARY_URL}/${patient.fields.picture}`}
              alt="Placeholder image"
              className="has-ratio"
              style={{
                height: 200,
                width: 200,
                objectFit: "cover",
              }}
            />
          </div>
          <div className="column is-3">
            <label className="label">Village ID</label>
            <article className="message">
              <div className="message-body">{`${
                patient.fields.village_prefix
              }${patient.pk.toString().padStart(3, "0")}`}</div>
            </article>
            <label className="label">Visit on</label>
            <div className="select is-fullwidth">
              <select name={"medication"} onChange={handleVisitChange}>
                {visitOptions}
              </select>
            </div>
          </div>
          <div className="column is-3">
            <label className="label">Name</label>
            <article className="message">
              <div className="message-body">{patient.fields.name}</div>
            </article>
          </div>
          <div className="column is-3">
            <label className="label">Age</label>
            <article className="message">
              <div className="message-body">
                {patient.fields.date_of_birth
                  ? Math.abs(
                      new Date(
                        Date.now() - new Date(patient.fields.date_of_birth),
                      ).getUTCFullYear() - 1970,
                    )
                  : "No DOB"}
              </div>
            </article>
          </div>
          <div className="column is-3"></div>
        </div>
      </div>
    );
  }

  function renderFirstColumn() {
    let { vitals, consults, visitPrescriptions } = state;
    let consultRows = consults.map((consult) => {
      // let type = consult.type;
      // let subType = consult.sub_type == null ? "General" : consult.sub_type;
      let doctor = consult.doctor.username;
      let referredFor =
        consult.referrals == null || consult.referrals == ""
          ? "None"
          : consult.referrals.split("\n")[0].split(" ")[2];
      return (
        <tr key={consult.id}>
          <td class="py-2 px-2 border-b border-gray-200 align-middle">
            {doctor}
          </td>
          <td class="py-2 px-2 border-b border-gray-200 align-middle">
            {referredFor}
          </td>
          <td class="px-2 border-b border-gray-200 align-middle">
            <ViewButton
              text={"View"}
              onClick={() => toggleViewModal("consult", consult)}
            />
          </td>
        </tr>
      );
    });

    return (
      <div className="column is-5">
        {typeof vitals === "undefined" ? (
          <>
            <label className="label">Vital Signs</label>
            <h2>Not Done</h2>
          </>
        ) : (
          <VitalsView content={vitals} />
        )}

        <hr />
        <label className="label mt-4">Consultations</label>
        {consults.length > 0 ? (
          <ConsultationsTable consultRows={consultRows} />
        ) : (
          <h2>Not Done</h2>
        )}

        <hr />
        <label className="label mt-4">Prescriptions</label>
        {visitPrescriptions.length > 0 ? (
          <VisitPrescriptionsTable content={visitPrescriptions} />
        ) : (
          <h2>Not Done</h2>
        )}
      </div>
    );
  }

  function renderSecondColumn() {
    //let { form } = this.props.query;
    const router = Router;
    const { query } = router;

    let { formDetails, patient } = state;

    return (
      <div className="column is-7">
        <VitalsForm
          formDetails={formDetails}
          handleInputChange={handleInputChange}
          patient={patient}
        />

        <hr />

        <CreateButton text={"Submit"} onClick={() => submitForm()} />
      </div>
    );
  }

  function render() {
    console.log("STATE:", state);
    if (!state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
          overflowX: "hidden", //remove horizontal scrollbar
        }}
      >
        {renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
        {renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="column is-12">
          <div className="columns is-12 mb-4">
            {renderFirstColumn()}
            {renderSecondColumn()}
          </div>
        </div>
      </div>
    );
  }
  return render();
};

const viewModalStyles = {
  content: {
    left: "30%",
    right: "12.5%",
    top: "12.5%",
    bottom: "12.5%",
  },
  overlay: {
    zIndex: 4,
  },
};

export default withAuth(Patient);
