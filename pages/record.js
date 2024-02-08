import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import moment from "moment";
import { ConsultationsView } from "@/components/views/Consultations/ConsultationsView";
import { VitalsView } from "@/components/views/Vitals/VitalsView";
import { ConsultationsTable } from "@/components/views/Consultations/ConsultationsTable";

import { VisitPrescriptionsTable } from "@/components/views/Prescriptions/VisitPrescriptionsTable";
import { PatientView } from "../components/views/patient";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";
import Router from "next/router";
import { ViewButton } from "@/components/textContainers.js/ViewButton";

Modal.setAppElement("#__next");

const Record = () => {
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
    formDetails: {},
    medicationDetails: {},
    formModalOpen: false,
    isEditing: false,
    viewModalOpen: false,
    modalContent: {},
  });

  const handleVisitChange = useCallback((event) => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const router = Router;
    const { query } = router;
    const { id: patientId } = query;
    const { data: patient } = await axios.get(
      `${API_URL}/patients/${patientId}`,
    );
    const { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientId}`,
    );
    const visitsSorted = visits.sort((a, b) => b.id - a.id);
    setState((prevState) => ({
      ...prevState,
      patient: patient[0],
      visits: visitsSorted,
    }));
    if (visitsSorted.length > 0) {
      const visitID = visitsSorted[0].id;
      loadVisitDetails(visitID);
      loadMedicationStock();
    }
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
    const { vitals, viewModalOpen, consult, viewType } = state;
    const modalContent =
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
      >
        {modalContent}
      </Modal>
    );
  }

  async function loadMedicationStock() {
    const { data: medications } = await axios.get(`${API_URL}/medications`);
    const { data: orders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`,
    );
    const reservedMedications = {};
    orders.forEach((order) => {
      const medicationID = order.medicine;
      const quantityReserved = order.quantity;
      if (typeof reservedMedications[medicationID] === "undefined") {
        reservedMedications[medicationID] = quantityReserved;
      } else {
        reservedMedications[medicationID] =
          reservedMedications[medicationID] + quantityReserved;
      }
    });
    setState((prevState) => ({
      ...prevState,
      medications,
      reservedMedications,
    }));
  }

  async function loadVisitDetails(visitID) {
    const { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`,
    );
    const { data: prescriptions } = await axios.get(
      `${API_URL}/orders?visit=${visitID}`,
    );
    const consultsEnriched = consults.map((consult) => {
      const consultPrescriptions = prescriptions.filter(
        (prescription) => prescription.consult.id === consult.id,
      );
      return {
        ...consult,
        prescriptions: consultPrescriptions,
      };
    });
    const { data: vitals } = await axios.get(
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

  function renderHeader() {
    const { patient, visits } = state;
    console.log("Render: ", state);
    const visitOptions = visits.map((visit) => {
      const date = moment(visit.date).format("DD MMMM YYYY");
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
          <div className="column is-3"></div>
        </div>
      </div>
    );
  }

  function renderFirstColumn() {
    const { vitals, patient } = state;

    return (
      <div>
        <label className="label">View Detailed Signs</label>
        {typeof vitals === "undefined" ? (
          <h2>Not Done</h2>
        ) : (
          <ViewButton text={"View"} onClick={() => toggleViewModal("vitals")} />
        )}
        <PatientView content={patient} /> ;
      </div>
    );
  }

  function renderSecondColumn() {
    const { vitals, consults, visitPrescriptions } = state;
    const consultRows = consults.map((consult) => {
      const doctor = consult.doctor.username;
      const referredFor =
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
      <div>
        <hr />
        <label className="label">Consultations</label>
        {consults.length > 0 ? (
          <ConsultationsTable consultRows={consultRows} />
        ) : (
          <h2>Not Done</h2>
        )}

        <hr />
        <label className="label">Prescriptions</label>
        {visitPrescriptions.length > 0 ? (
          <VisitPrescriptionsTable content={visitPrescriptions} />
        ) : (
          <h2>Not Done</h2>
        )}
      </div>
    );
  }

  function renderPrescriptionTable() {
    const { orders } = state;

    const orderRows = orders.map((order, index) => {
      const name = order.medicine.medicine_name;
      const quantity = order.quantity;

      return (
        <tr key={order.id}>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>
            <div className="levels">
              <div className="level-left">
                <button
                  className="button is-dark level-item"
                  onClick={() => toggleFormModal(order)}
                >
                  Edit
                </button>
                <button
                  className="button is-dark level-item"
                  onClick={() => {
                    orders.splice(index, 1);
                    setState({ orders });
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    });
    return (
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Medicine Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </table>
    );
  }

  function render() {
    if (!state.mounted)
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h2 style={{ color: "black", fontSize: "1.5em" }}>
            This patient has no records currently
          </h2>
        </div>
      );

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        {renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
        {renderHeader()}

        <hr />

        <div className="grid grid-cols-2 gap-x-6">
          <div>{renderFirstColumn()}</div>
          <div>{renderSecondColumn()}</div>
        </div>
      </div>
    );
  }

  return <>{render()}</>;
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

export default withAuth(Record);
