'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import {
  createOrder,
  findMedicationById,
  hasDuplicateOrder,
} from '@/components/records/consultation/utils/medicationOrderLogic';
import {
  getInStockQuantityColour,
  getInStockQuantityText,
} from '@/components/records/consultation/utils/medicationUtils';
import { getMedication } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Medication } from '@/types/Medication';
import { Patient } from '@/types/Patient';
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
  const exceedsStockNow =
    selectedMedication != null &&
    quantityInputByUser > selectedMedication.quantity;

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
                !patient
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

            <div className="grid grid-cols-2 gap-4">
              <DisplayField
                label="In Stock"
                highlight={
                  medications == undefined || selectedMedicationId == ''
                    ? ''
                    : getInStockQuantityColour(
                        medications.find(
                          med => med.id.toString() == selectedMedicationId
                        ) || null
                      )
                }
                content={
                  medications == undefined || selectedMedicationId == ''
                    ? '-'
                    : getInStockQuantityText(
                        medications.find(
                          med => med.id.toString() == selectedMedicationId
                        ) || null
                      )
                }
              />
              <div
                className={
                  exceedsStockNow ? 'rounded-md p-2 ring-2 ring-red-500' : 'p-2'
                }
              >
                <RHFInputField
                  name="quantity"
                  label="Quantity to Order"
                  type="number"
                  isRequired={true}
                />
                {exceedsStockNow && (
                  <p className="mt-1 text-sm text-red-600">
                    Quantity exceeds available stock (
                    {selectedMedication?.quantity ?? 0} in stock). You may need
                    to wait a while for the order to go through.
                  </p>
                )}
              </div>
            </div>
            <RHFInputField
              type="textarea"
              name="notes"
              label="Dosage Instructions"
              placeholder="Dosage Instructions"
              isRequired={true}
            />
            <Button
              type="submit"
              text="Add order"
              colour="green"
              className="my-2"
            />
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
