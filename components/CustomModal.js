import React from 'react';
import Modal from 'react-modal';

const CustomModal = ({
  isOpen,
  onRequestClose,
  children,
  showCloseButton = true,
  contentStyle = '',
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={`fixed inset-0 left-[20%] right-[7.5%] flex items-center justify-center z-50 p-4 ${contentStyle}`}
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-4xl max-h-[100vh] overflow-y-auto">
        {children}
        {showCloseButton && (
          <button
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onRequestClose}
            aria-label="Close modal"
          >
            Close
          </button>
        )}
      </div>
    </Modal>
  );
};

export default CustomModal;
