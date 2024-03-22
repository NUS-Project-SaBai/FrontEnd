import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import moment from "moment";
import axios from "axios";
import _ from "lodash";
import { MedicationForm } from "../../components/forms/stock";
import { API_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";
import toast from "react-hot-toast";

Modal.setAppElement("#__next");

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
};

const Stock = () => {
  const [medications, setMedications] = useState([]); // List of medications in stock
  const [medicationsFiltered, setMedicationsFiltered] = useState([]); // Medications displayed based on the search bar
  const [medicationDetails, setMedicationDetails] = useState({
    medicine_name: "",
    reserve_quantity: 0,
    quantity: 0,
    quantityChange: 0,
    notes: "",
    remarks: "",
  }); // State is used to adjust what is displayed when toggling modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filterString, setFilterString] = useState("");

  useEffect(() => {
    onRefresh();
  }, []);

  const onRefresh = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/medications`);
      setMedications(data);
      setMedicationsFiltered(data);
    } catch (error) {
      console.error("Failed to fetch medications:", error);
    }
  };

  const onSubmitForm = async () => {
    if (!medicationDetails.medicine_name) {
      toast.error("Medicine name cannot be empty.");
      return;
    }

    const quantityChange = medicationDetails.quantityChange;
    const nameEnriched =
      medicationDetails.medicine_name.charAt(0).toUpperCase() +
      medicationDetails.medicine_name.slice(1);

    const updatedDetails = {
      ...medicationDetails,
      medicine_name: nameEnriched,
    };

    if (updatedDetails.pk) {
      const key = updatedDetails.pk;
      const quantity =
        parseInt(updatedDetails.quantity) + parseInt(quantityChange);
      if (quantity >= 0) {
        try {
          await axios.patch(`${API_URL}/medications/${key}`, {
            quantityChange: parseInt(quantityChange),
          });
          toast.success("Medication Quantity updated!");
        } catch (error) {
          toast.error("Encountered an error!");
        }
      } else {
        toast.error("Insufficient medication!");
      }
    } else if (quantityChange >= 0) {
      updatedDetails.quantity = quantityChange;
      try {
        await axios.post(`${API_URL}/medications`, updatedDetails);
        toast.success("New Medication created!");
      } catch (error) {
        toast.error("Failed to create medication!");
      }
    } else {
      toast.error("Invalid number!");
    }

    toggleModal();
    onRefresh();
  };

  async function handleDelete(pk) {
    // Delete medication
    const confirmed = window.confirm(
      "Are you sure you want to delete this medication?",
    );
    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(`${API_URL}/medications/${pk}`);
      const updatedMedications = medications.filter(
        (medication) => medication.pk !== pk,
      );
      const updatedMedicationsFiltered = medicationsFiltered.filter(
        (medication) => medication.pk !== pk,
      );
      setMedications(updatedMedications);
      setMedicationsFiltered(updatedMedicationsFiltered);

      toast.success("Medication successfully deleted!");
    } catch (error) {
      console.error(error);
    }
  }

  function onFilterChange(event) {
    // When editing search bar
    const filteredMedications = medications.filter((medication) => {
      const medicineName = medication.fields.medicine_name.toLowerCase();

      return medicineName.includes(event.target.value.toLowerCase());
    });

    setMedicationsFiltered(filteredMedications);
  }

  function createNewMedication() {
    setMedicationDetails({
      medicine_name: "",
      reserve_quantity: 0,
      quantity: 0,
      quantityChange: 0,
      notes: "",
      remarks: "",
    });
    toggleModal(medicationDetails);
  }

  function toggleModal(medication = {}) {
    setMedicationDetails(medication);
    setModalIsOpen((prevModalIsOpen) => !prevModalIsOpen);
  }

  function handleMedicationChange(event) {
    // When modifying an entry in MedicationForm
    const newMedicationDetails = {
      ...medicationDetails,
      [event.target.name]: event.target.value,
    };
    setMedicationDetails(newMedicationDetails);
  }

  function renderModal() {
    // Loads the form to edit name, quantity and notes
    return (
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        style={prescriptionModalStyles}
      >
        <MedicationForm
          formDetails={medicationDetails}
          handleInputChange={handleMedicationChange}
          onSubmit={onSubmitForm}
        />
      </Modal>
    );
  }

  function renderRows() {
    // Displays the list of medications in stock
    const tableRows = medicationsFiltered.map((medication) => {
      const medicationDetails = {
        ...medication.fields,
        pk: medication.pk,
        quantityChange: 0,
      };
      const name = medicationDetails.medicine_name;
      const quantity = medicationDetails.quantity;

      return (
        <tr>
          <td>{name}</td>
          <td>{quantity}</td>
          <td>
            <div className="levels">
              <div className="level-left">
                <button
                  className="button is-dark level-item"
                  onClick={() => toggleModal(medicationDetails)}
                >
                  Edit
                </button>

                <button
                  className="button is-danger level-item"
                  onClick={() => handleDelete(medicationDetails.pk)}
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

  return (
    <div
      style={{
        marginTop: 15,
        marginLeft: 25,
        marginRight: 25,
        // position: "relative"
      }}
    >
      {renderModal()}
      <div className="column is-12">
        <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
          Medication Stock
        </h1>
        <div className="control">
          <input
            className="input is-medium"
            type="text"
            placeholder="Search Medications"
            onChange={onFilterChange}
          />
        </div>
        <div className="levels" style={{ marginBottom: 10, marginTop: 10 }}>
          <div className="level-left">
            <button
              className="button is-dark level-item"
              style={{ display: "inline-block", verticalAlign: "top" }}
              onClick={createNewMedication}
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
          <tbody>{renderRows()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default withAuth(Stock);
