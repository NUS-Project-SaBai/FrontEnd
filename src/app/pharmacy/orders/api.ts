import { VillagePrefix } from '@/types/VillagePrefixEnum';

/**
 * Fetches the medication orders for all patient. Used in the main page.
 * GET /api/pharmacy/orders/
 */
export async function getAllPatientMedicationOrders(): Promise<
  {
    patient: {
      patient_id: string;
      name: string;
      picture_url: string;
      village_prefix: VillagePrefix;
    };
    data: {
      orders: {
        id: number;
        medication_name: string;
        medication_code: string;
        quantity_changed: number;
        notes: string;
      }[];
      diagnoses: { category: string; details: string }[];
      visit_id: number;
      visit_date: string;
    }[];
  }[]
> {
  return [
    {
      patient: {
        patient_id: '0001',
        name: 'John',
        picture_url: '/images/patient.jpg',
        village_prefix: VillagePrefix.PC,
      },
      data: [
        {
          orders: [
            {
              id: 1,
              medication_name: 'Aspirin',
              medication_code: 'ASP123',
              quantity_changed: 2,
              notes: 'Take one tablet daily',
            },
            {
              id: 2,
              medication_name: 'Paracetamol',
              medication_code: 'PAR456',
              quantity_changed: 1,
              notes: 'Take as needed for pain',
            },
          ],
          diagnoses: [
            { category: 'Eye', details: 'Myopia' },
            { category: 'Others', details: 'Routine check-up' },
          ],
          visit_id: 1,
          visit_date: new Date().toISOString(),
        },
        {
          orders: [
            {
              id: 2,
              medication_name: 'Paracetamol',
              medication_code: 'PAR456',
              quantity_changed: 1,
              notes: 'Take as needed for pain',
            },
          ],
          diagnoses: [{ category: 'Others', details: 'Fever' }],
          visit_id: 2,
          visit_date: new Date().toISOString(),
        },
      ],
    },
  ];
}
