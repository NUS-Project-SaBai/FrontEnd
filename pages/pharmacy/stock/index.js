import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { MedicationModal } from '@/components/pharmacy/stock/';
import withAuth from '@/utils/auth';
import {
  Button,
  InputField,
  InputBox,
  DisplayField,
} from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import { useLoading } from '@/context/LoadingContext';

const Stock = () => {
  const { setLoading } = useLoading();
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

  useEffect(() => {
    loadMedicine();
  }, []);

  const loadMedicine = async () => {
    setLoading(true);
    try {
      const { data: medicines } = await axiosInstance.get('/medications');
      setMedications(medicines);
      setMedicationsFiltered(medicines);
    } catch (error) {
      toast.error(`Failed to fetch medications: ${error.message}`);
      console.error('Error fetching medication:', error);
    } finally {
      setLoading(false);
    }
  };

  const onFilterChange = event => {
    const filteredMedications = medications.filter(medication => {
      const medicineName = medication.medicine_name.toLowerCase();
      return medicineName.includes(event.target.value.toLowerCase());
    });

    setMedicationsFiltered(filteredMedications);
  };

  const toggleModal = (medication = {}) => {
    setMedicationDetails(medication);
    setModalIsOpen(!modalIsOpen);
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
    toggleModal();
  };

  const handleMedicationChange = event => {
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

    setLoading(true);

    try {
      if (updatedDetails.pk) {
        const quantity =
          parseInt(updatedDetails.quantity) + parseInt(quantityChange);

        if (quantity < 0) {
          toast.error('Insufficient Medication!');
          return;
        }

        await axiosInstance.patch(`/medications/${updatedDetails.pk}`, {
          quantityChange: parseInt(quantityChange),
          medicine_name: updatedDetails.medicine_name,
          notes: updatedDetails.notes,
        });
        toast.success('Medication updated!');
      } else {
        if (quantityChange < 0) {
          toast.error('Invalid Number!');
          return;
        } else if (!Number.isInteger(quantityChange - 0)) {
          toast.error('No decimals allowed!');
          return;
        }

        updatedDetails.quantity = quantityChange;
        await axiosInstance.post('/medications', updatedDetails);
        toast.success('New Medication created!');
      }

      toggleModal();
      loadMedicine();
    } catch (error) {
      toast.error(`Error submitting medication: ${error.message}`);
      console.error('Error submitting medication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async pk => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this medication?'
    );
    if (!confirmed) return;

    setLoading(true);

    try {
      await axiosInstance.delete(`/medications/${pk}`);
      setMedications(medications.filter(medication => medication.id !== pk));
      setMedicationsFiltered(
        medicationsFiltered.filter(medication => medication.id !== pk)
      );
      toast.success('Medication successfully deleted!');
    } catch (error) {
      toast.error(`Failed to delete medication: ${error.message}`);
      console.error('Error deleting medication:', error);
    } finally {
      setLoading(false);
    }
  };

  function renderRows() {
    return medicationsFiltered.map(medication => {
      const medicationDetails = {
        ...medication,
        pk: medication.id,
        quantityChange: 0,
      };
      return (
        <tr key={medication.id}>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {medication.medicine_name}
          </td>
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
            {medication.quantity}
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
          </td>
        </tr>
      );
    });
  }

  const medicationForm = () => {
    return (
      <div className="space-y-4">
        <label className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-4">
          Edit Medication
        </label>

        <InputField
          name="medicine_name"
          type="text"
          label="Medicine Name"
          onChange={handleMedicationChange}
          value={medicationDetails.medicine_name}
        />
        <DisplayField
          content={
            medicationDetails.quantity == null ? 0 : medicationDetails.quantity
          }
          label="Current Quantity"
        />

        <InputField
          label="Quantity to Add (Negative to subtract)"
          name="quantityChange"
          type="number"
          onChange={handleMedicationChange}
          value={medicationDetails.quantityChange}
        />

        <InputBox
          label="Notes"
          name="notes"
          className="textarea"
          placeholder="Textarea"
          onChange={handleMedicationChange}
          value={medicationDetails.notes}
        />

        <Button onClick={onSubmitForm} text="Submit" colour="green" />
      </div>
    );
  };

  return (
    <div className="mt-4 mx-6">
      <MedicationModal
        modalIsOpen={modalIsOpen}
        toggleModal={toggleModal}
        medicationForm={medicationForm}
      />
      <h1 className="flex items-center justify-center text-3xl font-bold text-sky-800 mb-6">
        Medication Stock
      </h1>
      <div className="space-y-2">
        <InputField
          label="Search for Medicine"
          type="text"
          name="search"
          onChange={onFilterChange}
          className="mb-2"
        />
        <Button
          colour="green"
          text="Add New Medicine"
          onClick={createNewMedication}
        />
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flow-root">
          <div className="-mx-2 overflow-x-auto sm:-mx-4 lg:-mx-6">
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
