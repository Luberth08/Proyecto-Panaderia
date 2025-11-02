import { useState } from 'react';

export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [onConfirm, setOnConfirm] = useState(null);

  const openConfirmModal = (message, onConfirmAction) => {
    setConfirmMessage(message);
    setOnConfirm(() => onConfirmAction);
    setIsOpen(true);
  };

  const closeConfirmModal = () => {
    setIsOpen(false);
    setConfirmMessage('');
    setOnConfirm(null);
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeConfirmModal();
  };

  return {
    isOpen,
    confirmMessage,
    openConfirmModal,
    closeConfirmModal,
    handleConfirm,
  };
};
