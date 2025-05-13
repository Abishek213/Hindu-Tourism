import { X } from 'lucide-react';

const Modal = ({ title, onClose, children, footer }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </button>
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="p-3">
          {children}
        </div>
        {footer && (
          <div className="p-3 border-t border-gray-200 flex justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;