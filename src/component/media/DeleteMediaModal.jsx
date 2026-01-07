import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Divider,
  Box
} from "@mui/material";

const DeleteMediaModal = ({ open, onClose, onConfirmDelete, fileName, fileType }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <Divider 
        sx={{
          borderColor: "gray",
          borderBottomWidth: 1,
          margin: "auto", 
          marginBottom: "10px",
          width: "95%",
        }}
      />
      <DialogContent>
        <Typography>Are you sure you want to delete media file:</Typography>
        <Typography sx={{ fontWeight: "bold", mt: 1 }}>{fileName} {fileType}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={onConfirmDelete}
          color="error"
          variant="contained"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteMediaModal;
