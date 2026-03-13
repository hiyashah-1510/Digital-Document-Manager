// components/Sidebar.jsx
import {
  Drawer, List, ListItem, ListItemButton,
  ListItemIcon, ListItemText, Divider,
  Typography, Box, Avatar,
} from "@mui/material";
import {
  Folder as FolderIcon,
  Star as StarIcon,
  Schedule as RecentIcon,
  Delete as TrashIcon,
  GridView as AllIcon,
} from "@mui/icons-material";

const categories = [
  { name: "Uncategorized", emoji: "📂" },
  { name: "Work", emoji: "💼" },
  { name: "Personal", emoji: "🏠" },
  { name: "Invoices", emoji: "🧾" },
  { name: "Photos", emoji: "🖼️" },
  { name: "Contracts", emoji: "📋" },
  { name: "Other", emoji: "📦" },
];

const NAV_ITEMS = [
  { id: "all", label: "All Files", Icon: AllIcon },
  { id: "starred", label: "Starred", Icon: StarIcon },
  { id: "recent", label: "Recent", Icon: RecentIcon },
  { id: "trash", label: "Trash", Icon: TrashIcon },
];

export default function Sidebar({ currentView, setCurrentView, files }) {
  const activeFiles = files.filter((f) => !f.isTrashed);

  const counts = {
    all: activeFiles.length,
    starred: activeFiles.filter((f) => f.starred).length,
    recent: activeFiles.length,
    trash: files.filter((f) => f.isTrashed).length,
  };

  const catCounts = {};
  categories.forEach(({ name }) => {
    catCounts[name] = activeFiles.filter((f) => f.category === name).length;
  });

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          bgcolor: "transparent",
          backgroundImage: "none",
          borderRight: "none",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={sidebarContainerSx}>
        {/* Decorative top gradient */}
        <Box sx={{
          position: "absolute", top: 0, left: 0, right: 0, height: 200,
          background: "radial-gradient(ellipse at 30% 0%, rgba(255,200,80,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        {/* Logo / Header */}
        <Box sx={{ px: 3, pt: 3.5, pb: 3, position: "relative" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box sx={logoIconSx}>
              <Typography sx={{ fontSize: 18 }}>📁</Typography>
            </Box>
            <Box>
              <Typography sx={logoTextSx}>DocVault</Typography>
              <Typography sx={{ fontSize: "0.62rem", color: "rgba(255,200,80,0.5)", letterSpacing: 2, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
                File Manager
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2 }} />

        {/* Main nav */}
        <Box sx={{ px: 1.5, pt: 2 }}>
          <Typography sx={sectionLabelSx}>NAVIGATE</Typography>
          <List disablePadding>
            {NAV_ITEMS.map(({ id, label, Icon }) => {
              const isActive = currentView === id;
              const count = counts[id];
              return (
                <ListItem key={id} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => setCurrentView(id)}
                    sx={navItemSx(isActive)}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Icon sx={{ fontSize: 18, color: isActive ? "#FFCA28" : "rgba(255,255,255,0.35)", transition: "color 0.2s" }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={label}
                      primaryTypographyProps={{ sx: navLabelSx(isActive) }}
                    />
                    {count > 0 && (
                      <Box sx={badgeSx(isActive)}>
                        <Typography sx={{ fontSize: "0.65rem", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                          {count}
                        </Typography>
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Divider sx={{ borderColor: "rgba(255,255,255,0.06)", mx: 2, my: 2 }} />

        {/* Categories */}
        <Box sx={{ px: 1.5, flexGrow: 1, overflowY: "auto", "&::-webkit-scrollbar": { display: "none" } }}>
          <Typography sx={sectionLabelSx}>CATEGORIES</Typography>
          <List disablePadding>
            {categories.map(({ name, emoji }) => {
              const isActive = currentView === `cat:${name}`;
              const count = catCounts[name] || 0;
              return (
                <ListItem key={name} disablePadding sx={{ mb: 0.5 }}>
                  <ListItemButton
                    selected={isActive}
                    onClick={() => setCurrentView(`cat:${name}`)}
                    sx={navItemSx(isActive)}
                  >
                    <ListItemIcon sx={{ minWidth: 34 }}>
                      <Typography sx={{ fontSize: 14 }}>{emoji}</Typography>
                    </ListItemIcon>
                    <ListItemText
                      primary={name}
                      primaryTypographyProps={{ sx: navLabelSx(isActive) }}
                    />
                    {count > 0 && (
                      <Box sx={badgeSx(isActive)}>
                        <Typography sx={{ fontSize: "0.65rem", fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>
                          {count}
                        </Typography>
                      </Box>
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Footer */}
        <Box sx={{ px: 3, py: 2.5, borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <Typography sx={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.2)", fontFamily: "'DM Mono', monospace", letterSpacing: 1 }}>
            {activeFiles.length} files stored
          </Typography>
        </Box>
      </Box>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&display=swap');
      `}</style>
    </Drawer>
  );
}

const sidebarContainerSx = {
  height: "100vh",
  display: "flex", flexDirection: "column",
  position: "relative",
  bgcolor: "rgba(18,14,10,0.97)",
  borderRight: "1px solid rgba(255,255,255,0.07)",
  boxShadow: "4px 0 40px rgba(0,0,0,0.5)",
  overflow: "hidden",
};

const logoIconSx = {
  width: 40, height: 40,
  borderRadius: "12px",
  bgcolor: "rgba(255,200,80,0.1)",
  border: "1px solid rgba(255,200,80,0.2)",
  display: "flex", alignItems: "center", justifyContent: "center",
  boxShadow: "0 0 20px rgba(255,200,80,0.1)",
};

const logoTextSx = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontWeight: 700, fontSize: "1.2rem",
  color: "#F5F0E8", lineHeight: 1.1, letterSpacing: 0.5,
};

const sectionLabelSx = {
  fontSize: "0.6rem", letterSpacing: 2.5,
  color: "rgba(255,255,255,0.2)",
  fontFamily: "'DM Mono', monospace",
  px: 1.5, mb: 1, display: "block",
};

const navItemSx = (isActive) => ({
  borderRadius: "12px",
  px: 1.5, py: 0.9,
  bgcolor: isActive ? "rgba(255,200,80,0.08)" : "transparent",
  border: isActive ? "1px solid rgba(255,200,80,0.15)" : "1px solid transparent",
  transition: "all 0.2s cubic-bezier(0.4,0,0.2,1)",
  "&:hover": {
    bgcolor: isActive ? "rgba(255,200,80,0.1)" : "rgba(255,255,255,0.04)",
    border: isActive ? "1px solid rgba(255,200,80,0.2)" : "1px solid rgba(255,255,255,0.06)",
  },
  "&.Mui-selected": { bgcolor: "rgba(255,200,80,0.08)" },
  "&.Mui-selected:hover": { bgcolor: "rgba(255,200,80,0.1)" },
});

const navLabelSx = (isActive) => ({
  fontSize: "0.82rem",
  fontWeight: isActive ? 500 : 400,
  color: isActive ? "#F5E6B8" : "rgba(255,255,255,0.45)",
  fontFamily: "'DM Sans', sans-serif",
  letterSpacing: 0.2,
  transition: "color 0.2s",
});

const badgeSx = (isActive) => ({
  px: 1, py: 0.25,
  borderRadius: "8px",
  bgcolor: isActive ? "rgba(255,200,80,0.15)" : "rgba(255,255,255,0.06)",
  border: `1px solid ${isActive ? "rgba(255,200,80,0.25)" : "rgba(255,255,255,0.08)"}`,
  color: isActive ? "#FFCA28" : "rgba(255,255,255,0.3)",
  minWidth: 24, display: "flex", alignItems: "center", justifyContent: "center",
});