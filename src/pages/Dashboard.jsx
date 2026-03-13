// pages/Dashboard.jsx
import { useState } from "react";
import { Box } from "@mui/material";
import Sidebar from "../components/Sidebar";
import UploadFile from "../components/UploadFile";
import FileList from "../components/FileList";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const [currentView, setCurrentView] = useState("all");
  const files = useSelector((state) => state.files.files);

  return (
    <Box sx={{
      display: "flex",
      minHeight: "100vh",
      bgcolor: "#0F0C09",
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {/* Ambient background effects */}
      <Box sx={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        background: `
          radial-gradient(ellipse 60% 40% at 70% 20%, rgba(255,180,50,0.04) 0%, transparent 60%),
          radial-gradient(ellipse 50% 50% at 20% 80%, rgba(100,80,200,0.03) 0%, transparent 60%)
        `,
      }} />

      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        files={files}
      />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          position: "relative",
          zIndex: 1,
          px: { xs: 3, md: 5 },
          pt: 4,
          pb: 6,
          overflowY: "auto",
          minHeight: "100vh",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-track": { bgcolor: "transparent" },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "rgba(255,255,255,0.08)",
            borderRadius: 3,
          },
        }}
      >
        <UploadFile />
        <FileList view={currentView} />
      </Box>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0F0C09; }
      `}</style>
    </Box>
  );
}