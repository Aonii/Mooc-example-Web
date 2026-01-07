import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
  Typography,
  Button,
  Box,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import getRequest from "../../request/getRequest";
import deleteRequest from "../../request/delRequest";
import putRequest from "../../request/putRequest";
import UploadMediaButton from "../media/UploadMediaButton";
import MediaFileItem from "../media/MediaFileItem";
import DeleteMediaModal from "../media/DeleteMediaModal";
import UpdateMediaModal from "../media/UpdateMediaModal";

import DeleteSessionButton from "./DeleteSessionButton";
import UpdateSessionButton from "./UpdateSessionButton";

const BASE_URL = process.env.REACT_APP_BASE_API_URL;

const SessionItem = ({
  session,
  media,
  onMediaUpdated,
  expanded,
  onToggle,
  onUploadMedia,
  onUpdate,
  onDelete,
}) => {
  const isSameUser = session.createdBy === session.updatedBy;
  const userLabel = isSameUser ? "Created by" : "Updated by";
  const userValue = isSameUser ? session.createdBy : session.updatedBy;
  const isSameTime = session.createdAt === session.updatedAt;
  const timeLabel = isSameTime ? "Created at" : "Updated at";
  const timeValue = isSameTime ? session.createdAt : session.updatedAt;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [mediaFileToDelete, setMediaFileToDelete] = useState(null);

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [mediaFileToUpdate, setMediaFileToUpdate] = useState(null);
  const [uploadState, setUploadState] = useState({
    fileName: "",
    fileType: "",
    file: null,
    fileUrl: "",
    thumbnail: null,
    thumbnailUrl: "",
  });

  const { id: courseId, instanceId: courseInstanceId, sessionId } = useParams();
  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?.id;

  // Delete media file
  const handleOpenDeleteModal = (mediaFile) => {
    setMediaFileToDelete(mediaFile);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    console.log("delete!!");
    if (!mediaFileToDelete?.id) return;

    const res = await deleteRequest(
      `/media/${mediaFileToDelete.id}`,
      null,
      setLoading
    );
    if (res.status === 1) {
      onMediaUpdated?.(session.id);
      setDeleteModalOpen(false);
      toast.success("Media file deleted successfully!");
    } else {
      toast.error(
        `Failed to delete media file: ${res.message || "Unknown error"}`
      );
    }
    setDeleteModalOpen(false);
    setMediaFileToDelete(null);
  };

  // Update media file
  const handleOpenUpdateModal = async (mediaFile) => {
    setUploadState({
      fileName: mediaFile.fileName,
      fileType: mediaFile.fileType,
      file: null,
      fileUrl: `${BASE_URL}/${mediaFile.filePath}`,
      thumbnail: null,
      thumbnailUrl: mediaFile.thumbnailPath
        ? `${BASE_URL}/${mediaFile.thumbnailPath}`
        : null,
    });
    setUpdateModalOpen(true);
    setMediaFileToUpdate(mediaFile);
  };

  function extractUploadsPath(fullPath) {
    if (!fullPath) return null;
    const idx = fullPath.indexOf("/uploads");
    return idx !== -1 ? fullPath.slice(idx) : null;
  }

  const handleUpdateSubmit = async (data) => {
    const formData = new FormData();
    console.log("11111", data);
    if (data.file) formData.append("file", data.file);
    if (data.thumbnail) formData.append("thumbnail", data.thumbnail);

    let updatedFilePath = data.fileUrl;
    let updatedThumbnailPath = data.thumbnailUrl;

    if (data.file || data.thumbnail) {
      try {
        const uploadResult = await fetch(
          `${process.env.REACT_APP_BASE_API_URL}/api/uploadMedia`,
          {
            method: "POST",
            body: formData,
            credentials: "include", // 无论同域还是跨域请求，都要带上 cookie
          }
        );

        const result = await uploadResult.json();

        if (uploadResult.ok && result.status === 1) {
          const { filePath, thumbnailPath } = result.data;
          updatedFilePath = extractUploadsPath(filePath);
          updatedThumbnailPath = extractUploadsPath(thumbnailPath);

          const payload = {
            id: Number(mediaFileToUpdate.id),
            sessionId,
            fileName: data.fileName,
            fileType: data.fileType,
            filePath: updatedFilePath,
            thumbnailPath: updatedThumbnailPath,
            approvalStatus: "approved",
            uploaderId: userId,
          };

          const saveResult = await putRequest(
            `/media/${mediaFileToUpdate.id}`,
            payload,
            setLoading
          );
          console.log("saveResult", saveResult);
          if (saveResult.status === 1) {
            setUpdateModalOpen(false);
            onMediaUpdated?.(session.id);
            toast.success("Media updated successfully!");
          } else {
            toast.error("Failed to update media.");
          }
        }
      } catch (err) {
        toast.error("Request error:", err);
      }
    }
  };

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Accordion
          sx={{ maxWidth: 1200, width: "100%" }}
          expanded={expanded}
          onChange={onToggle}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel-content"
            id="panel-header"
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                }}
              >
                {session.sessionTitle}
              </Typography>
              <Typography
                sx={
                  !expanded
                    ? {
                        mt: 1,
                        mb: 1,
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 1,
                        color:
                          session.sessionDescription === "No description..."
                            ? "grey.400"
                            : "grey.600",
                      }
                    : {
                        mt: 1,
                        mb: 1,
                        whiteSpace: "normal",
                        color:
                          session.sessionDescription === "No description..."
                            ? "grey.400"
                            : "grey.600",
                      }
                }
              >
                {session.sessionDescription}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {userLabel}: {userValue}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {timeLabel}: {new Date(timeValue).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </AccordionSummary>

          <AccordionDetails>
            <Divider
              sx={{
                borderColor: "gray",
                borderBottomWidth: 1,
                margin: "auto",
                marginBottom: "10px",
                width: "95%",
              }}
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 140,
              }}
            >
              {media.length > 0 ? (
                media.map((mediaFile) => (
                  <MediaFileItem
                    key={mediaFile.id}
                    mediaFile={mediaFile}
                    onDelete={() => handleOpenDeleteModal(mediaFile)}
                    onUpdate={() => handleOpenUpdateModal(mediaFile)}
                  />
                ))
              ) : (
                <Typography color="text.secondary" sx={{ mt: 2 }}>
                  No media file, please upload.
                </Typography>
              )}
            </Box>
          </AccordionDetails>

          <AccordionActions sx={{ justifyContent: "center" }}>
            <UploadMediaButton
              sx={{ width: "70%" }}
              uploadMedia={() => onUploadMedia(session)}
            />
            <UpdateSessionButton updateSession={() => onUpdate(session)} />
            <DeleteSessionButton deleteSession={() => onDelete(session)} />
          </AccordionActions>
        </Accordion>
      </Box>

      <DeleteMediaModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        fileName={mediaFileToDelete?.fileName}
        fileType={mediaFileToDelete?.fileType}
      />

      <UpdateMediaModal
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        uploadState={uploadState}
        setUploadState={setUploadState}
        onSubmit={(data) =>
          handleUpdateSubmit({ ...data, id: mediaFileToUpdate?.id })
        }
      />
    </div>
  );
};

export default SessionItem;
