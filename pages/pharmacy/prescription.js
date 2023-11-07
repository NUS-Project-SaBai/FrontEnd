import React from "react";
import Router from "next/router";
import axios from "axios";
import Modal from "react-modal";
import { PrescriptionForm } from "../../components/forms/prescription";
import { API_URL, CLOUDINARY_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";

Modal.setAppElement("#__next");

class Prescription extends React.Component {
  constructor() {
    super();

    this.state = {
      patient: {},
      visit: {},
      orders: [],
      order: {},
      medicationsDict: {},
      mounted: false,
      editModalOpen: false,
    };

    this.handleOrderChange = this.handleOrderChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { id: visitId } = this.props.query;
    let { data: visit } = await axios.get(`${API_URL}/visits/${visitId}`);

    let { data: consultations } = await axios.get(
      `${API_URL}/consults?visit=${visitId}`
    );
    let { data: medications } = await axios.get(`${API_URL}/medications`);

    let medicationsDict = {};
    medications.forEach((medication) => {
      let medicationId = medication.pk;
      let quantity = medication.fields.quantity;

      medicationsDict[medicationId] = quantity;
    });
    this.setState(
      {
        visit,
        patient: visit.patient,
        medicationsDict,
        consultations,
      },
      () => this.loadMedicationStock()
    );
  }

  async loadMedicationStock() {
    let { visit } = this.state;
    let visitId = visit.id;

    let { data: orders } = await axios.get(
      `${API_URL}/orders?visit=${visitId}&order_status=PENDING`
    );
    let { data: medications } = await axios.get(`${API_URL}/medications`);
    let { data: allOrders } = await axios.get(
      `${API_URL}/orders?order_status=PENDING`
    );
    // key -> medicine pk
    // value -> total reserved
    let reservedMedications = {};
    allOrders.forEach((order) => {
      let medicationID = order.medicine;
      let quantityReserved = order.quantity;

      if (typeof reservedMedications[medicationID] === "undefined") {
        reservedMedications[medicationID] = quantityReserved;
      } else {
        reservedMedications[medicationID] =
          reservedMedications[medicationID] + quantityReserved;
      }
    });
    this.setState({ orders, medications, reservedMedications, mounted: true });
  }

  massUpdate(flag) {
    let { orders, visit } = this.state;
    let medicationUpdates = [];
    let orderUpdates = [];

    orders.forEach((order) => {
      let medPayload = {
        quantityChange: -order.quantity,
      };

      let orderPayload = {
        order_status: flag,
      };

      medicationUpdates.push(() =>
        axios.patch(`${API_URL}/medications/${order.medicine.id}`, medPayload)
      );
      orderUpdates.push(() =>
        axios.patch(`${API_URL}/orders/${order.id}`, orderPayload)
      );
    });

    let visitPayload = {
      status: "finished",
    };
    orderUpdates.push(() =>
      axios.patch(`${API_URL}/visits/${visit.id}`, visitPayload)
    );

    Promise.all(medicationUpdates.map((x) => x()))
      .then(() => Promise.all(orderUpdates.map((x) => x())))
      .then(() => {
        toast.success("Order Completed!");
        Router.push("/pharmacy/orders");
      })
      .catch(() => {
        toast.error("Insufficient medication!");
      });
  }

  async submitOrderEdit() {
    let { order } = this.state;

    let orderId = order.id;
    delete order.id;

    await axios.patch(`${API_URL}/orders/${orderId}`, order);
    this.toggleEditModal();
  }

  async cancelOrder(order) {
    let orderId = order.id;

    order.order_status = "REJECTED";
    order.medicine = order.medicine.id;
    delete order.id;

    await axios.patch(`${API_URL}/orders/${orderId}`, order);
    this.loadMedicationStock();
  }

  handleOrderChange(event) {
    let { order } = this.state;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "medication") {
      let pKey = value.split(" ")[0];
      let medicineName = value.split(" ").slice(1).join(" ");

      order["medicine"] = pKey;
      order["medicine_name"] = medicineName;
    } else {
      order[name] = value;
    }

    this.setState({
      order,
    });
  }

  toggleEditModal(order = {}) {
    this.loadMedicationStock();
    this.setState({
      editModalOpen: !this.state.editModalOpen,
      order,
    });
  }

  renderEditModal() {
    let { patient, medications, order, reservedMedications, editModalOpen } =
      this.state;

    let options = medications.map((medication) => {
      let name = medication.fields.medicine_name;
      let pKey = medication.pk;

      if (
        Object.keys(order).length &&
        `${order.medicine.id} ${order.medicine.medicine_name}` ==
          `${pKey} ${name}`
      ) {
        return (
          <option value={`${pKey} ${name}`} selected>
            {name}
          </option>
        );
      }

      return <option value={`${pKey} ${name}`}>{name}</option>;
    });
    return (
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => this.toggleEditModal()}
        style={editModalStyles}
        contentLabel="Example Modal"
      >
        <PrescriptionForm
          allergies={patient.drug_allergy}
          handleInputChange={this.handleOrderChange}
          formDetails={order}
          medicationOptions={options}
          onSubmit={() => this.submitOrderEdit()}
          reservedMedications={reservedMedications}
          medications={medications}
        />
      </Modal>
    );
  }

  renderHeader() {
    let { patient } = this.state;

    return (
      <div className="column is-12">
        <div className="columns is-12">
          <div className="column is-2">
            <img
              src={`${CLOUDINARY_URL}/${patient.picture}`}
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
              <div className="message-body">{`${patient.village_prefix}${patient.id}`}</div>
            </article>
          </div>
          <div className="column is-3">
            <label className="label">Name</label>
            <article className="message">
              <div className="message-body">{patient.name}</div>
            </article>
          </div>
          <div className="column is-3"></div>
        </div>
      </div>
    );
  }

  renderTable() {
    let { orders, medicationsDict } = this.state;

    let orderRows = orders.map((order) => {
      let name = order.medicine.medicine_name;
      let current_stock = medicationsDict[order.medicine.id];
      let quantity = order.quantity;
      // let doctor = order.doctor;

      return (
        <tr>
          <td>{name}</td>
          <td>{current_stock}</td>
          <td>{quantity}</td>
          {/* <td>{doctor}</td> */}
          <td>
            <div className="levels">
              <div className="level-left">
                <button
                  className="button is-dark level-item"
                  onClick={() => this.toggleEditModal(order)}
                >
                  Edit
                </button>
                <button
                  className="button is-dark level-item"
                  onClick={() => this.cancelOrder(order)}
                >
                  Cancel
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
            <th>Current Stock</th>
            <th>Quantity</th>
            {/* <th>Doctor</th> */}
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </table>
    );
  }

  renderConsultationsTable() {
    let { consultations } = this.state;

    let consultRows = consultations.map((consult) => {
      let type = consult.type;
      let subType = consult.sub_type == null ? "General" : consult.sub_type;
      let doctor = consult.doctor.username;
      let referredFor =
        consult.referred_for == null ? "None" : consult.referred_for;

      return (
        <tr>
          <td>{doctor}</td>
          <td>{referredFor}</td>
        </tr>
      );
    });

    return (
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Doctor</th>
            <th>Referred For</th>
          </tr>
        </thead>
        <tbody>{consultRows}</tbody>
      </table>
    );
  }

  render() {
    if (!this.state.mounted) return null;

    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
          // position: "relative"
        }}
      >
        {this.renderEditModal()}
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>
            Approve/ Reject Orders
          </h1>
          {this.renderHeader()}
          <b>
            Do check if the patient has undergone at least one consultation!
          </b>
          <hr />

          <div className="column is-12">
            <label className="label">Consultations</label>
            {this.state.consultations.length > 0 ? (
              this.renderConsultationsTable()
            ) : (
              <h2>None</h2>
            )}

            <hr />

            <label className="label">Prescriptions</label>
            {this.state.orders.length > 0 ? this.renderTable() : <h2>None</h2>}
            {/* {this.renderFirstColumn()}
            {this.renderSecondColumn()} */}
          </div>

          <hr />

          <div className="levels">
            <div className="level-left">
              <button
                className="button is-dark level-item"
                onClick={() => this.massUpdate("APPROVED")}
              >
                Approve All
              </button>
              <button
                className="button is-dark level-item"
                onClick={() => this.massUpdate("REJECTED")}
              >
                Reject All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const editModalStyles = {
  content: {
    left: "30%",
    right: "12.5%",
    top: "12.5%",
    bottom: "12.5%",
  },
};

export default withAuth(Prescription);
