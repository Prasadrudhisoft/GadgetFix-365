// src/components/modals/CancelOrderModal.jsx
import { useState } from 'react';
import { Modal } from '@components/shared/Modal';
import { Button } from '@components/shared/Button';
import { useUI } from '@hooks/useUI';
import { ordersAPI } from '@services/api';

export const CancelOrderModal = ({ isOpen, onClose, orderId, onCancelSuccess }) => {
  const { showToast } = useUI();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      const result = await ordersAPI.cancelOrder(orderId);
      if (result.status === 'success') {
        showToast('✅ Order cancelled successfully.', 'success');
        onCancelSuccess?.();
        onClose();
      } else {
        showToast(`❌ ${result.message || 'Could not cancel order.'}`, 'error');
      }
    } catch (error) {
      showToast('❌ Network error. Please try again.', 'error');
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="p-8 text-center">
        <div className="text-5xl mb-4">⚠️</div>
        <h3 className="font-sora text-[19px] font-extrabold text-text mb-2.5 tracking-tight">
          Cancel Order?
        </h3>
        <p className="font-manrope text-[13.5px] text-text-3 leading-[1.75] mb-5.5 font-medium">
          Are you sure you want to cancel this repair request? This action cannot be undone.
        </p>
        <div className="flex gap-2.5 justify-center">
          <Button variant="outline" onClick={onClose} disabled={isCancelling}>
            Keep Order
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmCancel}
            loading={isCancelling}
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};