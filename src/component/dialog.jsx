import React, { useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CircularProgress from "@mui/material/CircularProgress";
import { supabase } from "../lib/supabase";
import "./dialog.css";

export default function XDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleImageUpload = async (file) => {
    try {
      alert("Uploading image...");
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

      alert(`Image uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    alert("Submitting form...");

    try {
      if (!imageFile) {
        alert("Please select an image");
        setLoading(false);
        return;
      }

      const imageUrl = await handleImageUpload(imageFile);
      if (!imageUrl) {
        alert("Failed to upload image. Stopping form submission.");
        setLoading(false);
        return;
      }

      alert(`Inserting into database: Name = ${name}, Image URL = ${imageUrl}`);

      const { error } = await supabase
        .from("menu")
        .insert([{ name, image_url: imageUrl }]);

      if (error) {
        alert(`Database insertion failed: ${error.message}`);
        setLoading(false);
        return;
      }

      alert("Menu added successfully!");
      setName("");
      setImageFile(null);
      handleClose();
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="xdialog-container">
      <Button
        className="xdialog-floating-btn"
        variant="contained"
        onClick={handleClickOpen}
      >
        <AddIcon className="xdialog-plus-icon" />
      </Button>

      <Dialog open={open} onClose={handleClose} className="xdialog-main">
        <DialogTitle className="xdialog-header">
          <span className="xdialog-title">Add New Menu</span>
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
              required
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

            {imageFile && (
              <div className="xdialog-preview">
                <img 
                  src={URL.createObjectURL(imageFile)} 
                  alt="Preview" 
                  className="xdialog-preview-image"
                />
              </div>
            )}

            <DialogActions className="xdialog-actions">
              <Button onClick={handleClose} className="xdialog-cancel-btn">
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
                  'Save Changes'
                )}
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}