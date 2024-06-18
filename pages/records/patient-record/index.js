import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import _, { set } from "lodash";
import Modal from "react-modal";
import moment from "moment";
import { ConsultationsView } from "@/pages/records/_components";
import { VitalsTable } from "@/pages/records/VitalsTable";
import { ConsultationsTable } from "@/pages/records/_components";

import { VisitPrescriptionsTable } from "@/pages/records/VisitPrescriptionsTable";
import { PatientView } from "./PatientView";
import { API_URL, CLOUDINARY_URL } from "@/utils/constants";
import withAuth from "@/utils/auth";
import Router from "next/router";

import { Button } from "@/components/TextComponents/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PatientRecord = () => {
  const [noRecords, setNoRecords] = useState(true);

  const [patient, setPatient] = useState({});
  const [visits, setVisits] = useState([]);
  const [vitals, setVitals] = useState({});

  const [consults, setConsults] = useState([]);
  const [selectedConsult, setSelectedConsult] = useState(null);

  const [visitPrescriptions, setVisitPrescriptions] = useState([]);

  const [vitalsModalOpen, setVitalsModalOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);

  const handleVisitChange = useCallback((event) => {
    const value = event.target.value;
    loadVisitDetails(value);
  }, []);

  useEffect(() => {
    onRefresh();
  }, []);

  async function onRefresh() {
    const patientID = Router.query.id;
    const { data: patient } = await axios.get(
      `${API_URL}/patients/${patientID}`,
    );
    const { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientID}`,
    );

    setPatient(patient);
    setVisits(visits);

    if (visits.length > 0) {
      const visitID = visits[0].id;
      loadVisitDetails(visitID);
    }
  }

  async function loadVisitDetails(visitID) {
    const { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`,
    );
    const { data: prescriptions } = await axios.get(`${API_URL}/orders`);
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

    setNoRecords(false);
    setVisitPrescriptions(consultsEnriched.flatMap((x) => x.prescriptions));
    setConsults(consultsEnriched);
    setVitals(vitals[0] || {});
  }

  function toggleVitalsModal() {
    setVitalsModalOpen(!vitalsModalOpen);
  }

  function toggleConsultationsModal() {
    setConsultationModalOpen(!consultationModalOpen);
  }

  function renderHeader() {
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
    return (
      <div className="my-2">
        {typeof vitals === "undefined" ? (
          <h2>Not Done</h2>
        ) : (
          <Button
            text={"View Vitals"}
            onClick={() => toggleVitalsModal()}
            colour="indigo"
          />
        )}
        <PatientView content={patient} />
      </div>
    );
  }

  function selectConsult(consult) {
    setSelectedConsult(consult);
    toggleConsultationsModal();
  }

  function renderSecondColumn() {
    return (
      <div className="space-y-8">
        <ConsultationsTable content={consults} buttonFunction={selectConsult} />
        <VisitPrescriptionsTable content={visitPrescriptions} />
      </div>
    );
  }

  function render() {
    if (noRecords)
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
        <Modal
          isOpen={vitalsModalOpen}
          onRequestClose={() => toggleVitalsModal()}
          style={viewModalStyles}
        >
          <VitalsTable content={vitals} />
        </Modal>
        <Modal
          isOpen={consultationModalOpen}
          onRequestClose={() => toggleConsultationsModal()}
          style={viewModalStyles}
        >
          <ConsultationsView content={selectedConsult} />
        </Modal>
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

export default withAuth(PatientRecord);
