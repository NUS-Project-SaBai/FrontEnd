'use client';
import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { getMedication } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Medication } from '@/types/Medication';
import { Patient } from '@/types/Patient';
import { FormEventHandler, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

export function MedicationOrderForm({
  selectedOrder,
  setOrder,
  orderList,
  closeForm,
  patient,
}: {
  selectedOrder: ConsultMedicationOrder | null;
  setOrder: (value: ConsultMedicationOrder[]) => void;
  orderList: ConsultMedicationOrder[] | undefined;
  closeForm: () => void;
  patient: Patient | null;
}) {
  const [medications, setMedications] = useState<Medication[]>([]);
  const useFormReturn = useForm({
    values:
      selectedOrder == null
        ? { index: undefined, medication: '', quantity: undefined, notes: '' }
        : selectedOrder,
  });
  const { isLoading, withLoading } = useLoadingState(false);

  useEffect(() => {
    withLoading(async () => getMedication().then(setMedications))();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOrder]);

  const getInStockQuantityColour = (
    medication: Medication | null
  ): 'bg-red-200' | 'bg-amber-200' | 'bg-green-200' | '' => {
    if (medication == null) {
      return ''; // leave as grey
    }

    if (
      medication.warning_quantity == null ||
      medication.quantity >= medication.warning_quantity
    ) {
      return 'bg-green-200'; // highlight as green
    }

    if (medication.quantity < medication.warning_quantity) {
      return 'bg-red-200'; // highlight as red
    }

    return '';
  };

  const getInStockQuantityText = (medication: Medication | null): string => {
    if (medication == null) {
      return '-';
    }

    if (
      medication.warning_quantity == null ||
      medication.quantity >= medication.warning_quantity
    ) {
      return medication.quantity.toString();
    }

    if (medication.quantity < medication.warning_quantity) {
      return medication.quantity.toString() + ' (Low Quantity)';
    }

    return '-';
  };

  const selectedMedicationId =
    useFormReturn.watch('medication').split(' ', 1)[0] || '';

  //find the medicine selected (code to find is being repeated many times, can consider
  //replacing with this const if safe)
  const selectedMedication =
    medications.find(med => med.id.toString() === selectedMedicationId) || null;

  //watch the user input quantity
  const quantityInputByUser = useFormReturn.watch('quantity');
  const exceedsStockNow =
    selectedMedication != null &&
    !Number.isNaN(quantityInputByUser) &&
    Number(quantityInputByUser) > selectedMedication.quantity;

  const onOrderSubmit: FormEventHandler = e => {
    e.preventDefault();
    e.stopPropagation();
    useFormReturn.handleSubmit(
      data => {
        const order = {
          index: selectedOrder?.index,
          medication: data.medication, // id & name of the medication
          quantity: data.quantity || 0,
          notes: data.notes,
        };

        // check if the order is already in the list, if it is then update it, else append.
        orderList = orderList || [];
        if (selectedOrder?.index == undefined) {
          setOrder([...orderList, order]);
        } else {
          const tmp = [...orderList];
          tmp[selectedOrder.index] = order;
          setOrder(tmp);
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
      isOpen={selectedOrder != null}
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
                options={medications.map(med => ({
                  value: `${med.id.toString()} ${med.medicine_name}`,
                  label: `${med.medicine_name} (qty: ${med.quantity})`,
                }))}
                defaultValue={selectedOrder?.medication || ''}
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
            <Button type="submit" text="Submit" colour="green" />
          </form>
        </FormProvider>
      </div>
    </Modal>
  );
}
