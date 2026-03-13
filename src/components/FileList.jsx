// components/FileList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFiles } from "../features/fileSlice";
import { Grid, Typography, CircularProgress, Box } from "@mui/material";
import FileCard from "./FileCard";

const EMPTY_MESSAGES = {
  trash: { icon: "🗑️", title: "Trash is clear", sub: "Deleted files will appear here" },
  starred: { icon: "⭐", title: "No starred files", sub: "Star important files to find them quickly" },
  recent: { icon: "🕐", title: "No recent files", sub: "Uploaded files will appear here" },
  all: { icon: "📂", title: "No files yet", sub: "Upload your first document to get started" },
};

export default function FileList({ view }) {
  const dispatch = useDispatch();
  const { files, loading } = useSelector((state) => state.files);

  useEffect(() => {
    dispatch(fetchFiles());
  }, [dispatch]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 14 }}>
        <Box sx={{ textAlign: "center" }}>
          <CircularProgress size={28} thickness={2} sx={{ color: "rgba(255,200,80,0.4)" }} />
          <Typography sx={{
            mt: 2, fontSize: "0.75rem",
            fontFamily: "'DM Mono', monospace",
            color: "rgba(255,255,255,0.2)", letterSpacing: 1,
          }}>
            LOADING FILES…
          </Typography>
        </Box>
      </Box>
    );
  }

  const activeFiles = files.filter((f) => !f.isTrashed);
  const trashedFiles = files.filter((f) => f.isTrashed);

  let displayed = [];
  let viewKey = view;

  if (view === "trash") {
    displayed = trashedFiles;
  } else if (view === "starred") {
    displayed = activeFiles.filter((f) => f.starred);
  } else if (view === "recent") {
    displayed = [...activeFiles].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
  } else if (view.startsWith("cat:")) {
    const cat = view.split("cat:")[1];
    displayed = activeFiles.filter((f) => f.category === cat);
    viewKey = cat;
  } else {
    displayed = activeFiles;
    viewKey = "all";
  }

  if (displayed.length === 0) {
    const msg = EMPTY_MESSAGES[view] || { icon: "📂", title: `No files in "${viewKey}"`, sub: "Nothing here yet" };
    return (
      <Box sx={{
        display: "flex", flexDirection: "column", alignItems: "center",
        justifyContent: "center", py: 14, gap: 1.5,
      }}>
        <Typography sx={{ fontSize: 44 }}>{msg.icon}</Typography>
        <Typography sx={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 600, fontSize: "1.2rem", color: "rgba(255,255,255,0.5)",
        }}>
          {msg.title}
        </Typography>
        <Typography sx={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "0.8rem", color: "rgba(255,255,255,0.2)",
        }}>
          {msg.sub}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Section header */}
      <Box sx={{ display: "flex", alignItems: "baseline", gap: 2, mb: 3.5 }}>
        <Typography sx={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontWeight: 700, fontSize: "1.35rem", color: "#F5F0E8",
        }}>
          {view === "trash" ? "Trash" :
           view === "starred" ? "Starred" :
           view === "recent" ? "Recent" :
           view.startsWith("cat:") ? view.split("cat:")[1] :
           "All Files"}
        </Typography>
        <Box sx={{
          px: 1.5, py: 0.3,
          bgcolor: "rgba(255,200,80,0.08)",
          border: "1px solid rgba(255,200,80,0.15)",
          borderRadius: "8px",
        }}>
          <Typography sx={{
            fontSize: "0.65rem", fontFamily: "'DM Mono', monospace",
            color: "rgba(255,200,80,0.6)", letterSpacing: 1,
          }}>
            {displayed.length} {displayed.length === 1 ? "FILE" : "FILES"}
          </Typography>
        </Box>
      </Box>

      <Grid container spacing={2.5}>
        {displayed.map((file, i) => (
          <Grid
            item xs={12} sm={6} md={4} lg={3}
            key={file.id || i}
            sx={{
              animation: "fadeInUp 0.35s ease both",
              animationDelay: `${i * 40}ms`,
            }}
          >
            <FileCard file={file} isTrashView={view === "trash"} />
          </Grid>
        ))}
      </Grid>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Box>
  );
}