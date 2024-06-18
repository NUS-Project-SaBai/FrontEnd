import React, { useState, useEffect } from "react";
import axios from "axios";
import Router from "next/router";
import Modal from "react-modal";
import {
  ConsultationsView,
  ConsultationsTable,
  VitalsForm,
  VitalsTable,
  VisitPrescriptionsTable,
  Header,
} from "@/pages/records/_components";
import { API_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import toast from "react-hot-toast";
import { Button } from "@/components/TextComponents/Button";

const Patient = () => {
  const [mounted, setMounted] = useState(false);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);

  const [consults, setConsults] = useState([]);
  const [visitPrescriptions, setVisitPrescriptions] = useState([]);
  const [vitals, setVitals] = useState({});
  const [visitID, setVisitID] = useState(null);

  const [formDetails, setFormDetails] = useState({});

  const [state, setState] = useState({
    patient: {},
    medications: [],
    visits: [],
    visitID: null,
    consults: [],
    orders: [],
    referredFor: [],
    vitals: {},
    formDetails: {},
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
    const patientId = Router.query.id;

    const { data: patient } = await axios.get(
      `${API_URL}/patients/${patientId}`,
    );

    const { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientId}`,
    );

    setPatient(patient);
    setVisits(visits);

    const visitID = visits[0].id;
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
    const { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`,
    );

    const { data: prescriptions } = await axios.get(`${API_URL}/orders`);

    const consultsEnriched = consults.map((consult) => {
      const consultPrescriptions = prescriptions.filter((prescription) => {
        return prescription.consult.id === consult.id;
      });

      return {
        ...consult,
        prescriptions: consultPrescriptions,
      };
    });

    const { data: vitals } = await axios.get(
      `${API_URL}/vitals?visit=${visitID}`,
    );

    setMounted(true);
    setConsults(consultsEnriched);
    setVitals(vitals[0] || {});
    setVisitPrescriptions(consultsEnriched.flatMap((x) => x.prescriptions));
    setVisitID(visitID);
  }

  async function submitForm() {
    const formPayload = {
      visit: visitID,
      ...formDetails,
    };
    await axios.patch(`${API_URL}/vitals?visit=${visitID}`, formPayload);
    toast.success("Vitals completed!");

    Router.push("/records");
  }

  function handleInputChange(e) {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }

  function handleVisitChange(e) {
    const value = e.target.value;
    loadVisitDetails(value);
  }

  function renderHeader() {
    return (
      <Header
        patient={patient}
        visits={visits}
        handleVisitChange={handleVisitChange}
      />
    );
  }

  function renderFirstColumn() {
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
    if (!mounted) return null;

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
