import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

import "@fortawesome/fontawesome-free/css/all.min.css";
import './image.css';

const RestaurantPage = () => {
  const { id } = useParams();
  const [imageUrls, setImageUrls] = useState([]);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const { data, error } = await supabase
          .from('menu')
          .select('image_urls, phone, name')
          .eq('id', id)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Restaurant not found');

        setImageUrls(data.image_urls || []);
        setPhone(data.phone || '');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="p-image">
      <div className="restaurant-page">
        {imageUrls.map((url, index) => (
          <img 
            src={url}
            key={index}
            alt={`Menu item ${index + 1}`} 
            className="restaurant-image"
          />
        ))}
      </div>

      {phone && (
        <a 
          href={`https://wa.me/${phone}`} 
          className="whatsapp-button"
          target="_blank" 
          rel="noopener noreferrer"
        >
          <i className="fa-brands fa-whatsapp whatsapp-icon"></i>
        </a>
      )}
    </div>
  );
};

export default RestaurantPage;