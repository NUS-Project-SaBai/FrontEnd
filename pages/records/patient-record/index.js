import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import moment from "moment";
import { ConsultationsView } from "@/pages/records/Consultations/ConsultationsView";
import { VitalsTable } from "@/pages/records/VitalsTable";
import { ConsultationsTable } from "@/pages/records/Consultations/ConsultationsTable";

import { VisitPrescriptionsTable } from "@/pages/records/VisitPrescriptionsTable";
import { PatientView } from "./PatientView";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import Router from "next/router";

import { Button } from "@/components/TextComponents/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

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
      patient: patient,
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
        <VitalsTable content={vitals} />
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
    const { vitals, patient } = state;

    return (
      <div className="my-2">
        {typeof vitals === "undefined" ? (
          <h2>Not Done</h2>
        ) : (
          <Button
            text={"View Vitals"}
            onClick={() => toggleViewModal("vitals")}
            colour="indigo"
          />
        )}
        <PatientView content={patient} />
      </div>
    );
  }

  function renderSecondColumn() {
    const { vitals, consults, visitPrescriptions } = state;
    return (
      <div className="space-y-8">
        <ConsultationsTable
          content={consults}
          buttonFunction={toggleViewModal}
        />
        <VisitPrescriptionsTable content={visitPrescriptions} />
      </div>
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
        <h1 className="text-3xl font-bold text-center text-sky-800 mb-6">
          Patient Records
        </h1>
        {renderHeader()}

        <hr className="mt-2" />

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
