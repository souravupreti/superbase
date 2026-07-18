import Drawer from "@mui/joy/Drawer";
import ModalClose from "@mui/joy/ModalClose";
import ModalDialog from "@mui/joy/ModalDialog";
import Typography from "@mui/joy/Typography";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import ListItemDecorator from "@mui/joy/ListItemDecorator";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";

export function MobileDrawer({
  open,
  onClose,
  title = "Menu",
  header,
  footer,
  children,
}) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      anchor="left"
      size="sm"
    >
      <ModalDialog
        layout="fullscreen"
        sx={{
          width: "min(20rem,85vw)",
          p: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 2,
          }}
        >
          {header ?? (
            <Typography level="h4">
              {title}
            </Typography>
          )}

          <ModalClose />
        </Box>

        <Divider />

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
            <Box p={2}>
              {footer}
            </Box>
          </>
        )}
      </ModalDialog>
    </Drawer>
  );
}

export function MobileDrawerLink({
  icon,
  label,
  active = false,
  onClick,
}) {
  return (
    <ListItem>
      <ListItemButton
        selected={active}
        onClick={onClick}
      >
        {icon && (
          <ListItemDecorator>
            {icon}
          </ListItemDecorator>
        )}

        {label}
      </ListItemButton>
    </ListItem>
  );
}