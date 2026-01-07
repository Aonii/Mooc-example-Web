import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import DeleteForeverOutlinedIcon from "@mui/icons-material/DeleteForeverOutlined";

import { MediaPreviewDialog } from "./MediaPreviewModal";

const typeBgColor = {
  video: "#f5f4ff",
  pdf: "#eefffe",
};

const approvalStatusIcon = {
  Approved: <CheckCircleIcon sx={{ color: "green" }} />,
  Pending: <HourglassEmptyIcon sx={{ color: "orange" }} />,
  Rejected: <ErrorIcon sx={{ color: "red" }} />,
};

const MediaFileItem = ({ mediaFile, onDelete, onUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const isSameTime = mediaFile.createdAt === mediaFile.updatedAt;
  const timeLabel = isSameTime ? "Created at" : "Updated at";
  const timeValue = isSameTime ? mediaFile.createdAt : mediaFile.updatedAt;

  const [previewOpen, setPreviewOpen] = useState(false);
  const fileUrl = `http://localhost:9000${mediaFile.filePath}`;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        background: typeBgColor[mediaFile.fileType] || "#f5f5f5",
        borderRadius: 2,
        boxShadow: 1,
        p: 2,
        mb: 1,
        height: 70,
        width: "100%",
        maxWidth: 1000,
      }}
    >
      <Avatar
        variant="rounded"
        src={`http://localhost:9000${mediaFile.thumbnailPath}` || undefined}
        sx={{
          width: 50,
          height: 50,
          bgcolor: "#fff",
          border: "1px solid #eee",
          mr: 2,
        }}
      >
        {!mediaFile.thumbnailPath && (
          <HelpOutlineIcon sx={{ color: "#bbb", fontSize: 32 }} />
        )}
      </Avatar>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            cursor: "pointer",
            textDecoration: "underline",
            color: "primary.main",
          }}
          onClick={() => setPreviewOpen(true)}
        >
          {mediaFile.fileName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {`Uploader: ${mediaFile.uploaderId}  |  ${timeLabel}: ${new Date(timeValue).toLocaleString()}`}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
        <Tooltip title={mediaFile.approvalStatus}>
          <span>
            {approvalStatusIcon[mediaFile.approvalStatus] || (
              <HourglassEmptyIcon sx={{ color: "grey.400" }} />
            )}
          </span>
        </Tooltip>

        <IconButton sx={{ ml: 1 }} onClick={handleMenuOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right", // 菜单锚点在按钮右侧
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left", // 菜单左上角对齐锚点右上角
          }}
        >
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onUpdate && onUpdate(mediaFile);
            }}
          >
            <CreateOutlinedIcon />
          </MenuItem>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              onDelete && onDelete(mediaFile);
            }}
          >
            <DeleteForeverOutlinedIcon sx={{ color: "red" }} />
          </MenuItem>
        </Menu>
      </Box>

      <MediaPreviewDialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        fileType={mediaFile.fileType}
        filePath={fileUrl}
        fileName={mediaFile.fileName}
      />
    </Box>
  );
};

export default MediaFileItem;
