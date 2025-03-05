import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import CloseIcon from "@mui/icons-material/Close";
import { supabase } from "../lib/supabase";
import "./dialog.css";

export default function XDialog({ open, onClose, onSave, initialData, mode = "add" }) {
  const [name, setName] = useState(initialData?.name || "");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setImageUrl(initialData.image_url || "");
    }
  }, [initialData]);

  const handleImageUpload = async (file) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("images")
        .upload(fileName, file);

      if (error) {
        alert(`Image upload failed: ${error.message}`);
        return null;
      }

      const { data: publicData } = supabase.storage.from("images").getPublicUrl(fileName);
      const publicUrl = publicData.publicUrl;

      if (!publicUrl) {
        alert("Error retrieving image URL!");
        return null;
      }

      return publicUrl;
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newImageUrl = imageUrl;

      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (!uploadedUrl) {
          alert("Failed to upload image. Stopping form submission.");
          setLoading(false);
          return;
        }
        newImageUrl = uploadedUrl;
      }

      const updatedItem = { name, image_url: newImageUrl };

      if (mode === "add") {
        await supabase.from("menu").insert([updatedItem]);
      } else {
        await onSave(updatedItem);
      }

      setName("");
      setImageFile(null);
      setImageUrl("");
      onClose();
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImageUrl("");
  };

  return (
    <Dialog open={open} onClose={onClose} className="xdialog-main">
      <DialogTitle className="xdialog-header">
        <span className="xdialog-title">
          {mode === "edit" ? "Edit Menu" : "Add New Menu"}
        </span>
      </DialogTitle>

      <DialogContent className="xdialog-content">
        <form onSubmit={handleSubmit} className="xdialog-form">
          <TextField
            autoFocus
            fullWidth
            placeholder="Menu Name"
            variant="filled"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="xdialog-input"
            required
          />

          <input
            accept="image/*"
            type="file"
            onChange={(e) => setImageFile(e.target.files[0])}
            id="xdialog-upload"
            className="xdialog-hidden-input hide"
          />

          <label htmlFor="xdialog-upload" className="xdialog-upload-label">
            <Button 
              variant="outlined" 
              component="span"
              fullWidth
              className="xdialog-upload-btn"
            >
              <CloudUploadIcon className="xdialog-upload-icon" />
              Choose Menu Image
            </Button>
          </label>

          {(imageFile || imageUrl) && (
            <div className="image-preview-container">
              <div className="image-preview-item">
                <img 
                  src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                  alt="Preview" 
                  className="xdialog-preview-image"
                />
                <button 
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            </div>
          )}

          <DialogActions className="xdialog-actions">
            <Button onClick={onClose} className="xdialog-cancel-btn">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              className="xdialog-submit-btn"
            >
              {loading ? (
                <CircularProgress size={24} className="xdialog-spinner" />
              ) : (
                mode === "edit" ? "Update" : "Save Changes"
              )}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}