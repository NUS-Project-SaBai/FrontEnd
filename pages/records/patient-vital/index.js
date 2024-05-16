import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import { VitalsForm } from "@/pages/records/Forms/VitalsForm";
import { ConsultationsView } from "@/pages/records/Consultations/ConsultationsView";
import { VitalsTable } from "@/pages/records/VitalsTable";
import { ConsultationsTable } from "@/pages/records/Consultations/ConsultationsTable";
import { VisitPrescriptionsTable } from "@/pages/records/VisitPrescriptionsTable";
import { API_URL, CLOUDINARY_URL } from "../../../utils/constants";
import withAuth from "../../../utils/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/TextComponents/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
      patient: patient,
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
    let { consult, viewModalOpen } = state;

    let modalContent = <ConsultationsView content={consult} />;
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

    Router.push("/records");
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
    const { patient, visits } = state;

    const visitOptions = visits.map((visit) => {
      const date = moment(visit.date).format("DD MMMM YYYY");
      return (
        <option key={visit.id} value={visit.id}>
          {date}
        </option>
      );
    });

    return (
      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 md:col-span-2">
          <img
            src={`${CLOUDINARY_URL}/${patient.picture}`}
            alt="Placeholder image"
            className="h-48 w-48 object-cover rounded-md"
          />
        </div>
        <div className="col-span-12 md:col-span-3">
          <div>
            <label className="block text-gray-700">Village ID</label>
            <p className="text-lg font-medium">{`${
              patient.village_prefix
            }${patient.pk.toString().padStart(3, "0")}`}</p>
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Visit on</label>
            <div className="relative">
              <select
                name="medication"
                onChange={handleVisitChange}
                className="block w-full bg-white border border-gray-300 rounded-md py-2 px-4 appearance-none focus:outline-none focus:border-blue-500"
              >
                {visitOptions}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDownIcon className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-3">
          <div>
            <label className="block text-gray-700">Name</label>
            <p className="text-lg font-medium">{patient.name}</p>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4"></div>
      </div>
    );
  }

  function renderFirstColumn() {
    let { vitals, consults, visitPrescriptions } = state;

    return (
      <div className="space-y-4">
        {typeof vitals === "undefined" ? (
          <>
            <label className="label">Vital Signs</label>
            <h2>Not Done</h2>
          </>
        ) : (
          <VitalsTable content={vitals} />
        )}

        <ConsultationsTable
          content={consults}
          buttonFunction={toggleViewModal}
        />

        <VisitPrescriptionsTable content={visitPrescriptions} />
      </div>
    );
  }

  function renderSecondColumn() {
    //let { form } = this.props.query;
    const router = Router;
    const { query } = router;

    let { formDetails, patient } = state;

    return (
      <div className="space-y-2">
        <VitalsForm
          formDetails={formDetails}
          handleInputChange={handleInputChange}
          patient={patient}
        />

        <Button colour="green" text={"Submit"} onClick={() => submitForm()} />
      </div>
    );
  }

  function render() {
    if (!state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
          overflowX: "hidden", //remove horizontal scrollbar
          overflowY: "hidden",
        }}
      >
        {renderViewModal()}
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Vitals
        </h1>
        {renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="grid grid-cols-2 gap-x-4 mb-4">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
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
