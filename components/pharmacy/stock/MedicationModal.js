import React from 'react';
import CustomModal from '@/components/CustomModal';

export function MedicationModal({ modalIsOpen, toggleModal, medicationForm }) {
  return (
    <CustomModal isOpen={modalIsOpen} onRequestClose={toggleModal}>
      {medicationForm()}
    </CustomModal>
  );
}
