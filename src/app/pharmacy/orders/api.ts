import { VillagePrefix } from '@/types/VillagePrefixEnum';

/**
 * Fetches the medication orders for all patient. Used in the main page.
 * GET /api/pharmacy/orders/
 */
export async function fetchPharmacyOrders(): Promise<
  {
    patient: {
      patient_id: string;
      name: string;
      picture_url: string;
      village_prefix: VillagePrefix;
    };
    orders: {
      id: number;
      medication_name: string;
      medication_code: string;
      quantity_changed: number;
      notes: string;
    }[];
    diagnoses: { category: string; details: string }[];
    visit_date: string;
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
      orders: [
        {
          id: 1,
          medication_name: 'Aspirin',
          medication_code: 'ASP123',
          quantity_changed: 2,
          notes: 'Take one tablet daily',
        },
      ],
      diagnoses: [
        { category: 'Eye', details: 'Myopia' },
        { category: 'Others', details: 'Routine check-up' },
      ],
      visit_date: new Date().toISOString(),
    },
  ];
}
