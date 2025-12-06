'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { MedicationStockDisplay } from '@/components/records/consultation/MedicationStockDisplay';
import { getMedication } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Medication } from '@/types/Medication';
import { Patient } from '@/types/Patient';
import {
  createOrder,
  findMedicationById,
  hasDuplicateOrder,
} from '@/components/records/consultation/utils/medicationOrderLogic';
import { FormEventHandler, useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function MedicationOrderForm({
  isFormOpen,
  selectedOrder,
  orderIndex,
  setOrder,
  orderList,
  closeForm,
  patient,
}: {
  isFormOpen: boolean;
  selectedOrder: ConsultMedicationOrder | null;
  orderIndex?: number;
  setOrder: (value: ConsultMedicationOrder[]) => void;
  orderList: ConsultMedicationOrder[] | undefined;
  closeForm: () => void;
  patient: Patient | null;
}) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const useFormReturn = useForm({
    values:
      selectedOrder == null
        ? { medication: '', quantity: 0, notes: '' }
        : {
            medication: selectedOrder.medicationId.toString(),
            quantity: selectedOrder.quantity,
            notes: selectedOrder.notes,
          },
  });
  const { isLoading, withLoading } = useLoadingState(false);

  useEffect(() => {
    withLoading(async () => getMedication().then(setMedications))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder]);
  const sortedMedications = useMemo(
    () =>
      [...medications].sort((a, b) =>
        a.medicine_name.localeCompare(b.medicine_name)
      ),
    [medications]
  );

  const selectedMedicationId = useFormReturn.watch('medication');

  // Find the selected medication once and reuse it
  const selectedMedication =
    medications.find(med => med.id.toString() === selectedMedicationId) || null;

  //watch the user input quantity
  const quantityInputByUser = useFormReturn.watch('quantity');

  const onOrderSubmit: FormEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    useFormReturn.handleSubmit(
      data => {
        const medication = findMedicationById(
          medications,
          parseInt(data.medication, 10)
        );
        if (!medication) {
          toast.error('Invalid medication selected');
          return;
        }

        const order = createOrder(medication, data);
        const currentOrders = orderList || [];
        const isEditing = selectedOrder !== null && orderIndex !== undefined;

        if (isEditing) {
          if (
            hasDuplicateOrder(currentOrders, order.medicationId, orderIndex)
          ) {
            toast.error('Medication already ordered. Please edit that order.');
            return;
          }
          const updated = [...currentOrders];
          updated[orderIndex] = order;
          setOrder(updated);
        } else {
          if (hasDuplicateOrder(currentOrders, order.medicationId)) {
            toast.error('Medication already ordered. Please edit the order.');
            return;
          }
          setOrder([...currentOrders, order]);
        }

        useFormReturn.reset();
        closeForm();
      },
      () => {
        toast.error('Error submitting order form');
      }
    )();
  };

  return (
    <Modal
      isOpen={isFormOpen}
      onRequestClose={closeForm}
      ariaHideApp={false}
      title="Order"
      text="Close"
    >
      <div className="flex flex-col gap-y-2">
        <FormProvider {...useFormReturn}>
          <form onSubmit={onOrderSubmit}>
            <DisplayField
              label="Patient Allergies"
              content={
                patient === null
                  ? 'Error Getting Patient Allergies'
                  : patient.drug_allergy || '-'
              }
            />
            {isLoading ? (
              <LoadingUI message="Loading Available Medications..." />
            ) : (
              <RHFDropdown
                name="medication"
                label="Medicine"
                options={sortedMedications.map(med => ({
                  value: med.id.toString(),
                  label: `${med.medicine_name} (qty: ${med.quantity})`,
                }))}
                defaultValue={
                  selectedOrder ? selectedOrder.medicationId.toString() : ''
                }
                isRequired={true}
              />
            )}
            <MedicationStockDisplay
              medication={selectedMedication}
              quantityInputByUser={quantityInputByUser}
            />
            <RHFInputField
              type="textarea"
              name="notes"
              label="Dosage Instructions"
              placeholder="Dosage Instructions"
              isRequired={true}
            />
            <Button type="submit" text="Submit" colour="green" />
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
