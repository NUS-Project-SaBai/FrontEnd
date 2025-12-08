import { Button } from '@/components/Button';
import { MedicationOrderForm } from '@/components/records/consultation/MedicationOrderForm';
import { MedicationOrderTable } from '@/components/records/consultation/MedicationOrderTable';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';
import { Patient } from '@/types/Patient';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

export function MedicationOrderSection({
  patient,
  isEditable = true,
}: {
  patient: Patient | null;
  isEditable: boolean;
}) {
  const [selectedOrder, setSelectedOrder] =
    useState<ConsultMedicationOrder | null>(null);
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
                editConsultOrder={setSelectedOrder}
                isEditable={isEditable}
                deleteConsultOrder={consult => {
                  const tmp = [...value];
                  tmp.splice(
                    tmp.findIndex(val => val.medication == consult.medication),
                    1
                  );
                  onChange(tmp);
                }}
              />
            )}
            {isEditable && (
              <Button
                text="Add Order"
                colour="green"
                onClick={() => {
                  setSelectedOrder({
                    index: undefined,
                    medication: '',
                    quantity: undefined,
                    notes: '',
                  });
                }}
              />
            )}
          </div>
          <MedicationOrderForm
            selectedOrder={selectedOrder}
            orderList={value}
            setOrder={onChange}
            closeForm={() => setSelectedOrder(null)}
            patient={patient}
          />
        </>
      )}
    />
  );
}
