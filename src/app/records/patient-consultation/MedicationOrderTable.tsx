import { Button } from '@/components/Button';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';

export function MedicationOrderTable({
  consultOrders,
  editConsultOrder,
  deleteConsultOrder,
}: {
  consultOrders: ConsultMedicationOrder[];
  editConsultOrder: (order: ConsultMedicationOrder) => void;
  deleteConsultOrder: (order: ConsultMedicationOrder) => void;
}) {
  return (
    <div className="my-2 overflow-x-auto">
      <table className="rounded-table text-left">
        <thead>
          <tr className="bg-gray-200">
            <th>Medicine</th>
            <th>Quantity</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {consultOrders.map((order, index) => (
            <MedicationOrderRow
              key={index}
              consultOrder={{ ...order, index: index }}
              editConsultOrder={editConsultOrder}
              deleteConsultOrder={deleteConsultOrder}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MedicationOrderRow({
  consultOrder,
  editConsultOrder,
  deleteConsultOrder,
}: {
  consultOrder: ConsultMedicationOrder;
  editConsultOrder: (order: ConsultMedicationOrder) => void;
  deleteConsultOrder: (order: ConsultMedicationOrder) => void;
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
      </td>
    </tr>
  );
}
