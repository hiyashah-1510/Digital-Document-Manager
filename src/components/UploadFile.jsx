// components/UploadFile.jsx
import { useDispatch } from "react-redux";
import { uploadFile } from "../features/fileSlice";
import { Box, Button, Typography } from "@mui/material";
import { CloudUpload as UploadIcon } from "@mui/icons-material";
import { useRef, useState } from "react";

export default function UploadFile() {
  const dispatch = useDispatch();
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);
  const [justUploaded, setJustUploaded] = useState(false);

  const processFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      dispatch(uploadFile({ name: file.name, type: file.type, size: file.size, data: reader.result }));
      setJustUploaded(true);
      setTimeout(() => setJustUploaded(false), 2000);
    };
  };

  const handleUpload = (e) => processFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    processFile(e.dataTransfer.files[0]);
  };

  return (
    <Box>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400&display=swap');
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.4; }
        }
        .upload-zone:hover { border-color: rgba(255,200,80,0.35) !important; background: rgba(255,200,80,0.04) !important; }
        .upload-zone:hover .upload-icon-wrap { transform: translateY(-2px) scale(1.05); box-shadow: 0 12px 40px rgba(255,200,80,0.2) !important; }
        .upload-icon-wrap { transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
        .upload-btn:hover { background: rgba(255,200,80,0.15) !important; border-color: rgba(255,200,80,0.5) !important; color: #FFCA28 !important; transform: translateY(-1px); }
        .upload-btn { transition: all 0.25s ease !important; }
      `}</style>

      {/* Page title row */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 5 }}>
        <Box>
          <Typography sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "2rem",
            color: "#F5F0E8", letterSpacing: -0.5, lineHeight: 1,
            mb: 0.5,
          }}>
            Your Documents
          </Typography>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.3)",
            letterSpacing: 0.3,
          }}>
            Organize, star, and manage your files
          </Typography>
        </Box>

        <Button
          className="upload-btn"
          onClick={() => inputRef.current.click()}
          startIcon={<UploadIcon sx={{ fontSize: "15px !important" }} />}
          sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "0.8rem", fontWeight: 500,
            textTransform: "none", letterSpacing: 0.3,
            color: "rgba(255,220,130,0.8)",
            border: "1px solid rgba(255,200,80,0.25)",
            borderRadius: "12px",
            px: 2.5, py: 1.1,
            bgcolor: "rgba(255,200,80,0.06)",
          }}
        >
          Upload File
        </Button>
      </Box>

      {/* Drop zone */}
      <Box
        className="upload-zone"
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current.click()}
        sx={{
          cursor: "pointer",
          mb: 5,
          borderRadius: "20px",
          border: `1.5px dashed ${dragging ? "rgba(255,200,80,0.5)" : "rgba(255,255,255,0.1)"}`,
          bgcolor: dragging ? "rgba(255,200,80,0.05)" : "rgba(255,255,255,0.015)",
          transition: "all 0.25s ease",
          py: 4, px: 3,
          display: "flex", alignItems: "center", gap: 3,
        }}
      >
        <Box className="upload-icon-wrap" sx={{
          width: 64, height: 64, borderRadius: "18px",
          bgcolor: "rgba(255,200,80,0.08)",
          border: "1px solid rgba(255,200,80,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 4px 24px rgba(255,200,80,0.08)",
        }}>
          {justUploaded
            ? <Typography sx={{ fontSize: 28 }}>✅</Typography>
            : <UploadIcon sx={{ color: "rgba(255,200,80,0.6)", fontSize: 28 }} />}
        </Box>

        <Box>
          <Typography sx={{
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 500, fontSize: "0.9rem",
            color: "rgba(255,255,255,0.7)", mb: 0.4,
          }}>
            {justUploaded ? "File uploaded!" : dragging ? "Drop it here…" : "Drop files here or click to browse"}
          </Typography>
          <Typography sx={{
            fontFamily: "'DM Mono', monospace",
            fontSize: "0.7rem",
            color: "rgba(255,255,255,0.25)", letterSpacing: 0.5,
          }}>
            Images, PDFs, documents, and more
          </Typography>
        </Box>
      </Box>

      <input type="file" hidden ref={inputRef} onChange={handleUpload} />
    </Box>
  );
}