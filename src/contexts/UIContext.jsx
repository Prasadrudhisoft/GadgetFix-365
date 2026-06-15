import { createContext, useState, useCallback } from 'react';

export const UIContext = createContext();

export const UIProvider = ({ children }) => {
  const [modal, setModal] = useState(null);
  const [modalData, setModalData] = useState({});

  const [panels, setPanels] = useState({
    orders: false,
    profile: false,
  });

  const [toasts, setToasts] = useState([]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openModal = useCallback((name, data = {}) => {
    setModal(name);
    setModalData(data);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setModalData({});
  }, []);

  const isModalOpen = useCallback(
    (name) => modal === name,
    [modal]
  );

  const openPanel = useCallback((name) => {
    setPanels((prev) => ({
      ...prev,
      [name]: true,
    }));
  }, []);

  const closePanel = useCallback((name) => {
    setPanels((prev) => ({
      ...prev,
      [name]: false,
    }));
  }, []);

  const closeAllPanels = useCallback(() => {
    setPanels({
      orders: false,
      profile: false,
    });
  }, []);

  const isPanelOpen = useCallback(
    (name) => panels[name],
    [panels]
  );

  const addToast = useCallback((toast) => {
    const id = Date.now();

    setToasts((prev) => [...prev, { id, ...toast }]);

    setTimeout(() => {
      setToasts((prev) =>
        prev.filter((t) => t.id !== id)
      );
    }, 3000);
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      addToast({ message, type });
    },
    [addToast]
  );

  return (
    <UIContext.Provider
      value={{
        isMobileMenuOpen,
        toggleMobileMenu,
        closeMobileMenu,

        modal,
        modalData,
        openModal,
        closeModal,
        isModalOpen,

        panels,
        openPanel,
        closePanel,
        closeAllPanels,
        isPanelOpen,

        toasts,
        addToast,
        showToast,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};