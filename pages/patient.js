import React from "react";
import axios from "axios";
import _ from "lodash";
import Router from "next/router";
import Modal from "react-modal";
import moment from "moment";
import {
  VitalsForm,
  MedicalForm,
  PrescriptionForm,
} from "../components/forms/patient";
import {
  ConsultationsTable,
  ConsultationsView,
  VitalsView,
  VisitPrescriptionsTable,
} from "../components/views/patient";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";

Modal.setAppElement("#__next");

class Patient extends React.Component {
  constructor() {
    super();

    this.state = {
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
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePrescriptionChange = this.handlePrescriptionChange.bind(this);
    this.handleVisitChange = this.handleVisitChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { id: patientId } = this.props.query;
    // gets patient data
    let { data: patient } = await axios.get(`${API_URL}/patients/${patientId}`);

    // gets all visit data
    let { data: visits } = await axios.get(
      `${API_URL}/visits?patient=${patientId}`
    );

    // sorts
    let visitsSorted = visits.sort((a, b) => {
      return b.id - a.id;
    });

    this.setState({
      patient: patient[0],
      visits: visitsSorted,
    });

    let visitID = visitsSorted[0].id;
    this.loadVisitDetails(visitID);
    this.loadMedicationStock();
  }

  toggleViewModal(viewType = null, consult = {}) {
    this.setState({
      viewModalOpen: !this.state.viewModalOpen,
      viewType,
      consult,
    });
  }

  renderViewModal() {
    let { vitals, viewModalOpen, consult, viewType } = this.state;

    let modalContent =
      viewType == "vitals" ? (
        <VitalsView content={vitals} />
      ) : (
        <ConsultationsView content={consult} />
      );

    return (
      <Modal
        isOpen={viewModalOpen}
        onRequestClose={() => this.toggleViewModal()}
        style={viewModalStyles}
        contentLabel="Example Modal"
      >
        {modalContent}
      </Modal>
    );
  }

  toggleFormModal(order = {}) {
    this.loadMedicationStock();

    this.setState({
      formModalIsOpen: !this.state.formModalIsOpen,
      medicationDetails: order,
      isEditing: Object.keys(order).length > 0,
    });
  }

  async loadMedicationStock() {
    let { data: medications } = await axios.get(`${API_URL}/medications`);

    let { data: orders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`
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

    this.setState({ medications, reservedMedications });
  }

  renderFormModal() {
    let {
      patient,
      isEditing,
      medications,
      medicationDetails,
      formModalIsOpen,
      reservedMedications,
    } = this.state;
    let options = medications.map((medication) => {
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
        onRequestClose={() => this.toggleFormModal()}
        style={formModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.fields.drug_allergy}
          handleInputChange={this.handlePrescriptionChange}
          formDetails={medicationDetails}
          isEditing={isEditing}
          medicationOptions={options}
          medications={medications}
          reservedMedications={reservedMedications}
          onSubmit={() => this.submitNewPrescription()}
        />
      </Modal>
    );
  }

  handlePrescriptionChange(event) {
    let { medicationDetails } = this.state;

    const target = event.target;
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

    this.setState({
      medicationDetails,
    });
  }

  submitNewPrescription() {
    let { orders, medicationDetails, isEditing } = this.state;

    if (isEditing) {
      // go find that order
      let index = orders.findIndex((order) => {
        order.medication == medicationDetails.medication;
      });
      orders[index] = medicationDetails;
      // edit that order
    } else orders.push({ ...medicationDetails, order_status: "PENDING" });

    this.setState({
      orders: orders,
      medicationDetails: {},
      formModalIsOpen: false,
    });
  }

  async loadVisitDetails(visitID) {
    let { data: consults } = await axios.get(
      `${API_URL}/consults?visit=${visitID}`
    );

    let { data: prescriptions } = await axios.get(
      `${API_URL}/orders?visit=${visitID}`
    );

    let consultsEnriched = consults.map((consult) => {
      let consultPrescriptions = prescriptions.filter((prescription) => {
        return prescription.visit.id == consult.visit.id;
      });

      return {
        ...consult,
        prescriptions: consultPrescriptions,
      };
    });

    let { data: vitals } = await axios.get(
      `${API_URL}/vitals?visit=${visitID}`
    );

    this.setState({
      consults: consultsEnriched,
      vitals: vitals[0] || {},
      visitPrescriptions: prescriptions,
      mounted: true,
      visitID,
    });
  }

  async submitForm() {
    let { form } = this.props.query;
    let { formDetails, visitID, orders } = this.state;
    var formPayload = {
      visit: visitID,
      ...formDetails,
    };
    var consultId;
    var orderPromises;

    switch (form) {
      case "vitals":
        await axios.post(`${API_URL}/vitals`, formPayload);
        toast.success("Vitals completed!");
        break;
      case "medical":
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
          };
          orderPromises.push(axios.post(`${API_URL}/orders`, orderPayload));
        });

        await Promise.all(orderPromises);
        toast.success("Medical Consult Completed!");
        break;
    }

    Router.push("/queue");
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

  handleVisitChange(event) {
    const value = event.target.value;

    // pull the latest visit

    // this.setState({ visitID: value });
    this.loadVisitDetails(value);
  }

  renderHeader() {
    let { patient, visits } = this.state;
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
              <select name={"medication"} onChange={this.handleVisitChange}>
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
            <label className="label">Visited Before?</label>
            <article className="message">
              <div className="message-body">
                {visits.length > 1 ? "Yes" : "No"}
              </div>
            </article>
          </div>
          <div className="column is-3"></div>
        </div>
      </div>
    );
  }

  renderFirstColumn() {
    let { vitals, consults, visitPrescriptions } = this.state;

    let consultRows = consults.map((consult) => {
      // let type = consult.type;
      // let subType = consult.sub_type == null ? "General" : consult.sub_type;
      let doctor = consult.doctor.username;
      let referredFor =
        consult.referredFor == null ? "None" : consult.referredFor;
      return (
        <tr key={consult.id}>
          {/* <td>{type}</td>
          <td>{subType}</td> */}
          <td>{doctor}</td>
          <td>{referredFor}</td>
          <td>
            <button
              className="button is-dark level-item"
              onClick={() => this.toggleViewModal("consult", consult)}
            >
              View
            </button>
          </td>
        </tr>
      );
    });

    return (
      <div className="column is-5">
        <div className="columns">
          <div className="column is-4">
            <label className="label">Vital Signs</label>
            {typeof vitals === "undefined" ? (
              <h2>Not Done</h2>
            ) : (
              <button
                className="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => {
                  this.toggleViewModal("vitals");
                }}
              >
                View
              </button>
            )}
          </div>
        </div>

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

  renderSecondColumn() {
    let { form } = this.props.query;
    let { formDetails, orders } = this.state;

    let formContent = () => {
      switch (form) {
        case "vitals":
          return (
            <VitalsForm
              formDetails={formDetails}
              handleInputChange={this.handleInputChange}
            />
          );

        case "medical":
          return (
            <div>
              <MedicalForm
                formDetails={formDetails}
                handleInputChange={this.handleInputChange}
              />
              <hr />
              <label className="label">Prescriptions</label>
              {orders.length > 0 ? this.renderPrescriptionTable() : "None"}
              <button
                className="button is-dark level-item"
                style={{ marginTop: 15 }}
                onClick={() => this.toggleFormModal()}
              >
                Add
              </button>
            </div>
          );
      }
    };

    return (
      <div className="column is-7">
        {formContent()}

        <hr />

        <button
          className="button is-dark is-medium level-item"
          style={{ marginTop: 15 }}
          onClick={() => this.submitForm()}
        >
          Submit
        </button>
      </div>
    );
  }

  renderPrescriptionTable() {
    let { orders } = this.state;

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
                  onClick={() => this.toggleFormModal(order)}
                >
                  Edit
                </button>
                <button
                  className="button is-dark level-item"
                  onClick={() => {
                    orders.splice(index, 1);
                    this.setState({ orders });
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

  render() {
    if (!this.state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 27.5,
          marginLeft: 25,
          marginRight: 25,
        }}
      >
        {this.renderFormModal()}
        {this.renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
        {this.renderHeader()}
        <b>
          Please remember to press the submit button at the end of the form!
        </b>

        <hr />

        <div className="column is-12">
          <div className="columns is-12">
            {this.renderFirstColumn()}
            {this.renderSecondColumn()}
          </div>
        </div>
      </div>
    );
  }
}

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
