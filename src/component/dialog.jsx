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
  const [phone, setPhone] = useState(initialData?.phone || ""); // إضافة رقم الهاتف
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrls, setImageUrls] = useState(initialData?.image_urls || []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPhone(initialData.phone || ""); // تحميل رقم الهاتف إذا كان موجودًا
      setImageUrls(initialData.image_urls || []);
    }
  }, [initialData]);

  const handleImageUpload = async (files) => {
    try {
      const uploadedUrls = [];
      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;

        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, file);

        if (error) {
          alert(`Image upload failed: ${error.message}`);
          continue;
        }

        const { data: publicData } = supabase.storage.from("images").getPublicUrl(fileName);
        uploadedUrls.push(publicData.publicUrl);
      }
      return uploadedUrls;
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
      return [];
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let newImageUrls = [...imageUrls];

      if (imageFiles.length > 0) {
        const uploadedUrls = await handleImageUpload(imageFiles);
        newImageUrls = [...newImageUrls, ...uploadedUrls];
      }

      const updatedItem = { 
        name, 
        phone, // إضافة رقم الهاتف إلى البيانات المرسلة
        image_urls: newImageUrls.filter(url => url) 
      };

      if (mode === "add") {
        await supabase.from("menu").insert([updatedItem]);
      } else {
        await onSave(updatedItem);
      }

      setName("");
      setPhone(""); // تصفير الحقل بعد الإرسال
      setImageFiles([]);
      setImageUrls([]);
      onClose();
    } catch (error) {
      alert(`Unexpected error: ${error.message}`);
    } finally {
      setLoading(false);
    }
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

          <TextField
            fullWidth
            placeholder="Phone Number"
            variant="filled"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="xdialog-input phone-input"
            required
          />

          <input
            accept="image/*"
            type="file"
            onChange={(e) => setImageFiles([...imageFiles, ...e.target.files])}
            id="xdialog-upload"
            className="xdialog-hidden-input hide"
            multiple
          />

          <label htmlFor="xdialog-upload" className="xdialog-upload-label">
            <Button 
              variant="outlined" 
              component="span"
              fullWidth
              className="xdialog-upload-btn"
            >
              <CloudUploadIcon className="xdialog-upload-icon" />
              Choose Menu Images
            </Button>
          </label>

          <div className="image-preview-container">
            {imageUrls.map((url, index) => (
              <div key={`url-${index}`} className="image-preview-item">
                <img 
                  src={url}
                  alt={`Preview ${index}`}
                  className="xdialog-preview-image"
                />
                <button 
                  className="remove-image-btn"
                  onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== index))}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}

            {imageFiles.map((file, index) => (
              <div key={`file-${index}`} className="image-preview-item">
                <img 
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  className="xdialog-preview-image"
                />
                <button 
                  className="remove-image-btn"
                  onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== index))}
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            ))}
          </div>

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