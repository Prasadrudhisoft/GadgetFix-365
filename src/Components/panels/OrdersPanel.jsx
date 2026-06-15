// src/components/panels/OrdersPanel.jsx
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useOrders } from '@hooks/useOrders';
import { useUI } from '@hooks/useUI';
import { useScrollLock } from '@hooks/useScrollLock';
import { OrderCard } from './OrderCard';
import { QuotationModal } from '@components/modals/QuotationModal';
import { FinalQuotationModal } from '@components/modals/FinalQuotationModal';
import { CancelOrderModal } from '@components/modals/CancelOrderModal';
import { BillModal } from '@components/modals/BillModal';
import { ReceiptModal } from '@components/modals/Receiptmodal';
import { Spinner } from '@components/shared/Spinner';
import clsx from 'clsx';

const filterOptions = [
  { value: 'all', label: 'All' },
  { value: 'Requested', label: '⏳ Requested' },
  { value: 'quotation_sent', label: '💬 Quotation' },
  { value: 'Confirmed', label: '👍 Confirmed' },
  { value: 'Picked Up', label: '🚗 Picked Up' },
  { value: 'Reviewed', label: '🔍 Reviewed' },
  { value: 'final_quotation_sent', label: '📋 Final Quote' },
  { value: 'Final_Confirmed', label: '✅ F.Confirmed' },
  { value: 'Repairing', label: '🔧 Repairing' },
  { value: 'Repair Done', label: '🛠️ Repair Done' },
  { value: 'Delivered', label: '📦 Delivered' },
  { value: 'Completed', label: '🎉 Completed' },
  { value: 'Cancelled', label: '✕ Cancelled' },
];

export const OrdersPanel = ({ onClose }) => {
  const { orders, filteredOrders, isLoading, activeFilter, setActiveFilter, stats, fetchOrders } = useOrders();
  const { isModalOpen, openModal, closeModal } = useUI();
  const [activeOrderId, setActiveOrderId] = useState(null);

  useScrollLock(true);

  useEffect(() => {
    fetchOrders(true);
  }, []);

  const handleOpenQuotation = (id) => { setActiveOrderId(id); openModal('quotation'); };
  const handleOpenFinalQuotation = (id) => { setActiveOrderId(id); openModal('finalQuotation'); };
  const handleOpenCancel = (id) => { setActiveOrderId(id); openModal('cancelOrder'); };
  const handleOpenBill = (id) => { setActiveOrderId(id); openModal('bill'); };
  const handleOpenReceipt = (id) => { setActiveOrderId(id); openModal('receipt'); };

  const handleModalSuccess = async () => {
    await fetchOrders(true);
  };

  return (
    <>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 right-0 w-full max-w-[560px] h-screen bg-white z-[3001] flex flex-col shadow-xl"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-border bg-gradient-brand text-white flex items-center justify-between flex-shrink-0">
          <h2 className="font-sora text-lg font-extrabold tracking-tight">📋 My Orders</h2>
          <button
            onClick={onClose}
            className="w-[34px] h-[34px] rounded-full bg-white/20 flex items-center justify-center transition-all hover:bg-white/30 hover:rotate-90"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
          {/* Stats */}
          {!isLoading && orders.length > 0 && (
            <div className="grid grid-cols-4 gap-2.5 mb-4">
              {[
                { label: 'Total', value: stats.total },
                { label: 'Pending', value: stats.pending },
                { label: 'Progress', value: stats.progress },
                { label: 'Done', value: stats.done },
              ].map((s) => (
                <div key={s.label} className="bg-bg2 border border-border rounded-lg p-3 text-center">
                  <div className="font-sora text-[21px] font-extrabold text-brand tracking-tight">{s.value}</div>
                  <div className="font-manrope text-[10.5px] text-text-4 font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Filters */}
          {!isLoading && orders.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-2 mb-3.5 custom-scrollbar">
              {filterOptions.map((filter) => {
                const count = filter.value === 'all'
                  ? orders.length
                  : orders.filter((o) => o.status === filter.value).length;
                return (
                  <button
                    key={filter.value}
                    onClick={() => setActiveFilter(filter.value)}
                    className={clsx(
                      'px-3 py-1.5 rounded-full font-manrope text-[11.5px] font-bold whitespace-nowrap border-[1.5px] flex-shrink-0 transition-all',
                      activeFilter === filter.value
                        ? 'bg-brand text-white border-brand'
                        : 'bg-bg2 text-text-3 border-border hover:border-brand hover:text-brand'
                    )}
                  >
                    {filter.label} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Orders List */}
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <Spinner size="lg" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-text-4">
              <div className="text-5xl mb-3">📋</div>
              <h3 className="font-sora text-[15px] font-bold mb-1.5">No orders found</h3>
              <p className="font-manrope text-xs font-medium">No repair requests match this filter.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOpenQuotation={handleOpenQuotation}
                  onOpenFinalQuotation={handleOpenFinalQuotation}
                  onOpenCancel={handleOpenCancel}
                  onOpenBill={handleOpenBill}
                  onOpenReceipt={handleOpenReceipt}
                />
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <QuotationModal
        isOpen={isModalOpen('quotation')}
        onClose={() => closeModal()}
        orderId={activeOrderId}
        onConfirmSuccess={handleModalSuccess}
      />
      <FinalQuotationModal
        isOpen={isModalOpen('finalQuotation')}
        onClose={() => closeModal()}
        orderId={activeOrderId}
        onConfirmSuccess={handleModalSuccess}
      />
      <CancelOrderModal
        isOpen={isModalOpen('cancelOrder')}
        onClose={() => closeModal()}
        orderId={activeOrderId}
        onCancelSuccess={handleModalSuccess}
      />
      <BillModal
        isOpen={isModalOpen('bill')}
        onClose={() => closeModal()}
        orderId={activeOrderId}
      />
      <ReceiptModal
        isOpen={isModalOpen('receipt')}
        onClose={() => closeModal()}
        orderId={activeOrderId}
      />
    </>
  );
};