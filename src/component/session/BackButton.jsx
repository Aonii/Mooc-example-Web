import { Button } from "@mui/material";
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';

const BackButton = ({ backToCourseInstance }) => {
  return (
    <Button
      variant="contained"
      size="large"
      startIcon={<ArrowBackOutlinedIcon />}
      onClick={backToCourseInstance}
    >
      Back
    </Button>
  );
};

export default BackButton;
