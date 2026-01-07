import { Button } from "@mui/material";
import { Add } from "@mui/icons-material";

const AddSessionButton = ({ addSession }) => {
  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<Add />}
      onClick={addSession}
    >
      New Session
    </Button>
  );
};

export default AddSessionButton;
