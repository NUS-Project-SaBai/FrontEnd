'use client';
import { Button } from '@/components/Button';
import { MedicationTable } from '@/components/pharmacy/MedicationTable';
import { getMedication } from '@/data/medication/getMedications';
import { useToggle } from '@/hooks/useToggle';
import { Medication } from '@/types/Medication';
import { Suspense, useEffect, useState } from 'react';
import { AddMedicationModal } from './AddMedicationModal';
import { EditMedicationModal } from './EditMedicationModal';
import { HistoryMedicationModal } from './HistoryMedicationModal';

export default function PharmacyStockPage() {
  const [isMedicineFormOpen, toggleMedicineFormOpen, setMedicineFormOpen] =
    useToggle(false);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchStr, setSearchStr] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(
    []
  );

  useEffect(() => {
    getMedication().then(medications => {
      setMedications(medications);
    });
  }, []);

  useEffect(() => {
    if (searchStr === '') {
      setFilteredMedications(medications);
      return;
    }
    const filtered = medications.filter(med =>
      med.medicine_name.toLowerCase().includes(searchStr.toLowerCase())
    );
    setFilteredMedications(filtered);
  }, [searchStr, medications]);

  return (
    <div className="p-2">
      <h2>Medication Stock</h2>
      <div>
        <label htmlFor="search">Search for Medicine</label>
        <input
          id="search"
          type="search"
          className="w-full"
          onChange={e => setSearchStr(e.target.value)}
          placeholder="Search for Medicine"
        />
      </div>
      <Button
        text="Add New Medicine"
        colour="green"
        onClick={toggleMedicineFormOpen}
      />
      <AddMedicationModal
        isOpen={isMedicineFormOpen}
        closeForm={() => setMedicineFormOpen(false)}
      />
      <Suspense>
        <EditMedicationModal />
      </Suspense>
      <Suspense>
        <HistoryMedicationModal />
      </Suspense>
      <MedicationTable medications={filteredMedications} />
    </div>
  );
}
