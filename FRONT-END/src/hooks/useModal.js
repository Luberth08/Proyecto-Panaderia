// src/hooks/useModal.js
import { useState } from 'react';

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  const [modalData, setModalData] = useState(null);

  const openModal = (data = null) => {
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalData(null);
  };

  const toggleModal = () => {
    setIsOpen(prev => !prev);
    if (isOpen) {
      setModalData(null);
    }
  };

  return {
    isOpen,
    modalData,
    openModal,
    closeModal,
    toggleModal,
    setModalData
  };
};

// Hook específico para modales de confirmación
export const useConfirmModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [onConfirmCallback, setOnConfirmCallback] = useState(null);

  const openConfirmModal = (item, onConfirm) => {
    setItemToDelete(item);
    setOnConfirmCallback(() => onConfirm);
    setIsOpen(true);
  };

  const closeConfirmModal = () => {
    setIsOpen(false);
    setItemToDelete(null);
    setOnConfirmCallback(null);
  };

  const handleConfirm = async () => {
    if (onConfirmCallback && itemToDelete) {
      await onConfirmCallback(itemToDelete);
    }
    closeConfirmModal();
  };

  return {
    isOpen,
    itemToDelete,
    openConfirmModal,
    closeConfirmModal,
    handleConfirm
  };
};