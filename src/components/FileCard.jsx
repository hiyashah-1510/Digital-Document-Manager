// components/FileCard.jsx
import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Chip,
} from "@mui/material";
import { Star, StarBorder, Download, Delete, Restore } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import {
  toggleStar,
  updateCategory,
  moveToTrash,
  restoreFromTrash,
  deletePermanently,
} from "../features/fileSlice";

const categories = [
  "Uncategorized", "Work", "Personal", "Invoices", "Photos", "Contracts", "Other",
];

const FILE_ICONS = {
  pdf: "📕",
  doc: "📝",
  docx: "📝",
  xls: "📊",
  xlsx: "📊",
  zip: "🗜️",
  mp4: "🎬",
  mp3: "🎵",
};

function getFileIcon(type = "", name = "") {
  const ext = name.split(".").pop()?.toLowerCase();
  if (FILE_ICONS[ext]) return FILE_ICONS[ext];
  if (type.includes("pdf")) return "📕";
  if (type.includes("video")) return "🎬";
  if (type.includes("audio")) return "🎵";
  return "📄";
}

export default function FileCard({ file, isTrashView = false }) {
  const dispatch = useDispatch();

  if (!file || typeof file !== "object" || !file.id) {
    return (
      <Card sx={cardSx}>
        <CardContent>
          <Typography color="error">Invalid file data</Typography>
        </CardContent>
      </Card>
    );
  }

  const isImage = file.type?.toLowerCase().startsWith("image/");

  const handleDownload = () => {
    if (!file.data) return;
    const link = document.createElement("a");
    link.href = file.data;
    link.download = file.name || "download";
    link.click();
  };

  const ext = (file.name?.split(".").pop() || "FILE").toUpperCase();
  const sizeMB = (file.size / 1024 / 1024).toFixed(2);
  const dateStr = file.uploadDate ? new Date(file.uploadDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—";

  return (
    <Box sx={wrapperSx} className="file-card-wrapper">
      {/* Glow effect on hover */}
      <Box sx={glowSx} className="card-glow" />

      <Box sx={cardSx}>
        {/* Preview area */}
        <Box sx={previewSx}>
          {isImage ? (
            <img
              src={file.data || ""}
              alt={file.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              onError={(e) => { e.target.style.display = "none"; }}
            />
          ) : (
            <Box sx={iconWrapSx}>
              <Typography sx={{ fontSize: 40, lineHeight: 1 }}>
                {getFileIcon(file.type, file.name)}
              </Typography>
              <Typography sx={{
                mt: 1, fontSize: 10, fontWeight: 700, letterSpacing: 2,
                color: "rgba(255,220,130,0.6)", fontFamily: "'DM Mono', monospace"
              }}>
                {ext}
              </Typography>
            </Box>
          )}

          {/* Star badge */}
          {!isTrashView && (
            <IconButton
              size="small"
              onClick={() => dispatch(toggleStar({ id: file.id, currentStarred: file.starred }))}
              sx={{
                position: "absolute", top: 10, right: 10,
                bgcolor: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: file.starred ? "#FFCA28" : "rgba(255,255,255,0.4)",
                transition: "all 0.2s",
                "&:hover": { bgcolor: "rgba(255,202,40,0.15)", color: "#FFCA28", transform: "scale(1.1)" },
                width: 32, height: 32,
              }}
            >
              {file.starred ? <Star sx={{ fontSize: 16 }} /> : <StarBorder sx={{ fontSize: 16 }} />}
            </IconButton>
          )}
        </Box>

        {/* Content */}
        <Box sx={{ p: "18px 20px 14px" }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700, fontSize: "0.95rem",
            color: "#F5F0E8", lineHeight: 1.3,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            mb: 0.75,
          }} title={file.name}>
            {file.name || "Unnamed"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <Typography sx={{
              fontSize: "0.7rem", color: "rgba(255,220,130,0.7)",
              fontFamily: "'DM Mono', monospace", letterSpacing: 1,
            }}>
              {sizeMB} MB
            </Typography>
            <Box sx={{ width: 3, height: 3, borderRadius: "50%", bgcolor: "rgba(255,255,255,0.2)" }} />
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 }}>
              {dateStr}
            </Typography>
          </Box>

          {/* Category selector */}
          {!isTrashView && (
            <FormControl fullWidth size="small" sx={{ mb: 1.5 }}>
              <Select
                value={file.category || "Uncategorized"}
                onChange={(e) => dispatch(updateCategory({ id: file.id, category: e.target.value }))}
                displayEmpty
                sx={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  bgcolor: "rgba(255,255,255,0.04)",
                  borderRadius: 1.5,
                  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.1)" },
                  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,220,130,0.4)" },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,220,130,0.6)" },
                  "& .MuiSvgIcon-root": { color: "rgba(255,255,255,0.3)" },
                }}
              >
                {categories.map((c) => (
                  <MenuItem key={c} value={c} sx={{ fontSize: "0.8rem", fontFamily: "'DM Sans', sans-serif" }}>
                    {c}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Actions */}
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              onClick={handleDownload}
              startIcon={<Download sx={{ fontSize: "14px !important" }} />}
              fullWidth
              sx={downloadBtnSx}
            >
              Download
            </Button>

            {isTrashView ? (
              <>
                <IconButton
                  onClick={() => dispatch(restoreFromTrash(file.id))}
                  sx={actionIconSx("#4CAF50")}
                  size="small"
                >
                  <Restore sx={{ fontSize: 16 }} />
                </IconButton>
                <IconButton
                  onClick={() => dispatch(deletePermanently(file.id))}
                  sx={actionIconSx("#EF5350")}
                  size="small"
                >
                  <Delete sx={{ fontSize: 16 }} />
                </IconButton>
              </>
            ) : (
              <IconButton
                onClick={() => dispatch(moveToTrash(file.id))}
                sx={actionIconSx("#EF5350")}
                size="small"
              >
                <Delete sx={{ fontSize: 16 }} />
              </IconButton>
            )}
          </Box>
        </Box>
      </Box>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
        .file-card-wrapper:hover .card-glow { opacity: 1 !important; }
        .file-card-wrapper:hover > div:last-child { transform: translateY(-4px) !important; border-color: rgba(255,220,130,0.2) !important; }
      `}</style>
    </Box>
  );
}

const wrapperSx = {
  position: "relative",
  height: "100%",
};

const glowSx = {
  position: "absolute", inset: 0, zIndex: 0,
  borderRadius: "18px",
  background: "radial-gradient(ellipse at 50% 0%, rgba(255,200,80,0.12) 0%, transparent 70%)",
  opacity: 0, transition: "opacity 0.4s ease", pointerEvents: "none",
};

const cardSx = {
  position: "relative", zIndex: 1,
  height: "100%",
  borderRadius: "18px",
  overflow: "hidden",
  bgcolor: "rgba(28,24,20,0.85)",
  backdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 4px 24px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
  transition: "transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s ease",
  display: "flex", flexDirection: "column",
};

const previewSx = {
  position: "relative",
  height: 150,
  bgcolor: "rgba(255,255,255,0.03)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  overflow: "hidden",
};

const iconWrapSx = {
  height: "100%",
  display: "flex", flexDirection: "column",
  alignItems: "center", justifyContent: "center",
  background: "radial-gradient(ellipse at 50% 40%, rgba(255,200,80,0.06) 0%, transparent 65%)",
};

const downloadBtnSx = {
  fontFamily: "'DM Sans', sans-serif",
  fontSize: "0.75rem", fontWeight: 500,
  textTransform: "none",
  color: "rgba(255,220,130,0.8)",
  border: "1px solid rgba(255,220,130,0.2)",
  borderRadius: "10px",
  py: 0.75,
  bgcolor: "rgba(255,200,80,0.05)",
  "&:hover": {
    bgcolor: "rgba(255,200,80,0.12)",
    border: "1px solid rgba(255,220,130,0.4)",
    color: "#FFCA28",
  },
  transition: "all 0.2s",
};

const actionIconSx = (color) => ({
  bgcolor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "10px",
  width: 36, height: 36,
  color: `${color}99`,
  transition: "all 0.2s",
  "&:hover": { bgcolor: `${color}22`, border: `1px solid ${color}66`, color: color },
});