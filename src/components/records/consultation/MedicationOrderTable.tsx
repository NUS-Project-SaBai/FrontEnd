import { Button } from '@/components/Button';
import { ConsultMedicationOrder } from '@/types/ConsultMedicationOrder';

export function MedicationOrderTable({
  consultOrders,
  editConsultOrder,
  deleteConsultOrder,
}: {
  consultOrders: ConsultMedicationOrder[];
  editConsultOrder: (order: ConsultMedicationOrder, index: number) => void;
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
              consultOrder={order}
              orderIndex={index}
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
  orderIndex,
  editConsultOrder,
  deleteConsultOrder,
}: {
  consultOrder: ConsultMedicationOrder;
  orderIndex: number;
  editConsultOrder: (order: ConsultMedicationOrder, index: number) => void;
  deleteConsultOrder: (order: ConsultMedicationOrder) => void;
}) {
  return (
    <tr className="bg-white">
      <td>{consultOrder.medicationName}</td>
      <td>{consultOrder.quantity}</td>
      <td>
        <Button
          text="Edit"
          colour="blue"
          onClick={() => editConsultOrder(consultOrder, orderIndex)}
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
