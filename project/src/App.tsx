import React, { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { BottomNavigation } from './components/BottomNavigation';
import { DiscoverFeed } from './components/DiscoverFeed';
import { MessagesPage } from './components/MessagesPage';
import { CartPage } from './components/CartPage';
import { ProfilePage } from './components/ProfilePage';
import { CheckoutPage } from './components/CheckoutPage';
import { SellerProfile } from './components/SellerProfile';
import { LoginModal } from './components/LoginModal';
import { SignupModal } from './components/SignupModal';
import { Product, User } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import * as cartService from './services/cartService';

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<User | null>(null);
  const { user } = useAuth();

  // Listen for profile click from header
  React.useEffect(() => {
    const handleOpenProfile = () => {
      if (user) {
        setActiveTab('profile');
      }
    };

    const handleOpenSellerProfile = (event: CustomEvent) => {
      setSelectedSeller(event.detail);
    };

    const handleStartSellerConversation = (event: CustomEvent) => {
      const seller = event.detail;
      // Add initial message to start conversation with seller
      if (user) {
        // Use a custom event to add message through AuthContext
        window.dispatchEvent(new CustomEvent('addDirectMessage', {
          detail: {
            from_user_id: user.id,
            to_user_id: seller.id,
            message: `Olá ${seller.store_name}! Tenho interesse nos seus produtos.`,
            read: false,
            type: 'direct'
          }
        }));
      }
      setActiveTab('messages');
    };

    window.addEventListener('openProfile', handleOpenProfile);
    window.addEventListener('openSellerProfile', handleOpenSellerProfile as EventListener);
    window.addEventListener('startSellerConversation', handleStartSellerConversation as EventListener);
    
    return () => {
      window.removeEventListener('openProfile', handleOpenProfile);
      window.removeEventListener('openSellerProfile', handleOpenSellerProfile as EventListener);
      window.removeEventListener('startSellerConversation', handleStartSellerConversation as EventListener);
    };
  }, [user]);

  const handleBuyNow = (product: Product) => {
    // Adiciona ao carrinho usando localStorage
    cartService.addToCart(product, 1);
    
    // Mostra mensagem de sucesso
    alert('Produto adicionado ao carrinho!');
    
    // Navega para página do carrinho
    setActiveTab('cart');
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handleOrderComplete = () => {
    setShowCheckout(false);
    setActiveTab('home');
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (tab === 'profile' && !user) {
      setShowLoginModal(true);
    }
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  // Show checkout page
  if (showCheckout) {
    return (
      <div className="min-h-screen bg-white">
        <CheckoutPage 
          onBack={() => setShowCheckout(false)}
          onOrderComplete={handleOrderComplete}
        />
      </div>
    );
  }

  // Show seller profile
  if (selectedSeller) {
    return (
      <div className="min-h-screen bg-white">
        <SellerProfile 
          seller={selectedSeller}
          onBack={() => setSelectedSeller(null)}
          onProductClick={(product) => {
            setSelectedSeller(null);
            handleBuyNow(product);
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Header 
        onLoginClick={() => setShowLoginModal(true)}
        onCartClick={() => setActiveTab('cart')}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      <main className="pt-16 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomePage onBuyNow={handleBuyNow} />
            </motion.div>
          )}
          
          {activeTab === 'discover' && (
            <motion.div
              key="discover"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen"
            >
              <DiscoverFeed 
                onBuyNow={handleBuyNow}
                onBack={() => setActiveTab('home')}
              />
            </motion.div>
          )}
          
          {activeTab === 'cart' && (
            <motion.div
              key="cart"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen"
            >
              <CartPage 
                onBack={() => setActiveTab('home')}
                onCheckout={handleCheckout}
              />
            </motion.div>
          )}
          
          {activeTab === 'messages' && (
            <motion.div
              key="messages"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen"
            >
              <MessagesPage onBack={() => setActiveTab('home')} />
            </motion.div>
          )}
          
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="min-h-screen"
            >
              <ProfilePage onBack={() => setActiveTab('home')} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={switchToSignup}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}

export default App;