import { Button } from '@/components/Button';
import { DisplayField } from '@/components/DisplayField';
import { RHFDropdown } from '@/components/inputs/RHFDropdown';
import { RHFInputField } from '@/components/inputs/RHFInputField';
import { getMedication } from '@/data/medication/getMedications';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Medication } from '@/types/Medication';
import { Patient } from '@/types/Patient';
import { FormEventHandler, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactModal from 'react-modal';

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

  useEffect(() => {
    getMedication().then(setMedications);
  }, []);

  const selectedMedicationId =
    useFormReturn.watch('medication').split(' ', 1)[0] || '';

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
    <ReactModal
      isOpen={selectedOrder != null}
      onRequestClose={closeForm}
      ariaHideApp={false}
    >
      <div className="flex flex-col gap-y-2">
        <h2>Order</h2>
        <FormProvider {...useFormReturn}>
          <form onSubmit={onOrderSubmit}>
            <DisplayField
              label="Patient Allergies"
              content={
                patient === null
                  ? 'Error Gettting Patient Allergies'
                  : patient.drug_allergy || '-'
              }
            />
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
            <div className="grid grid-cols-2 gap-4">
              <DisplayField
                label="In Stock"
                content={
                  medications == undefined || selectedMedicationId == ''
                    ? '-'
                    : medications
                        .find(med => med.id.toString() == selectedMedicationId)
                        ?.quantity.toString() || '-'
                }
              />
              <RHFInputField
                name="quantity"
                label="Quantity to Order"
                type="number"
                isRequired={true}
              />
            </div>
            <RHFInputField
              type="textarea"
              name="notes"
              label="Dosage Instructions"
              placeholder="Dosage Instructions"
              isRequired={true}
            />
            <Button
              type="button"
              text="Cancel"
              colour="red"
              onClick={closeForm}
            />
            <Button type="submit" text="Submit" colour="green" />
          </form>
        </FormProvider>
      </div>
    </ReactModal>
  );
}
