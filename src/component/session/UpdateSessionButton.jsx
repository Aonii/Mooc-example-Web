import { Button } from "@mui/material";
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';

const UpdateSessionButton = ({ updateSession }) => {
  return (
    <Button
      variant="outlined"
      size="large"
      startIcon={<CreateOutlinedIcon />}
      onClick={updateSession}
      sx={{ width: "300px" }}
    >
      Update Session
    </Button>
  );
};

export default UpdateSessionButton;