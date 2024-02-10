import React, { useState, useEffect } from "react";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import { MedicalForm, PrescriptionForm } from "../components/forms/patient";
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
    loadMedicationStock();
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

  function toggleFormModal(order = {}) {
    loadMedicationStock();

    setState((prevState) => ({
      ...prevState,
      formModalIsOpen: !state.formModalIsOpen,
      medicationDetails: order,
      isEditing: Object.keys(order).length > 0,
    }));
  }

  async function loadMedicationStock() {
    let { data: medications } = await axios.get(`${API_URL}/medications`);

    let { data: orders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`,
    );

    // key -> medicine pk
    // value -> total reserved
    let reservedMedications = {};
    orders.forEach((order) => {
      let medicationID = order.medicine;
      let quantityReserved = order.quantity;

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

  function renderFormModal() {
    let {
      patient,
      isEditing,
      medications,
      medicationDetails,
      formModalIsOpen,
      reservedMedications,
      orders,
    } = state;
    let options = medications
      .filter((medication) => {
        for (let i = 0; i < orders.length; i++) {
          if (orders[i].medicine == medication.pk) return false;
        }
        return true;
      })
      .map((medication) => {
        let name = medication.fields.medicine_name;
        let pKey = medication.pk;

        var value = "";
        if (Object.keys(medicationDetails).length > 0)
          value = `${medicationDetails.medicine} ${medicationDetails.medicine_name}`;

        if (value == `${pKey} ${name}`)
          return (
            <option key={pKey} value={`${pKey} ${name}`}>
              {name}
            </option>
          );
        return (
          <option key={pKey} value={`${pKey} ${name}`}>
            {name}
          </option>
        );
      });

    return (
      <Modal
        isOpen={formModalIsOpen}
        onRequestClose={() => toggleFormModal()}
        style={formModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.fields.drug_allergy}
          handleInputChange={handlePrescriptionChange}
          formDetails={medicationDetails}
          isEditing={isEditing}
          medicationOptions={options}
          medications={medications}
          reservedMedications={reservedMedications}
          onSubmit={() => submitNewPrescription()}
        />
      </Modal>
    );
  }

  function handlePrescriptionChange(e) {
    let { medicationDetails } = state;

    const target = e.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      let pKey = value.split(" ")[0];
      let medicineName = value.split(" ").slice(1).join(" ");

      medicationDetails["medicine"] = pKey;
      medicationDetails["medicine_name"] = medicineName;
    } else {
      medicationDetails[name] = value;
    }

    setState((prevState) => ({
      ...prevState,
      medicationDetails,
    }));
  }

  function submitNewPrescription() {
    let { orders, medicationDetails, isEditing } = state;

    if (isEditing) {
      // go find that order
      let index = orders.findIndex((order) => {
        order.medication == medicationDetails.medication;
      });
      orders[index] = medicationDetails;
      // edit that order
    } else orders.push({ ...medicationDetails, order_status: "PENDING" });

    setState((prevState) => ({
      ...prevState,
      orders: orders,
      medicationDetails: {},
      formModalIsOpen: false,
    }));
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
    const router = Router;
    const { query } = router;
    const { form } = query;
    let { formDetails, visitID, orders } = state;

    orders.forEach((order) => {
      axios.patch(`${API_URL}/medications/${order.medicine}`, {
        quantityChange: -parseInt(order.quantity),
      });
    });

    //We still haven't figured out a way to let the backend handle new fields
    //which we want to create. Hence, we are using existing fields (problems, diagnosis, notes)
    //to store the data which we want to store :
    //NEW:                         STORED IN OLD FIELD OF:
    //Past Med History      ->     Problems
    //Consultation          ->     Diagnosis
    //Diagnosis (1 + 2 + 3) ->     Notes
    //Plan                  ->     Addendum

    //For Diagnosis (1 + 2 + 3), we have insufficient old fields to store the data in.
    //Hence, we are using a standardised text format to store the three possibilities
    //of diagnosis. By using this standardised format, we can use data manipulation
    //later on to retrieve and split the data as neccessary

    console.log(formDetails);

    let diagnosisFormat = "";

    for (let i = 0; i < formDetails.diagnoses.length; i++) {
      diagnosisFormat += `DIAGNOSIS ${i + 1}
          ${formDetails.diagnoses[i].details}
          ${
            !formDetails.diagnoses[i].type
              ? "Cardiovascular"
              : formDetails.diagnoses[i].type
          }
          
          `;
    }

    var formPayload = {
      visit: visitID,
      ...formDetails,
      notes: diagnosisFormat,
    };

    //For Referrals, we are also using a standardised text format to store information
    //from referred_for and referred_notes

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

    var consultId;
    var orderPromises;

    let { data: medicalConsult } = await axios.post(`${API_URL}/consults`, {
      ...formPayload,
      doctor: window.localStorage.getItem("userID"),
      type: "medical",
    });

    consultId = medicalConsult.id;
    orderPromises = [];

    orders.forEach((order) => {
      let orderPayload = {
        ...order,
        visit: visitID,
        doctor: window.localStorage.getItem("userID"),
        consult: consultId,
      };
      orderPromises.push(axios.post(`${API_URL}/orders`, orderPayload));
    });

    await Promise.all(orderPromises);
    toast.success("Medical Consult Completed!");

    Router.push("/queue");
  }

  function updateFormDetails(diagnoses) {
    // update the form details
    let { formDetails } = state;
    formDetails = { ...formDetails, diagnoses: diagnoses };

    setState((prevState) => ({ ...prevState, formDetails }));
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
          ? "No referrals"
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

    let { formDetails, orders } = state;

    let formContent = () => {
      return (
        <div>
          <MedicalForm
            updateFormDetails={updateFormDetails}
            formDetails={formDetails}
            handleInputChange={handleInputChange}
          />
          <hr />
          <label className="label">Prescriptions</label>
          {orders.length > 0 ? renderPrescriptionTable() : "No Prescriptions"}

          <hr />
          <CreateButton
            text={"Add Prescriptions"}
            onClick={() => toggleFormModal()}
          />
        </div>
      );
    };

    return (
      <div>
        {formContent()}

        <hr />

        <CreateButton text={"Submit"} onClick={() => submitForm()} />
      </div>
    );
  }

  function renderPrescriptionTable() {
    let { orders } = state;

    let orderRows = orders.map((order, index) => {
      let name = order.medicine_name;
      let quantity = order.quantity;

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
                    setState((prevState) => ({ ...prevState, orders }));
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
        {renderFormModal()}
        {renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
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
  return <>{render()}</>;
};

const formModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "12.5%",
    bottom: "12.5%",
  },
  overlay: {
    zIndex: 4,
  },
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
