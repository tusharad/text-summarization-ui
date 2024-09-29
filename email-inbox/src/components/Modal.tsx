import React from 'react';

interface ModalProps {
  summary: string;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ summary, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded shadow-lg w-2/3 max-h-3/4 overflow-y-auto">
      <button onClick={onClose} className="absolute top-2 right-2 text-gray-500">
        Close
      </button>
      <h2 className="text-2xl font-semibold mb-4">Summary</h2>
      <div className="whitespace-pre-wrap break-words max-h-[500px] max-w-full overflow-y-auto">
        {summary || 'Loading summary...'}
      </div>
    </div>
  </div>
  );
};

export default Modal;
