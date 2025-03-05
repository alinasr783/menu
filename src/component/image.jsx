import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './image.css';

const RestaurantPage = () => {
  const { restaurantName } = useParams();
  const [imageUrls, setImageUrls] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const originalName = restaurantName.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('menu')
          .select('image_urls')
          .eq('name', originalName)
          .single();

        if (error) throw error;
        if (!data) throw new Error('Restaurant not found');
        
        setImageUrls(data.image_urls);
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
      {imageUrls.map((url, index) =>(
      <>
        <img 
          src={url}
          key={index}
          alt={restaurantName} 
          className="restaurant-image"
        />
      </>
      ))}
    </div>
    </div>
  );
};

export default RestaurantPage;