import React from "react";
import axios from "axios";
import _ from "lodash";
import Modal from "react-modal";
import moment from "moment";
import {
  ConsultationsTable,
  ConsultationsView,
  VitalsView,
  VisitPrescriptionsTable,
  PatientView,
} from "../components/views/patient";
import { API_URL, CLOUDINARY_URL } from "../utils/constants";
import withAuth from "../utils/auth";

Modal.setAppElement("#__next");

class Record extends React.Component {
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

    if (visitsSorted.length > 0) {
      let visitID = visitsSorted[0].id;
      this.loadVisitDetails(visitID);
      this.loadMedicationStock();
    }
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
      >
        {modalContent}
      </Modal>
    );
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

  handleVisitChange(event) {
    const value = event.target.value;
    this.loadVisitDetails(value);
  }

  renderHeader() {
    let { patient, visits } = this.state;
    let visitOptions = visits.map((visit) => {
      let date = moment(visit.date).format("DD MMMM YYYY");

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
          <div className="column is-3"></div>
        </div>
      </div>
    );
  }

  renderFirstColumn() {
    let { patient } = this.state;
    return <PatientView content={patient} />;
  }

  renderSecondColumn() {
    let { vitals, consults, visitPrescriptions } = this.state;

    let consultRows = consults.map((consult) => {
      let type = consult.type;
      let subType = consult.sub_type == null ? "General" : consult.sub_type;
      let doctor = consult.doctor.username;
      let referredFor =
        consult.referred_for == null ? "None" : consult.referred_for;

      return (
        <tr key={consult.pk}>
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
      <div className="column is-9">
        <div className="columns">
          <div className="column is-6">
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

  renderPrescriptionTable() {
    let { orders } = this.state;

    let orderRows = orders.map((order, index) => {
      let name = order.medicine.medicine_name;
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
    if (!this.state.mounted)
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
        {this.renderViewModal()}
        <h1 style={{ color: "black", fontSize: "1.5em" }}>Patient</h1>
        {this.renderHeader()}

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
