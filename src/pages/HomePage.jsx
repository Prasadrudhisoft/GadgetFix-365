// src/pages/HomePage.jsx
import { useCallback } from 'react'; 
import { useAuth } from '@hooks/useAuth';
import { useUI } from '@hooks/useUI';

import { Navbar } from '@components/layout/Navbar';
import { Footer } from '@components/layout/Footer';
import { MobileDrawer } from '@components/layout/MobileDrawer';

import { HeroSection } from '@components/home/HeroSection';
import { BrandsMarquee } from '@components/home/BrandsMarquee';
import { ServicesSection } from '@components/home/ServicesSection';
import { HowItWorksSection } from '@components/home/HowItWorksSection';
import { WhyChooseUsSection } from '@components/home/WhyChooseUsSection';
import { TestimonialsSection } from '@components/home/TestimonialsSection';
import { FAQSection } from '@components/home/FAQSection';
import { CTASection } from '@components/home/CTASection';

import { AuthModal } from '@components/modals/AuthModal';
import { BookRepairModal } from '@components/modals/BookRepairModal';

import { OrdersPanel } from '@components/panels/OrdersPanel';
import { ProfilePanel } from '@components/panels/ProfilePanel';
import { PanelOverlay } from '@components/panels/PanelOverlay';

export const HomePage = () => {
  const { isLoggedIn } = useAuth();
  const { openModal, closeModal, isModalOpen, isPanelOpen, closeAllPanels, modalData, getModalProps } = useUI();



  const openAuthModal = useCallback((tab = 'login') => {
    openModal('auth', { tab });
  }, [openModal]);

  const closeAuthModal = useCallback(() => {
    closeModal('auth');
  }, [closeModal]);

  const handleBookRepair = useCallback((categoryId, brandId) => {
    if (!isLoggedIn) {
      openModal('auth', { tab: 'login' });
      return;
    }
    openModal('book', { categoryId, brandId });
  }, [isLoggedIn, openModal]);

  const closeBookModal = useCallback(() => {
    closeModal('book');
  }, [closeModal]);

  // NOTE: UIContext currently stores modalData as a flat object
  // (e.g. { categoryId, brandId }) tied to whichever modal is open —
  // it is NOT namespaced like { book: { categoryId, brandId } }.
  // So we only spread modalData when this modal is the one that's open.
  const getModalPropsSafe = (modalName) => {
    if (getModalProps) return getModalProps(modalName);
    return {
      isOpen: isModalOpen(modalName),
      ...(isModalOpen(modalName) ? modalData : {}),
    };
  };

  const authModalProps = getModalPropsSafe('auth');
  const bookModalProps = getModalPropsSafe('book');

  return (
    <div className="min-h-screen">
      <Navbar onBookRepair={() => handleBookRepair()} onOpenAuth={openAuthModal} />
      <MobileDrawer onBookRepair={() => handleBookRepair()} onOpenAuth={openAuthModal} />

      <HeroSection onBookRepair={handleBookRepair} />
      <BrandsMarquee />

      <ServicesSection
        onBookRepair={handleBookRepair}
        onOpenAuth={openAuthModal}
      />

      <HowItWorksSection />
      <WhyChooseUsSection />
      <TestimonialsSection />
      <FAQSection />
      <CTASection onBookRepair={handleBookRepair} />
      <Footer />

      <AuthModal
        isOpen={authModalProps.isOpen}
        onClose={closeAuthModal}
        initialTab={authModalProps.tab}
      />



      <BookRepairModal
        isOpen={bookModalProps.isOpen}
        onClose={closeBookModal}
        preselectedCategoryId={bookModalProps.categoryId}  
        preselectedBrandId={bookModalProps.brandId}        
      />

      {(isPanelOpen('orders') || isPanelOpen('profile')) && (
        <PanelOverlay onClick={closeAllPanels} />
      )}
      {isPanelOpen('orders') && <OrdersPanel onClose={closeAllPanels} />}
      {isPanelOpen('profile') && <ProfilePanel onClose={closeAllPanels} />}
    </div>
  );
};

export default HomePage;