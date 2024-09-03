import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  MedicationForm,
  MedicationHistoryForm,
} from '@/components/pharmacy/stock/';
import withAuth from '@/utils/auth';
import { Button, InputField } from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import useWithLoading from '@/utils/loading';
import CustomModal from '@/components/CustomModal';

const Stock = () => {
  const blankMedicationDetails = {
    medicine_name: '',
    reserve_quantity: 0,
    quantity: 0,
    quantityChange: 0,
    notes: '',
    remarks: '',
  };
  const [medications, setMedications] = useState([]);
  const [medicationsFiltered, setMedicationsFiltered] = useState([]);
  const [medicationDetails, setMedicationDetails] = useState(
    blankMedicationDetails
  );
  const [medicationModalIsOpen, setMedicationModalIsOpen] = useState(false);
  const [medicationHistoryModalIsOpen, setmedicationHistoryModalIsOpen] =
    useState(false);
  const [medication, setMedication] = useState(null);

  useEffect(() => {
    loadMedicine();
  }, []);

  const loadMedicine = useWithLoading(async () => {
    try {
      const { data: medicines } = await axiosInstance.get('/medications');
      setMedications(medicines);
      setMedicationsFiltered(medicines);
    } catch (error) {
      toast.error(`Failed to fetch medications: ${error.message}`);
      console.error('Error fetching medication:', error);
    }
  });

  const onFilterChange = event => {
    const filteredMedications = medications.filter(medication => {
      const medicineName = medication.medicine_name.toLowerCase();
      return medicineName.includes(event.target.value.toLowerCase());
    });

    setMedicationsFiltered(filteredMedications);
  };

  const toggleModal = (medication = blankMedicationDetails) => {
    setMedicationDetails(medication);
    setMedicationModalIsOpen(!medicationModalIsOpen);
  };

  const toggleMedicationHistoryModal = medication => {
    setMedication(medication);
    setmedicationHistoryModalIsOpen(!medicationHistoryModalIsOpen);
  };

  const createNewMedication = toggleModal;

  const handleMedicationChange = event => {
    const newMedicationDetails = {
      ...medicationDetails,
      [event.target.name]: event.target.value,
    };
    setMedicationDetails(newMedicationDetails);
  };

  const onSubmitForm = useWithLoading(async () => {
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
    }
  });

  const handleDelete = useWithLoading(async pk => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this medication?'
    );
    if (!confirmed) return;

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
    }
  });

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
          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 space-x-5">
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
  }

  console.log('medicationDetails');
  console.dir(medicationDetails);

  return (
    <div className="mt-4 mx-6">
      <CustomModal isOpen={medicationModalIsOpen} onRequestClose={toggleModal}>
        <MedicationForm
          formDetails={medicationDetails}
          handleInputChange={handleMedicationChange}
          onSubmit={onSubmitForm}
        />
      </CustomModal>

      <CustomModal
        isOpen={medicationHistoryModalIsOpen}
        onRequestClose={toggleMedicationHistoryModal}
      >
        <MedicationHistoryForm medication={medication} />
      </CustomModal>

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
