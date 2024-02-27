import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import toast from "react-hot-toast";
import { MedicationForm } from "../../components/forms/stock";
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
  });

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/medications`);
      setMedications(data);
      setMedicationsFiltered(data);
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
      setMedicationDetails(medication);
    } else {
      setMedicationDetails({
        medicine_name: "",
        reserve_quantity: 0,
        quantity: 0,
        quantityChange: 0,
        notes: "",
        remarks: "",
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
      fetchMedications(); // Refresh list after deletion
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete medication!");
    }
  };

  const renderRows = () =>
    medicationsFiltered.map((medication) => (
      <tr key={medication.pk}>
        <td>{medication.fields.medicine_name}</td>
        <td>{medication.fields.quantity}</td>
        <td>
          <button
            className="button is-dark level-item"
            onClick={() =>
              toggleModal(true, { ...medication.fields, pk: medication.pk })
            }
          >
            Edit
          </button>
          <button
            className="button is-dark level-item"
            onClick={() => handleDelete(medication.pk)}
          >
            Delete
          </button>
        </td>
      </tr>
    ));

  return (
    <div>
      {modalIsOpen && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => toggleModal()}
          style={prescriptionModalStyles}
        >
          <MedicationForm
            formDetails={medicationDetails}
            handleInputChange={handleMedicationChange}
            onSubmit={onSubmitForm}
          />
        </Modal>
      )}
      <input
        className="input is-medium"
        type="text"
        placeholder="Search Medications"
        onChange={handleFilterChange}
      />
      <button
        className="button is-dark level-item"
        style={{ display: "inline-block", verticalAlign: "top" }}
        onClick={() => toggleModal()}
      >
        New Medicine
      </button>
      <table>
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
  );
};

const prescriptionModalStyles = {
  content: {
    left: "35%",
    right: "17.5%",
    top: "25%",
    bottom: "25%",
  },
};

export default withAuth(Stock);
