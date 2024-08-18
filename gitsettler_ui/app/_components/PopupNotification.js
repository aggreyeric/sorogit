// components/PopupNotification.js
import { useState } from 'react';

const PopupNotification = ({ color, message, onClose }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
  };


  return (
    <div
      className={`fixed top-0  m-4 p-4 bg-${color}-500 text-white rounded-lg shadow-lg ${
        isOpen ? 'block' : 'hidden'
      }`}
    >
      <p>{message}</p>
      <button onClick={handleClose} className="text-white hover:text-gray-200">
        Close
      </button>
    </div>
  );
};

export default PopupNotification;