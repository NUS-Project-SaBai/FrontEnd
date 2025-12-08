import { Button } from '@/components/Button';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';

export function MedicationOrderTable({
  consultOrders,
  editConsultOrder,
  deleteConsultOrder,
  isEditable = true,
}: {
  consultOrders: ConsultMedicationOrder[];
  editConsultOrder: (order: ConsultMedicationOrder) => void;
  deleteConsultOrder: (order: ConsultMedicationOrder) => void;
  isEditable: boolean;
}) {
  return (
    <div className="my-2 overflow-x-auto">
      <table className="rounded-table text-left">
        <thead>
          <tr className="bg-gray-200">
            <th>Medicine</th>
            <th>Quantity</th>
            {isEditable && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {consultOrders.map((order, index) => (
            <MedicationOrderRow
              key={index}
              consultOrder={{ ...order, index: index }}
              editConsultOrder={editConsultOrder}
              deleteConsultOrder={deleteConsultOrder}
              isEditable={isEditable}
            />
          ))}
          {consultOrders.length === 0 && (
            <tr className="bg-white">
              <td colSpan={isEditable ? 3 : 2} className="py-4 text-center">
                No medication orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function MedicationOrderRow({
  consultOrder,
  editConsultOrder,
  deleteConsultOrder,
  isEditable,
}: {
  consultOrder: ConsultMedicationOrder;
  editConsultOrder: (order: ConsultMedicationOrder) => void;
  deleteConsultOrder: (order: ConsultMedicationOrder) => void;
  isEditable: boolean;
}) {
  return (
    <tr className="bg-white">
      <td>
        {consultOrder.medication.slice(
          consultOrder.medication.indexOf(' ') + 1
        )}
      </td>
      <td>{consultOrder.quantity}</td>
      <td>
        {isEditable && (
          <>
            <Button
              text="Edit"
              colour="blue"
              onClick={() =>
                editConsultOrder({
                  ...consultOrder,
                  quantity: consultOrder.quantity || 0,
                })
              } // Ensure quantity is a number
            />
            <Button
              text="Delete"
              colour="red"
              onClick={() => deleteConsultOrder(consultOrder)}
            />
          </>
        )}
      </td>
    </tr>
  );
}
