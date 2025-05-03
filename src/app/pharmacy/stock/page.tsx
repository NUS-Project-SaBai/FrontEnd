'use client';
import { Button } from '@/components/Button';
import { MedicationForm } from '@/components/pharmacy/MedicationForm';
import { useToggle } from '@/hooks/useToggle';
import { FormProvider, useForm } from 'react-hook-form';
import ReactModal from 'react-modal';

export default function PharmacyStockPage() {
  const [isMedicineFormOpen, toggleMedicineFormOpen, setMedicineFormOpen] =
    useToggle(false);
  const useFormReturn = useForm();
  return (
    <div className="p-2">
      <h2>Medication Stock</h2>
      <p>Search for Medicine</p>
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
    </div>
  );
}
