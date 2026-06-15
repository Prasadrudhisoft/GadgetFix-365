import { useState } from 'react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import adminApi from '../../services/adminApi';
import { useAdmin } from '../../hooks/useAdmin';
import { useToast } from '../../hooks/useUI';

const MarkPaidModal = ({ isOpen, onClose, orderId }) => {
  const [loading, setLoading] = useState(false);
  const { fetchOrders, fetchBills } = useAdmin();
  const { showToast } = useToast();

  const handleConfirm = async () => {
    setLoading(true);

    try {
      const { data } = await adminApi.markBillPaid(orderId);

      if (data.status === 'success') {
        showToast('✅ Bill marked as paid. Order completed!', 'success');

        // Refresh data
        await Promise.all([
          fetchOrders(false),
          fetchBills(false)
        ]);

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        showToast(`❌ ${data.message || 'Failed to mark paid'}`, 'error');
      }
    } catch (error) {
      console.error('Mark paid error:', error);
      showToast('❌ Network error. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Mark Bill as Paid?"
      subtitle="This will complete the order"
      size="small"
      headerColor="purple"
    >
      <p style={{
        fontSize: '14px',
        color: '#1e3a5f',
        marginBottom: '24px',
        lineHeight: 1.7,
        textAlign: 'center'
      }}>
        Are you sure you want to mark this bill as <strong>Paid</strong>?<br />
        The order status will be updated to <strong>Completed</strong>.
      </p>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          onClick={handleConfirm}
          loading={loading}
          style={{
            background: 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            boxShadow: '0 4px 15px rgba(124, 58, 237, 0.35)'
          }}
        >
          <i className="fas fa-check"></i> Yes, Mark as Paid
        </Button>
      </div>
    </Modal>
  );
};

export default MarkPaidModal;