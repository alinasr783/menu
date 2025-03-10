import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Skeleton from '@mui/material/Skeleton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import XDialog from './dialog';
import './cards.css';

const MenuCards = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const { data, error } = await supabase
          .from('menu')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        setMenuItems(data);
      } catch (err) {
        alert("Fetch error: " + err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return;

    try {
      const { error } = await supabase
        .from('menu')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setMenuItems(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert("Delete error: " + err.message);
    }
  };

  const handleEdit = (item) => {
    setSelectedItem(item);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setDialogMode("add");
    setDialogOpen(true);
  };

  const handleUpdate = async (updatedItem) => {
    try {
      const { error } = await supabase
        .from('menu')
        .update(updatedItem)
        .eq('id', selectedItem.id);

      if (error) throw error;

      setMenuItems(prev => 
        prev.map(item => item.id === selectedItem.id ? {...item, ...updatedItem} : item)
      );
      setDialogOpen(false);
    } catch (err) {
      alert("Update error: " + err.message);
    }
  };

  const handleViewMenu = (id) => {
    navigate(`/menu/${id}`);
  };

  if (error) return <div className="menu-error">Error: {error}</div>;

  return (
    <>
      <div className="menu-container">
        {loading ? (
          Array(4).fill(0).map((_, index) => (
            <div className="menu-skeleton" key={index}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton width="60%" height={30} style={{ marginTop: '1rem' }} />
              <Skeleton width="40%" height={25} style={{ marginTop: '0.5rem' }} />
            </div>
          ))
        ) : (
          menuItems.map((item) => (
            <div className="menu-card" key={item.id}>
              <div className="card-actions">
                <button 
                  className="action-btn edit-btn"
                  onClick={() => handleEdit(item)}
                >
                  <EditIcon fontSize="small" />
                </button>
                <button 
                  className="action-btn delete-btn"
                  onClick={() => handleDelete(item.id)}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
              <div className="card-image">
                <img src={item.image_urls[0]} alt={item.name} />
                <div className="card-gradient"></div>
              </div>
              <div className="card-content">
                <h3 className="card-title">{item.name}</h3>
                <button 
                  className="card-button"
                  onClick={() => handleViewMenu(item.id)}
                >
                  View Menu
                  <span className="button-arrow">→</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* زر الإضافة العائم */}
      <Button
        className="xdialog-floating-btn"
        variant="contained"
        onClick={handleAdd}
      >
        <AddIcon className="xdialog-plus-icon" />
      </Button>

      {/* الديالوج */}
      <XDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={dialogMode === "edit" ? handleUpdate : (newItem) => {
          setMenuItems(prev => [newItem, ...prev]);
          setDialogOpen(false);
        }}
        initialData={selectedItem}
        mode={dialogMode}
      />
    </>
  );
};

export default MenuCards;