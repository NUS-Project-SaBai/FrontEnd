'use client';
import { LoadingUI } from '@/components/LoadingUI';
import { Modal } from '@/components/Modal';
import { ConsultationForm } from '@/components/records/consultation/ConsultationForm';
import { getConsultByID } from '@/data/consult/getConsult';
import { useLoadingState } from '@/hooks/useLoadingState';
import { Consult } from '@/types/Consult';
import { Patient } from '@/types/Patient';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function EditConsultationModal({
  consultId,
  patient,
  isOpen,
  onRequestClose,
  onEditComplete,
}: {
  consultId: number | null;
  patient: Patient;
  isOpen: boolean;
  onRequestClose: () => void;
  onEditComplete?: () => void;
}) {
  const [consult, setConsult] = useState<Consult | null>(null);
  const { isLoading, withLoading } = useLoadingState(true);

  useEffect(() => {
    if (consultId == null || !isOpen) {
      setConsult(null);
      return;
    }

    // Only load if we don't have the consult or it's a different consult
    if (consult && consult.id === consultId) {
      return;
    }

    withLoading(async () => {
      try {
        const loadedConsult = await getConsultByID(consultId.toString());
        if (loadedConsult == null) {
          toast.error('Failed to load consultation data');
          onRequestClose();
          return;
        }
        setConsult(loadedConsult);
      } catch (error) {
        console.error('Error loading consult:', error);
        toast.error('Failed to load consultation data');
        onRequestClose();
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consultId, isOpen]);

  const handleEditComplete = () => {
    if (onEditComplete) {
      onEditComplete();
    }
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      ariaHideApp={false}
      title="Edit Consultation"
      text="Cancel"
      size="xl"
    >
      {isLoading ? (
        <LoadingUI message="Loading Consultation..." />
      ) : consult == null ? (
        <p>No Consult Found</p>
      ) : (
        <div className="">
          <ConsultationForm
            key={consultId}
            visitId={consult.visit.id.toString()}
            patient={patient}
            editConsultId={consultId}
            onEditComplete={handleEditComplete}
          />
        </div>
      )}
    </Modal>
  );
}
