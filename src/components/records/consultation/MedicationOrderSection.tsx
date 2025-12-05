import { Button } from '@/components/Button';
import { MedicationOrderForm } from '@/components/records/consultation/MedicationOrderForm';
import { MedicationOrderTable } from '@/components/records/consultation/MedicationOrderTable';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { useReducer } from 'react';
import { Controller } from 'react-hook-form';

type FormState = {
  isOpen: boolean;
  order: ConsultMedicationOrder | null;
  index?: number;
};

type FormAction =
  | { type: 'OPEN_FOR_ADD' }
  | { type: 'OPEN_FOR_EDIT'; order: ConsultMedicationOrder; index: number }
  | { type: 'CLOSE' };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'OPEN_FOR_ADD':
      return { isOpen: true, order: null, index: undefined };
    case 'OPEN_FOR_EDIT':
      return { isOpen: true, order: action.order, index: action.index };
    case 'CLOSE':
      return { isOpen: false, order: null, index: undefined };
  }
}

export function MedicationOrderSection({
  patient,
}: {
  patient: Patient | null;
}) {
  const [formState, dispatch] = useReducer(formReducer, {
    isOpen: false,
    order: null,
    index: undefined,
  });
  return (
    <Controller
      name="orders"
      render={({ field: { value, onChange } }) => (
        <>
          <div className="rounded-lg bg-gray-50 p-2 shadow">
            <h2>Order</h2>
            <hr />
            {value === undefined ? (
              <p className="py-2">No orders yet</p>
            ) : (
              <MedicationOrderTable
                consultOrders={value}
                editConsultOrder={(order, index) => {
                  dispatch({ type: 'OPEN_FOR_EDIT', order, index });
                }}
                deleteConsultOrder={consult => {
                  const tmp = [...value];
                  tmp.splice(
                    tmp.findIndex(val => val.medicationId === consult.medicationId),
                    1
                  );
                  onChange(tmp);
                }}
              />
            )}
            <Button
              text="Add Order"
              colour="green"
              onClick={() => {
                dispatch({ type: 'OPEN_FOR_ADD' });
              }}
            />
          </div>
          <MedicationOrderForm
            isFormOpen={formState.isOpen}
            selectedOrder={formState.order}
            orderIndex={formState.index}
            orderList={value}
            setOrder={onChange}
            closeForm={() => {
              dispatch({ type: 'CLOSE' });
            }}
            patient={patient}
          />
        </>
      )}
    />
  );
}
