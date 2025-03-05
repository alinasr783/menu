import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './image.css';

const RestaurantPage = () => {
  const { restaurantName } = useParams();
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const originalName = restaurantName.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('menu')
          .select('image_url')
          .eq('name', originalName)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Restaurant not found');
        
        setImageUrl(data.image_url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantName]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="p-image">
    <div className="restaurant-page">
      <img 
        src={imageUrl} 
        alt={restaurantName} 
        className="restaurant-image"
      />
    </div>
    </div>
  );
};

export default RestaurantPage;