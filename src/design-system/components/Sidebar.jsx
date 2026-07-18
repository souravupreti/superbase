import { NavLink } from "react-router-dom";

import Box from "@mui/joy/Box";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import ListItemContent from "@mui/joy/ListItemContent";
import Chip from "@mui/joy/Chip";
import Divider from "@mui/joy/Divider";
import Typography from "@mui/joy/Typography";

export function Sidebar({
  header,
  footer,
  children,
  sx,
  ...props
}) {
  return (
    <Box
      component="aside"
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: 260,
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: "64px",
        borderRight: "1px solid",
        borderColor: "divider",
        bgcolor: "background.body",
        flexShrink: 0,
        ...sx,
      }}
      {...props}
    >
      {header && (
        <>
          <Box p={2}>{header}</Box>
          <Divider />
        </>
      )}

      <List
        sx={{
          flex: 1,
          overflow: "auto",
          p: 1,
          gap: 0.5,
        }}
      >
        {children}
      </List>

      {footer && (
        <>
          <Divider />
          <Box p={2}>{footer}</Box>
        </>
      )}
    </Box>
  );
}

export function SidebarLink({
  to,
  icon,
  label,
  badge,
  end = false,
  onClick,
}) {
  const content = ({ isActive = false } = {}) => (
    <ListItem>
      <ListItemButton
        selected={isActive}
        onClick={onClick}
      >
        {icon && (
          <ListItemDecorator>
            {icon}
          </ListItemDecorator>
        )}

        <ListItemContent>
          {label}
        </ListItemContent>

        {badge > 0 && (
          <Chip
            size="sm"
            color="primary"
            variant="solid"
          >
            {badge > 99 ? "99+" : badge}
          </Chip>
        )}
      </ListItemButton>
    </ListItem>
  );

  if (!to) {
    return content();
  }

  return (
    <NavLink to={to} end={end}>
      {({ isActive }) => content({ isActive })}
    </NavLink>
  );
}

export function SidebarSection({
  title,
  children,
}) {
  return (
    <Box mt={2}>
      {title && (
        <Typography
          level="body-xs"
          textTransform="uppercase"
          fontWeight="lg"
          sx={{
            px: 2,
            mb: 1,
            color: "text.tertiary",
            letterSpacing: ".08em",
          }}
        >
          {title}
        </Typography>
      )}

      <List
        sx={{
          gap: 0.5,
        }}
      >
        {children}
      </List>
    </Box>
  );
}