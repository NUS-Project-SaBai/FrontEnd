import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MedicationModal, MedicationHistoryModal } from './_components/';
import withAuth from '@/utils/auth';
import { Button, InputField } from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';

const Stock = () => {
  const [medications, setMedications] = useState([]);
  const [medicationsFiltered, setMedicationsFiltered] = useState([]);
  const [medicationDetails, setMedicationDetails] = useState({
    medicine_name: '',
    reserve_quantity: 0,
    quantity: 0,
    quantityChange: 0,
    notes: '',
    remarks: '',
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [MedicationHistoryModalIsOpen, setMedicationHistoryModalIsOpen] =
    useState(false);
  const [medication, setMedication] = useState(null);

  useEffect(() => {
    loadMedicine();
  }, []);

  const loadMedicine = async () => {
    try {
      const { data: medicines } = await axiosInstance.get('/medications');
      setMedications(medicines);
      setMedicationsFiltered(medicines);
    } catch (error) {
      toast.error(`Failed to fetch medications: ${error.message}`);
      return;
    }
  };

  const onFilterChange = (event) => {
    const filteredMedications = medications.filter((medication) => {
      const medicineName = medication.medicine_name.toLowerCase();

      return medicineName.includes(event.target.value.toLowerCase());
    });

    setMedicationsFiltered(filteredMedications);
  };

  const toggleModal = (medication = {}) => {
    setMedicationDetails(medication);
    setModalIsOpen(!modalIsOpen);
  };

  const toggleMedicationHistoryModal = (medication) => {
    setMedication(medication);
    setMedicationHistoryModalIsOpen(!MedicationHistoryModalIsOpen);
  };

  const createNewMedication = () => {
    setMedicationDetails({
      medicine_name: '',
      reserve_quantity: 0,
      quantity: 0,
      quantityChange: 0,
      notes: '',
      remarks: '',
    });
    toggleModal(medicationDetails);
  };

  const handleMedicationChange = (event) => {
    const newMedicationDetails = {
      ...medicationDetails,
      [event.target.name]: event.target.value,
    };
    setMedicationDetails(newMedicationDetails);
  };

  const onSubmitForm = async () => {
    if (!medicationDetails.medicine_name) {
      toast.error('Medicine name cannot be empty.');
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
      const quantity =
        parseInt(updatedDetails.quantity) + parseInt(quantityChange);

      if (quantity < 0) {
        toast.error('Insufficient Medication!');
        return;
      }
      await axiosInstance
        .patch(`/medications/${updatedDetails.pk}`, {
          quantityChange: parseInt(quantityChange),
          medicine_name: updatedDetails.medicine_name,
          notes: updatedDetails.notes,
        })
        .catch((error) => {
          toast.error(`Encountered an error when update! ${error.message}`);
          return;
        });
      toast.success('Medication updated!');
    }

    // Creating new medicine
    if (!updatedDetails.pk) {
      if (quantityChange < 0) {
        toast.error('Invalid Number!');
        return;
      } else if (!Number.isInteger(quantityChange - 0)) {
        toast.error('No decimals allowed!');
        return;
      }

      updatedDetails.quantity = quantityChange;
      await axiosInstance
        .post('/medications', updatedDetails)
        .catch((error) => {
          toast.error(`Failed to create medication: ${error.message}`);
          return;
        });
      toast.success('New Medication created!');
    }

    toggleModal();
    loadMedicine();
  };

  const handleDelete = async (pk) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this medication?'
    );
    if (!confirmed) {
      return;
    }

    await axiosInstance.delete(`/medications/${pk}`).catch((error) => {
      toast.error(`Failed to delete medication: ${error.message}`);
      return;
    });

    const updatedMedications = medications.filter(
      (medication) => medication.id !== pk
    );
    const updatedMedicationsFiltered = medicationsFiltered.filter(
      (medication) => medication.id !== pk
    );
    setMedications(updatedMedications);
    setMedicationsFiltered(updatedMedicationsFiltered);

    toast.success('Medication successfully deleted!');
  };

  function renderRows() {
    // Displays the list of medications in stock
    const tableRows = medicationsFiltered.map((medication) => {
      const medicationDetails = {
        ...medication,
        pk: medication.id,
        quantityChange: 0,
      };
      const name = medicationDetails.medicine_name;
      const quantity = medicationDetails.quantity;

      return (
        <tr key={name + quantity}>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {name}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {quantity}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-2">
            <Button
              colour="green"
              text="Edit"
              onClick={() => toggleModal(medicationDetails)}
            />

            <Button
              colour="red"
              text="Delete"
              onClick={() => handleDelete(medicationDetails.pk)}
            />

            <Button
              colour="blue"
              text="History"
              onClick={() => toggleMedicationHistoryModal(medicationDetails)}
            />
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
      }}
    >
      <MedicationModal
        formDetails={medicationDetails}
        modalIsOpen={modalIsOpen}
        toggleModal={toggleModal}
        handleInputChange={handleMedicationChange}
        onSubmit={onSubmitForm}
      />

      <MedicationHistoryModal
        modalIsOpen={MedicationHistoryModalIsOpen}
        toggleModal={() => setMedicationHistoryModalIsOpen(false)}
        medication={medication}
      />

      <h1 className="flex items-center justify-center text-3xl font-bold  text-sky-800 mb-6">
        Medication Stock
      </h1>
      <div className="control">
        <InputField
          label="Search for Medicine"
          type="text"
          name="Input Medication to Search"
          onChange={onFilterChange}
        />
      </div>
      <div className="mt-2">
        <Button
          colour="green"
          text="Add New Medicine"
          onClick={createNewMedication}
        />
      </div>

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-2 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Medication Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Quantity
                    </th>

                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-base font-semibold text-gray-900"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {renderRows()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Stock);
