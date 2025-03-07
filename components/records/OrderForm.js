import {
  DisplayField,
  InputBox,
  InputField,
  Button,
} from '@/components/TextComponents';

export function OrderForm({
  allergies,
  medications,
  handleInputChange,
  orderDetails,
  medicationOptions,
}) {
  function calculateMedicineCurrentStock(medicine) {
    const medication = medications.find(med => medicine === med.id);
    return medication ? medication.quantity : 0;
  }

  function selectedMedicationValue() {
    if (orderDetails?.medicine) {
      return `${orderDetails.medicine} ${orderDetails.medicine_name}`;
    }
    return '0 Dummy';
  }

  return (
    <div className="grid gap-y-2">
      <h1 className="text-black text-2xl font-bold mb-3">Order</h1>

      <DisplayField
        label="Allergies"
        content={<h2 className="text-red-600">{allergies}</h2>}
      />

      <div className="field ">
        <label className="label">Medicine</label>
        <div className="relative">
          <select
            name={'medication'}
            value={selectedMedicationValue()}
            onChange={handleInputChange}
            className="block appearance-none w-full bg-white border border-gray-300 text-gray-900 py-2 px-3 rounded-lg leading-tight focus:outline-none focus:border-blue-500"
          >
            <option disabled value={'0 Dummy'}>
              -
            </option>
            {medicationOptions}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <svg
              className="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10.293 13.707a1 1 0 01-1.414-1.414L9.586 12 7.293 9.707a1 1 0 111.414-1.414L11 10.586l2.293-2.293a1 1 0 111.414 1.414L12.414 12l2.293 2.293a1 1 0 010 1.414 1 1 0 01-1.414 0L11 13.414l-2.293 2.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex ">
        <div className="w-1/2 pr-2">
          <DisplayField
            label="In Stock"
            content={calculateMedicineCurrentStock(orderDetails.medicine)}
          />
        </div>
        <div className="w-1/2 pl-2">
          <InputField
            label="Quantity to be ordered"
            onChange={handleInputChange}
            value={orderDetails.quantity}
            type="number"
            name="quantity"
          />
        </div>
      </div>

      <InputBox
        label="Dosage Instructions"
        name="notes"
        placeholder="Dosage Instruction"
        onChange={handleInputChange}
        value={orderDetails.notes}
      />
    </div>
  );
}
