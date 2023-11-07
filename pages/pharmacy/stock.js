import React from "react";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import { MedicationForm } from "../../components/forms/stock";
import { API_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";
import toast from "react-hot-toast";

Modal.setAppElement("#__next");

class Stock extends React.Component {
  constructor() {
    super();

    this.state = {
      medications: [],
      medicationsFiltered: [],
      medicationDetails: {
        medicine_name: "",
        reserve_quantity: 0,
        quantity: 0,
        quantityChange: 0,
        notes: "",
        remarks: "",
      },
      modalIsOpen: false,
      filterString: "",
    };

    this.onFilterChange = this.onFilterChange.bind(this);
    this.handleMedicationChange = this.handleMedicationChange.bind(this);
  }

  componentDidMount() {
    this.onRefresh();
  }

  async onRefresh() {
    let { data: medications } = await axios.get(`${API_URL}/medications`);
    this.setState({ medications, medicationsFiltered: medications });
  }

  async onSubmitForm() {
    let { medicationDetails } = this.state;

    let quantityChange = medicationDetails.quantityChange;
    let nameEnriched =
      medicationDetails.medicine_name.charAt(0).toUpperCase() +
      medicationDetails.medicine_name.slice(1);
    medicationDetails.medicine_name = nameEnriched;
    if (medicationDetails.pk) {
      let key = medicationDetails.pk;
      let quantity =
        parseInt(medicationDetails.quantity) + parseInt(quantityChange);
      if (quantity >= 0) {
        // medicationDetails.quantity = quantity;

        // medicationDetails.changeQuantity = 0;
        // delete medicationDetails["pk"];

        await axios
          .patch(`${API_URL}/medications/${key}`, { quantityChange })
          .then(() => toast.success("Medication updated!"))
          .catch(() => {
            toast.error("Encountered an error!");
            this.toggleModal();
            this.onRefresh();
          });
      } else {
        toast.error("Insufficient medication!");
      }
    } else if (quantityChange >= 0) {
      medicationDetails.quantity = quantityChange;
      await axios.post(`${API_URL}/medications`, medicationDetails);
      toast.success("New Medication created!");
    } else {
      toast.error("Invalid number!");
    }

    this.toggleModal();
    this.onRefresh();
  }

  async handleDelete(pk) {
    const { medications, medicationsFiltered } = this.state;

    const confirmed = window.confirm(
      "Are you sure you want to delete this medication?"
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/medications/${pk}`);
      const updatedMedications = medications.filter(
        (medication) => medication.pk !== pk
      );
      const updatedMedicationsFiltered = medicationsFiltered.filter(
        (medication) => medication.pk !== pk
      );
      this.setState({
        medications: updatedMedications,
        medicationsFiltered: updatedMedicationsFiltered,
      });
      toast.success("Medication successfully deleted!");
    } catch (error) {
      console.error(error);
    }
  }

  onFilterChange(event) {
    let { medications } = this.state;

    let medicationsFiltered = medications.filter((medication) => {
      let medicineName = medication.fields.medicine_name.toLowerCase();

      return medicineName.includes(event.target.value.toLowerCase());
    });

    this.setState({ medicationsFiltered });
  }

  /**
   * open the modal
   * load the appropriate medication
   */
  toggleModal(edit = false, medication = {}) {
    let changes = {
      modalIsOpen: !this.state.modalIsOpen,
    };
    if (edit) {
      // load up what we have chosen
      changes.medicationDetails = medication;
    }
    this.setState(changes);
  }

  renderModal() {
    let { medicationDetails, modalIsOpen } = this.state;
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => this.toggleModal()}
        style={prescriptionModalStyles}
      >
        <MedicationForm
          formDetails={medicationDetails}
          handleInputChange={this.handleMedicationChange}
          onSubmit={() => this.onSubmitForm()}
        />
      </Modal>
    );
  }

  handleMedicationChange(event) {
    let { medicationDetails } = this.state;

    const target = event.target;
    const value = target.value;
    const name = target.name;

    medicationDetails[name] = value;

    this.setState({
      medicationDetails,
    });
  }

  renderRows() {
    let { medicationsFiltered: medications } = this.state;
    let tableRows = medications.map((medication) => {
      let medicationDetails = {
        ...medication.fields,
        pk: medication.pk,
        quantityChange: 0,
      };
      let name = medicationDetails.medicine_name;
      let quantity = medicationDetails.quantity;

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>
            <div className="levels">
              <div className="level-left">
                <button
                  className="button is-dark level-item"
                  onClick={() => this.toggleModal(true, medicationDetails)}
                >
                  Edit
                </button>

                <button
                  className="button is-danger level-item"
                  onClick={() => this.handleDelete(medicationDetails.pk)}
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    });
    return tableRows;
  }

  render() {
    return (
      <div
        style={{
          marginTop: 15,
          marginLeft: 25,
          marginRight: 25,
          // position: "relative"
        }}
      >
        {this.renderModal()}
        <div className="column is-12">
          <h1 style={{ color: "black", fontSize: "1.5em" }}>Medicine Stock</h1>
          <div className="control">
            <input
              className="input is-medium"
              type="text"
              placeholder="Search Medications"
              onChange={this.onFilterChange}
            />
          </div>
          <div className="levels" style={{ marginBottom: 10, marginTop: 10 }}>
            <div className="level-left">
              <button
                className="button is-dark level-item"
                style={{ display: "inline-block", verticalAlign: "top" }}
                onClick={() => this.toggleModal()}
              >
                New Medicine
              </button>
            </div>
          </div>

          <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
            <thead>
              <tr>
                <th>Name</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>{this.renderRows()}</tbody>
          </table>
        </div>
      </div>
    );
  }
}

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
};

export default withAuth(Stock);
