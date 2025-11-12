
import React from 'react';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  handleAction: (payload: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, handleAction }) => {
  const onOrderClick = () => {
    handleAction(`أريد طلب هذا المنتج: ${product.name}`);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden max-w-xs w-72 text-right">
      <img
        src={product.imageUrl}
        alt={product.name}
        className="w-full h-40 object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Image';
        }}
      />
      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{product.name}</h3>
        {product.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{product.description}</p>
        )}
        <p className="text-purple-600 dark:text-purple-400 font-semibold mt-2">{product.price}</p>
        <button
          type="button"
          onClick={onOrderClick}
          className="mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition-colors duration-300"
        >
          اطلب الآن
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
