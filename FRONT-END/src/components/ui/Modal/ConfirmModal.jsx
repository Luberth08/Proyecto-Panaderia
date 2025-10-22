// src/components/ui/Modal/ConfirmModal.jsx
import Modal from './Modal';
import './ConfirmModal.css';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirmar Eliminación",
  itemName,
  message = "¿Estás seguro de que deseas eliminar este elemento?",
  confirmText = "Sí, Eliminar",
  cancelText = "Cancelar",
  type = "delete" 
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="small">
      <div className="confirm-modal-content">
        <div className="confirm-message">
          <p>{message}</p>
          {itemName && (
            <p className="item-name">
              <strong>"{itemName}"</strong>
            </p>
          )}
        </div>
        
        <div className="warning-text">
          ⚠️ Esta acción no se puede deshacer.
        </div>

        <div className="confirm-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`btn-confirm ${type}`} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;