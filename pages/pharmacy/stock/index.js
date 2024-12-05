import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  MedicationForm,
  MedicationHistoryForm,
} from '@/components/pharmacy/stock/';
import withAuth from '@/utils/auth';
import { Button, InputField, PageTitle } from '@/components/TextComponents';
import axiosInstance from '@/pages/api/_axiosInstance';
import useWithLoading from '@/utils/loading';
import CustomModal from '@/components/CustomModal';

const Stock = () => {
  const blankMedicationDetails = {
    medicine_name: '',
    quantity: 0, // number field but the value is actually string because we don't want the scrolling effect with the number field
    quantityChange: 0,
    notes: '',
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

  const [modalHeader, setModalHeader] = useState('');

  useEffect(() => {
    loadMedicine();
  }, []);

  const loadMedicine = useWithLoading(async () => {
    try {
      const { data: medicines } = await axiosInstance.get('/medications');
      medicines.sort((a, b) => a.medicine_name.localeCompare(b.medicine_name));
      setMedications(medicines);
      setMedicationsFiltered(medicines);
    } catch (error) {
      toast.error(`Failed to fetch medications: ${error.message}`);
      console.error('Error fetching medication:', error);
    }
  });

  const onSubmitForm = useWithLoading(async () => {
    // Medicine name validation
    if (!medicationDetails.medicine_name) {
      toast.error('Medicine name cannot be empty.');
      return;
    }

    const nameEnriched = medicationDetails.medicine_name.trim();
    const medicine_name_search = nameEnriched.toUpperCase();

    const matching_medicine = medications.find(
      m => m.medicine_name.toUpperCase() == medicine_name_search
    );

    if (matching_medicine) {
      toast.error(
        'Medication ' + matching_medicine.medicine_name + ' already exists.'
      );
      return;
    }

    const updatedDetails = {
      ...medicationDetails,
      medicine_name: nameEnriched,
    };

    // Medicine quantity validation
    if (medicationDetails.quantityChange === '') {
      // check explicitly for empty string as the "!medicationDetails.quantityChange" check will catch zeros, which is allowed
      toast.error('Quantity to Add cannot be empty.');
      return;
    }

    const quantityChange = medicationDetails.quantityChange;

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

  const handleMedicationChange = event => {
    const newMedicationDetails = {
      ...medicationDetails,
      [event.target.name]: event.target.value,
    };
    setMedicationDetails(newMedicationDetails);
  };

  const Rows = () => {
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
              onClick={() => {
                setModalHeader('Edit Medication');
                toggleModal(medicationDetails);
              }}
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
  };

  const Table = () => {
    return (
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
                  <Rows />
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-4 mx-6">
      <PageTitle title="Medication Stock" />

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
          onClick={() => {
            setModalHeader('Add Medication');
            toggleModal();
          }}
        />
      </div>
      <Table />
      <CustomModal
        isOpen={medicationModalIsOpen}
        onRequestClose={toggleModal}
        onSubmit={onSubmitForm}
      >
        <MedicationForm
          formDetails={medicationDetails}
          handleInputChange={handleMedicationChange}
          header={modalHeader}
        />
      </CustomModal>

      <CustomModal
        isOpen={medicationHistoryModalIsOpen}
        onRequestClose={toggleMedicationHistoryModal}
      >
        <MedicationHistoryForm medication={medication} />
      </CustomModal>
    </div>
  );
};

export default withAuth(Stock);
