import React, { useState, useEffect, useRef } from 'react';
import { VideoCard } from './VideoCard';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';
import { Product } from '../types';
import { apiClient, type ProductResponse } from '../services/api';

interface VideoFeedProps {
  onBuyNow: (product: Product) => void;
}

// Function to convert ProductResponse to Product
const convertProductResponseToProduct = (productResponse: ProductResponse): Product => {
  return {
    id: productResponse.id,
    title: productResponse.title,
    description: productResponse.description,
    price: productResponse.price,
    stock: productResponse.stock,
    category: productResponse.category,
    video_url: productResponse.video_url,
    thumbnail: productResponse.thumbnail,
    likes: productResponse.likes,
    comments: productResponse.comments_count,
    posted_at: productResponse.posted_at,
    seller: productResponse.seller_name ? {
      id: productResponse.seller_id,
      name: productResponse.seller_name,
      email: '', 
      role: 'seller' as const,
      profile_image: productResponse.seller_image,
      store_name: productResponse.store_name,
    } : undefined,
  };
};

export const VideoFeed: React.FC<VideoFeedProps> = ({ onBuyNow }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showCommentsModal, setShowCommentsModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load initial products
  useEffect(() => {
    const loadProducts = async () => {
      if (loading || !hasMore) return;
      
      setLoading(true);
      try {
        const response = await apiClient.getProducts({ page, limit: 10 });
        if (response.success && response.data) {
          const newProducts = response.data.products.map(convertProductResponseToProduct);
          
          if (page === 1) {
            setProducts(newProducts);
          } else {
            setProducts(prev => [...prev, ...newProducts]);
          }
          
          if (newProducts.length < 10) {
            setHasMore(false);
          }
        } else {
          console.error('Failed to load products:', response.error || response.message);
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error loading products:', error);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [page, loading, hasMore]);

  const handleLike = (productId: string) => {
    console.log('Liked product:', productId);
  };

  const handleComment = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowCommentsModal(true);
    }
  };

  const handleShare = (productId: string) => {
    const product = products.find((p: Product) => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowShareModal(true);
    }
  };

  // Infinite scrolling logic
  useEffect(() => {
    const container = containerRef.current;
    const handleScroll = () => {
      if (!container) return;
      
      const scrollTop = container.scrollTop;
      const videoHeight = container.clientHeight;
      const newIndex = Math.round(scrollTop / videoHeight);
      setCurrentIndex(newIndex);
      
      if (newIndex >= products.length - 3 && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    };

    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [products.length, hasMore, loading]);

  if (products.length === 0 && loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Carregando vídeos...</div>
      </div>
    );
  }

  if (products.length === 0 && !loading) {
    return (
      <div className="h-screen bg-black flex items-center justify-center">
        <div className="text-white">Nenhum produto encontrado</div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={containerRef}
        className="h-screen overflow-y-scroll snap-y snap-mandatory scrollbar-hide bg-black"
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitScrollbar: { display: 'none' }
        }}
      >
        {products.map((product: Product, index: number) => (
          <div key={product.id} className="snap-start h-screen flex items-center justify-center">
            <VideoCard
              product={product}
              isActive={index === currentIndex}
              onBuyNow={onBuyNow}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
            />
          </div>
        ))}
        
        {loading && (
          <div className="snap-start h-screen flex items-center justify-center bg-black">
            <div className="text-white">Carregando mais vídeos...</div>
          </div>
        )}
      </div>
      
      {selectedProduct && (
        <>
          <CommentsModal
            isOpen={showCommentsModal}
            onClose={() => setShowCommentsModal(false)}
            product={selectedProduct}
          />
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            product={selectedProduct}
          />
        </>
      )}
    </>
  );
};
