'use client';
import { Button } from '@/components/Button';
import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import { MedicationTable } from '@/components/pharmacy/MedicationTable';
import { getMedication } from '@/data/medication/getMedications';
import { useToggle } from '@/hooks/useToggle';
import { Medication } from '@/types/Medication';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

export default function PharmacyStockPage() {
  const [isMedicineFormOpen, toggleMedicineFormOpen, setMedicineFormOpen] =
    useToggle(false);
  const useFormReturn = useForm();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [searchStr, setSearchStr] = useState('');
  const [filteredMedications, setFilteredMedications] = useState<Medication[]>(
    []
  );

  useEffect(() => {
    getMedication().then(medications => {
      setMedications(medications);
    });
  }, [isMedicineFormOpen]);

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
      <ReactModal isOpen={isMedicineFormOpen} ariaHideApp={false}>
        <FormProvider {...useFormReturn}>
          <MedicationForm closeForm={() => setMedicineFormOpen(false)} />
        </FormProvider>
      </ReactModal>
      <MedicationTable medications={filteredMedications} />
    </div>
  );
}
