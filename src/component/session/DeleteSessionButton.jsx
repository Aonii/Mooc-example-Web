import { Button } from "@mui/material";
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';

const DeleteSessionButton = ({ deleteSession }) => {
  return (
    <Button
      variant="outlined"
      size="large"
      startIcon={<DeleteForeverOutlinedIcon />}
      onClick={deleteSession}
      sx={{ 
        width: "300px", 
        color: "red", 
        borderColor: "red", 
        '&:hover': {
          backgroundColor: 'rgba(255, 0, 0, 0.04)',
          borderColor: 'red',} 
      }}
    >
      Delete Session
    </Button>
  );
};

export default DeleteSessionButton;