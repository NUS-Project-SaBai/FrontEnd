import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import toast from "react-hot-toast";
import MedicationForm from "../../components/forms/stock";
import StockRow from "./stockRow";
import { API_URL } from "../../utils/constants";
import withAuth from "../../utils/auth";

Modal.setAppElement("#__next");

const Stock = () => {
  const [medications, setMedications] = useState([]);
  const [medicationsFiltered, setMedicationsFiltered] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [medicationDetails, setMedicationDetails] = useState({
    medicine_name: "",
    reserve_quantity: 0,
    quantity: 0,
    quantityChange: 0,
    notes: "",
    remarks: "",
    pk: null,
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data: medication } = await axios.get(`${API_URL}/medications`);
      setMedications([...medication]);
      setMedicationsFiltered([...medication]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch medications.");
    }
  };

  const handleFilterChange = (event) => {
    const filterValue = event.target.value.toLowerCase();
    const filtered = medications.filter((medication) =>
      medication.fields.medicine_name.toLowerCase().includes(filterValue)
    );
    setMedicationsFiltered(filtered);
  };

  const toggleModal = (edit = false, medication = {}) => {
    setModalIsOpen(!modalIsOpen);
    if (edit) {
      setMedicationDetails({ ...medication });
    } else {
      setMedicationDetails({
        medicine_name: "",
        reserve_quantity: 0,
        quantity: 0,
        quantityChange: 0,
        notes: "",
        remarks: "",
        pk: null,
      });
    }
  };

  const handleMedicationChange = (event) => {
    const { name, value } = event.target;
    setMedicationDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const updateMedicationDetails = (medicationDetails) => {
    medicationDetails.medicine_name =
      medicationDetails.medicine_name.charAt(0).toUpperCase() +
      medicationDetails.medicine_name.slice(1);
    medicationDetails.quantityChange = medicationDetails.quantityChange
      ? parseInt(medicationDetails.quantityChange)
      : 0;
    medicationDetails.reserve_quantity = parseInt(
      medicationDetails.reserve_quantity
    );
    setMedicationDetails({ ...medicationDetails });
  };

  const onSubmitForm = async () => {
    try {
      let endpoint = `${API_URL}/medications`;
      let method = "post";
      let message = "New Medication created!";

      if (medicationDetails.pk) {
        endpoint += `/${medicationDetails.pk}`;
        method = "patch";
        message = "Medication updated!";
      }
      updateMedicationDetails(medicationDetails);
      await axios[method](endpoint, medicationDetails);
      toast.success(message);
      toggleModal();
      fetchMedications();
    } catch (error) {
      console.error(error);
      toast.error("An error occurred!");
    }
  };

  const handleDelete = async (pk) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medication?"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${API_URL}/medications/${pk}`);
      toast.success("Medication successfully deleted!");
      const updatedMedications = medications.filter(
        (medication) => medication.fields.pk !== pk
      );
      setMedications([...updatedMedications]);
      setMedicationsFiltered([...updatedMedications]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete medication!");
    }
  };

  return (
    <div style={prescriptionModalStyles.format}>
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => toggleModal()}
          style={prescriptionModalStyles}
        >
          <MedicationForm
            formDetails={medicationDetails}
            handleInputChange={handleMedicationChange}
            onSubmit={() => onSubmitForm()}
          />
        </Modal>
      )}
      <h1 style={{ color: "black", fontSize: "1.5em" }}>Medicine Stock</h1>
      <input
        className="input is-medium"
        type="text"
        placeholder="Search Medications"
        onChange={handleFilterChange}
      />
      <button
        className="button is-dark level-item"
        style={prescriptionModalStyles.newMedicine}
        onClick={() => toggleModal()}
      >
        New Medicine
      </button>
      <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
        <thead>
          <tr>
            <th>Name</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicationsFiltered.map((medication) => {
            medication.fields.pk = medication.pk;
            return (
              <StockRow
                medication={medication.fields}
                handleDelete={() => handleDelete(medication.pk)}
                handleEdit={() => toggleModal(true, medication.fields)}
                key={medication.pk}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
  format: {
    marginTop: 20,
    marginLeft: 30,
    marginRight: 30,
  },
  newMedicine: {
    display: "inline-block",
    verticalAlign: "top",
    marginBottom: 10,
    marginTop: 10,
  },
};

export default withAuth(Stock);
