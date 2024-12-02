import React from 'react';
import Modal from 'react-modal';
import { Button } from './TextComponents';

const CustomModal = ({
  isOpen,
  onRequestClose,
  onSubmit,
  children,
  contentStyle = '',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`fixed inset-0 left-[20%] right-[7.5%] flex items-center justify-center z-50 p-4 ${contentStyle}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {children}
        <div className="flex justify-center items-center space-x-4 mt-4">
          {typeof onRequestClose === 'function' && (
            <Button text="Close" colour="red" onClick={onRequestClose} />
          )}
          {typeof onSubmit === 'function' && (
            <Button text="Submit" colour="green" onClick={onSubmit} />
          )}
        </div>
      </div>
    </Modal>
  );
};

export default CustomModal;
