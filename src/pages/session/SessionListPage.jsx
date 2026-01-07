import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Typography, Divider } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";

import getRequest from "../../request/getRequest";
import postRequest from "../../request/postRequest";
import deleteRequest from "../../request/delRequest";
import putRequest from "../../request/putRequest";
import BackButton from "../../components/session/BackButton";
import AddSessionButton from "../../components/session/AddSessionButton";
import AddSessionModal from "../../components/session/AddSessionModal";
import SessionItem from "../../components/session/SessionItem";
import UploadMediaModal from "../../components/media/UploadMediaModal";
import DeleteSessionModal from "../../components/session/DeleteSessionModal";
import UpdateSessionModal from "../../components/session/UpdateSessionModal";
import SubNavigation from "../../components/shared/SubNavigation";

const SessionListPage = () => {
  const [addModalOpen, setAddModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);

  const [updateModalOpen, setupdateModalOpen] = useState(false);
  const [sessionToUpdate, setSessionToUpdate] = useState(null);

  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [uploadState, setUploadState] = useState({
    fileName: "",
    fileType: "video",
    file: null,
    fileUrl: "",
    thumbnail: null,
    thumbnailUrl: "",
  });

  const { id: courseId, instanceId: courseInstanceId, sessionId } = useParams();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const auth = useSelector((state) => state.auth);
  const userId = auth?.user?.id;

  // Order
  const [orderedSessions, setOrderedSessions] = useState([]);

  // Get session list by course Instance ID
  const fetchSessions = async () => {
    const res = await getRequest(
      `/sessions/getByCourseInstanceId?courseInstanceId=${courseInstanceId}`,
      {},
      setLoading
    );

    if (res.status === 1) {
      setSessions(res.data);
      setOrderedSessions(res.data);
      if (res.data.length === 0) {
        setError("No sessions yet. Please add.");
      } else {
        setError("");
      }
    } else {
      setError(res.message || "Failed to fetch sessions.");
    }
  };

  useEffect(() => {
    if (courseInstanceId) {
      fetchSessions();
    }
  }, [courseInstanceId]);

  // Add session
  const handleAddSession = async ({ sessionTitle, sessionDescription }) => {
    if (!sessionTitle || sessionTitle.length < 3 || sessionTitle.length > 50) {
      toast.error("Session title must be between 3 and 50 characters!");
      return;
    }
    if (sessionDescription.length > 255) {
      toast.error("Session description must be less than 255 characters!");
      return;
    }

    const payload = {
      courseInstanceId: Number(courseInstanceId),
      sessionTitle,
      sessionDescription: sessionDescription?.trim() || "No description...",
      createdBy: userId,
      updatedBy: userId,
    };

    const res = await postRequest("/sessions", payload, setLoading);
    if (res.data.status === 1) {
      fetchSessions(); // refresh list
      toast.success("Session added successfully!");
    } else {
      toast.error(`Failed to add session: ${res.message || "Unknown error"}`);
    }
    console.log("Session to add:", res);
  };

  // Delete session
  const handleOpenDeleteModal = (session) => {
    setSessionToDelete(session);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete?.id) return;

    const res = await deleteRequest(
      `/sessions/${sessionToDelete.id}`,
      null,
      setLoading
    );
    if (res.status === 1) {
      fetchSessions();
      toast.success("Session deleted successfully!");
    } else {
      toast.error(
        `Failed to delete session: ${res.message || "Unknown error"}`
      );
    }

    setDeleteModalOpen(false);
    setSessionToDelete(null);
    console.log("delete: ", res);
  };

  // Update session
  const handleOpenUpdateModal = (session) => {
    setSessionToUpdate(session);
    setupdateModalOpen(true);
  };

  const handleUpdateSession = async ({ sessionTitle, sessionDescription }) => {
    if (!sessionTitle || sessionTitle.length < 3 || sessionTitle.length > 50) {
      toast.error("Session title must be between 3 and 50 characters!");
      return;
    }
    if (sessionDescription.length > 255) {
      toast.error("Session description must be less than 255 characters!");
      return;
    }

    const payload = {
      id: Number(sessionToUpdate.id),
      courseInstanceId: Number(sessionToUpdate.courseInstanceId),
      sessionTitle,
      sessionDescription: sessionDescription?.trim() || "No description...",
      updatedBy: userId,
    };

    const res = await putRequest(
      `/sessions/${sessionToUpdate.id}`,
      payload,
      setLoading
    );

    if (res.status === 1) {
      toast.success("Session updated successfully!");
      fetchSessions();
    } else {
      toast.error(
        `Failed to update session: ${res.message || "Unknown error"}`
      );
    }

    setupdateModalOpen(false);
    setSessionToUpdate(null);
  };

  // Upload Media file
  function extractUploadsPath(fullPath) {
    if (!fullPath) return null;
    const idx = fullPath.indexOf("/uploads");
    return idx !== -1 ? fullPath.slice(idx) : null;
  }

  const handleUploadSubmit = async (data) => {
    const formData = new FormData();
    formData.append("file", data.file);
    if (data.thumbnail) {
      formData.append("thumbnail", data.thumbnail);
    }

    try {
      const uploadResult = await fetch(
        `${process.env.REACT_APP_BASE_API_URL}/api/uploadMedia`,
        {
          method: "POST",
          body: formData,
          credentials: "include", // Whether it is a request within the same domain or across domains, cookies should be included
        }
      );

      const result = await uploadResult.json();

      if (uploadResult.ok && result.status === 1) {
        const { filePath, thumbnailPath } = result.data;
        const fileRelativePath = extractUploadsPath(filePath);
        const thumbnailRelativePath = extractUploadsPath(thumbnailPath);

        const payload = {
          sessionId,
          fileName: data.fileName,
          fileType: data.fileType,
          filePath: fileRelativePath,
          thumbnailPath: thumbnailRelativePath,
          approvalStatus: "approved",
          uploaderId: userId,
        };

        const saveResult = await postRequest("/media", payload, setLoading);
        if (saveResult.data.status === 1) {
          toast.success("Media uploaded and saved!");
          setUploadModalOpen(false);
          fetchSessions();
        } else {
          toast.error(
            "Failed to save media info: " +
              (saveResult.message || "Unknown error")
          );
        }
      } else {
        console.error("Uploaded failed:", result);
      }
    } catch (err) {
      console.error("Request error:", err);
    }
  };

  // Reorder
  const handleDragEnd = async (result) => {
    console.log("Reorder!!:", courseInstanceId);
    if (!result.destination) return;

    const items = Array.from(orderedSessions);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setOrderedSessions(items);

    const total = items.length;
    const newOrder = items.map((item, idx) => ({
      id: item.id,
      order: total - idx,
    }));
    console.log("newOrder:", newOrder);

    try {
      const res = await postRequest("/sessions/reorder", {
        courseInstanceId: Number(courseInstanceId),
        order: newOrder,
      });
      console.log("res:", res);
      if (res.status === 1) {
        toast.success("Sessions reordered successfully!");
        fetchSessions();
      } else {
        toast.error(res.message || "Failed to reorder sessions");
      }
    } catch (err) {
      toast.error("Network error, failed to reorder");
    }
  };

  return (
    <div>
      <Box sx={{ flexShrink: 0, marginLeft: "40px" }}>
        <SubNavigation
          head="Session List"
          navs={[
            { url: "/", title: "Dashboard" },
            { url: "/course", title: "Course" },
            { url: "", title: "Session List" },
          ]}
        />
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginRight: "40px",
          marginLeft: "40px",
          marginTop: "17px",
        }}
      >
        <BackButton
          backToCourseInstance={() => navigate(`/course/${courseId}/instance`)}
        />
        <AddSessionButton
          addSession={() => setAddModalOpen(true)}
          sx={{ width: "160px" }}
        />
      </Box>
      <Divider
        sx={{
          borderColor: "black",
          borderBottomWidth: 2,
          margin: "24px auto",
          width: "95%",
        }}
      />

      <Box
        sx={{
          height: "calc(100vh - 250px)", // Only let the session list scroll
          overflowY: "auto",
          px: 3,
          pb: 3,
          minHeight: 0,
        }}
      >
        {orderedSessions.length === 0 ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ textAlign: "center", mt: 4 }}
          >
            No sessions yet. Please add.
          </Typography>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="session-list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {orderedSessions.map((session, index) => (
                    <Draggable
                      key={session.id}
                      draggableId={String(session.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          style={{
                            ...provided.draggableProps.style,
                            marginBottom: 12,
                          }}
                        >
                          <SessionItem
                            session={session}
                            media={session.media || []}
                            onMediaUpdated={fetchSessions}
                            expanded={sessionId === String(session.id)}
                            onToggle={() => {
                              if (sessionId === String(session.id)) {
                                navigate(
                                  `/course/${courseId}/instance/${courseInstanceId}/sessionList`
                                );
                              } else {
                                navigate(
                                  `/course/${courseId}/instance/${courseInstanceId}/sessionList/session/${session.id}`
                                );
                              }
                            }}
                            onUploadMedia={() => {
                              setSelectedSession(session);
                              setUploadState({
                                fileName: "",
                                fileType: "video",
                                file: null,
                                fileUrl: "",
                                thumbnail: null,
                                thumbnailUrl: "",
                              });
                              setUploadModalOpen(true);
                            }}
                            onDelete={handleOpenDeleteModal}
                            onUpdate={handleOpenUpdateModal}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </Box>

      <AddSessionModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddSession}
      />

      <DeleteSessionModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirmDelete={handleConfirmDelete}
        sessionTitle={sessionToDelete?.sessionTitle}
      />

      <UpdateSessionModal
        open={updateModalOpen}
        onClose={() => {
          setupdateModalOpen(false);
          setSessionToUpdate(null);
        }}
        sessionData={sessionToUpdate}
        onSubmit={handleUpdateSession}
      />

      <UploadMediaModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        uploadState={uploadState}
        setUploadState={setUploadState}
        onSubmit={handleUploadSubmit}
      />
    </div>
  );
};

export default SessionListPage;
