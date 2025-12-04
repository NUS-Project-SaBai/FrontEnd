'use client';
import { LoadingPage } from '@/components/LoadingPage';
import { MedicationTable } from '@/components/pharmacy/MedicationTable';
import { AddMedicationModal } from '@/components/pharmacy/stock/AddMedicationModal';
import { EditMedicationModal } from '@/components/pharmacy/stock/EditMedicationModal';
import { HistoryMedicationModal } from '@/components/pharmacy/stock/HistoryMedicationModal';
import { getMedication } from '@/data/medication/getMedications';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Medication } from '@/types/Medication';
import { useEffect, useMemo, useState } from 'react';

export default function PharmacyStockPage() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchStr, setSearchStr] = useState('');
  const { isLoading, withLoading } = useLoadingState(true);

  const fetchMedications = withLoading(async () => {
    const medications = await getMedication();
    setMedications(medications);
  });

  useEffect(() => {
    fetchMedications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredMedications = useMemo(() => {
    if (searchStr === '') {
      return medications;
    }
    return medications.filter(med =>
      med.medicine_name.toLowerCase().includes(searchStr.toLowerCase())
    );
  }, [searchStr, medications]);

  return (
    <LoadingPage isLoading={isLoading} message="Loading Medications...">
      <div className="p-2">
        <h1>Medication Stock</h1>
        <div className="flex gap-x-2">
          <input
            id="search"
            type="search"
            className="w-full"
            onChange={e => setSearchStr(e.target.value)}
            disabled={isLoading}
            value={searchStr}
            placeholder={
              isLoading ? 'Loading Medicine...' : 'Search for Medicine'
            }
          />
          <AddMedicationModal reloadAllMedications={fetchMedications} />
        </div>
        <EditMedicationModal reloadAllMedications={fetchMedications} />
        <HistoryMedicationModal />
        <MedicationTable medications={filteredMedications} />
      </div>
    </LoadingPage>
  );
}
