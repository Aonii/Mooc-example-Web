import { Button } from "@mui/material";
import UploadFileIcon from '@mui/icons-material/UploadFile';

const UploadMediaButton = ({ uploadMedia }) => {
  return (
    <Button
      variant="outlined"
      size="large"
      startIcon={<UploadFileIcon />}
      onClick={uploadMedia}
      sx={{ width: "700px" }}
    >
      Upload Media File
    </Button>
  );
};

export default UploadMediaButton;
