/**
 * For HistoryMedicationModal
 *
 * /api/medication/{id}/history/
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function fetchMedicationHistory(id: number): Promise<
  {
    approval_name: string;
    doctor_name: string; // '-' for no doctor
    patient_name: string; // '-' for no patient
    qty_changed: number;
    qty_remaining: number;
    date: string;
  }[]
> {
  return [
    {
      approval_name: 'sabai',
      doctor_name: '-',
      patient_name: '-',
      qty_changed: 50,
      qty_remaining: 50,
      date: '2023-10-01T12:00:00Z',
    },
    {
      approval_name: 'sabai',
      doctor_name: 'Dr. Smith',
      patient_name: 'John',
      qty_changed: -10,
      qty_remaining: 40,
      date: '2023-10-01T12:00:00Z',
    },
  ];
}
/**
 * Get the stock data for the pharmacy page
 * GET /api/pharmacy/stock/
 */
export async function fetchPharmacyStockData(): Promise<
  {
    medicine_id: number;
    medicine_name: string;
    quantity: number;
    code: string;
  }[]
> {
  return [
    {
      medicine_id: 1,
      medicine_name: 'Paracetamol',
      quantity: 100,
      code: 'PAR123',
    },
    {
      medicine_id: 2,
      medicine_name: 'Ibuprofen',
      quantity: 50,
      code: 'IBU456',
    },
  ];
}
