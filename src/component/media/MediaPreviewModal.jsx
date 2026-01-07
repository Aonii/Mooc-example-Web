import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function MediaPreviewDialog({ open, onClose, fileType, filePath, fileName }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {fileName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        {fileType === "video" ? (
          <video
            src={filePath}
            controls
            style={{ width: "100%", maxHeight: 500 }}
          />
        ) : fileType === "pdf" ? (
          <iframe
            src={filePath}
            title={fileName}
            style={{ width: "100%", height: 500, border: "none" }}
          />
        ) : (
          <div>Unsupported file type</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
