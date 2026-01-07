import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  FormControl,
} from "@mui/material";
import { DropzoneArea } from "mui-file-dropzone";

const UpdateMediaModal = ({
  open,
  onClose,
  uploadState,
  setUploadState,
  onSubmit,
}) => {
  const { fileName, fileType, file, fileUrl, thumbnail, thumbnailUrl } =
    uploadState;

  useEffect(() => {
    if (open && uploadState) {
      // Do nothing extra here for now
    }
  }, [open]);

  const handleClose = () => {
    setUploadState({
      fileName: "",
      fileType: "",
      file: null,
      fileUrl: "",
      thumbnail: null,
      thumbnailUrl: "",
    });
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(uploadState);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Media File</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <TextField
            label="File Name"
            value={fileName}
            onChange={(e) =>
              setUploadState((prev) => ({ ...prev, fileName: e.target.value }))
            }
            fullWidth
            margin="normal"
            required
          />

          <FormControl fullWidth margin="normal" required>
            <InputLabel>File Type</InputLabel>
            <Select
              value={fileType}
              label="File Type"
              onChange={(e) =>
                setUploadState((prev) => ({
                  ...prev,
                  fileType: e.target.value,
                }))
              }
            >
              <MenuItem value="video">Video</MenuItem>
              <MenuItem value="pdf">PDF</MenuItem>
            </Select>
          </FormControl>

          <div style={{ marginTop: 16 }}>
            <DropzoneArea
              // key={`file-${open}-${uploadState.fileUrl || ""}`}
              acceptedFiles={
                fileType === "video" ? ["video/*"] : ["application/pdf"]
              }
              dropzoneText={`Drag and drop a ${fileType.toUpperCase()} file here or click`}
              filesLimit={1}
              initialFiles={uploadState.fileUrl ? [uploadState.fileUrl] : []}
              onChange={(files) => {
                const selectedFile = files[0];
                setUploadState((prev) => ({
                  ...prev,
                  file: selectedFile,
                  fileUrl: selectedFile
                    ? URL.createObjectURL(selectedFile)
                    : "",
                }));
              }}
              showPreviewsInDropzone
              showFileNames
            />
          </div>

          <div style={{ marginTop: 24 }}>
            <DropzoneArea
              // key={`thumb-${open}-${thumbnailUrl || ""}`}
              acceptedFiles={["image/*"]}
              dropzoneText="Drag and drop a THUMBNAIL IMAGE here or click"
              filesLimit={1}
              initialFiles={
                uploadState.thumbnailUrl ? [uploadState.thumbnailUrl] : []
              }
              onChange={(files) => {
                const selectedImage = files[0];
                setUploadState((prev) => ({
                  ...prev,
                  thumbnail: selectedImage,
                  thumbnailUrl: selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : "",
                }));
              }}
              showPreviewsInDropzone
              showFileNames
            />
          </div>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UpdateMediaModal;
