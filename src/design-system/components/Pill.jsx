import Chip from "@mui/joy/Chip";
import Avatar from "@mui/joy/Avatar";
import Typography from "@mui/joy/Typography";

const variants = {
  default: {
    variant: "soft",
    color: "neutral",
  },
  outline: {
    variant: "outlined",
    color: "neutral",
  },
  brand: {
    variant: "soft",
    color: "primary",
  },
  nsfw: {
    variant: "solid",
    color: "danger",
  },
  spoiler: {
    variant: "soft",
    color: "warning",
  },
  success: {
    variant: "soft",
    color: "success",
  },
  tag: {
    variant: "soft",
    color: "neutral",
  },
};

const sizes = {
  sm: "sm",
  md: "md",
};

export function Pill({
  variant = "default",
  size = "md",
  children,
  sx,
  ...props
}) {
  const config = variants[variant];

  return (
    <Chip
      variant={config.variant}
      color={config.color}
      size={sizes[size]}
      sx={{
        borderRadius: "999px",
        fontWeight: 600,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Chip>
  );
}

export function CommunityBadge({
  name,
  icon,
  onClick,
  sx,
  ...props
}) {
  return (
    <Chip
      variant="plain"
      color="primary"
      onClick={onClick}
      startDecorator={
        icon ? (
          <Avatar
            size="sm"
            src={typeof icon === "string" ? icon : undefined}
          >
            {typeof icon !== "string" ? icon : null}
          </Avatar>
        ) : null
      }
      sx={{
        fontWeight: 600,
        cursor: onClick ? "pointer" : "default",
        "&:hover": {
          bgcolor: onClick ? "primary.softBg" : "transparent",
        },
        ...sx,
      }}
      {...props}
    >
      r/{name}
    </Chip>
  );
}

export function Tag({
  label,
  sx,
  ...props
}) {
  return (
    <Pill
      variant="tag"
      sx={{
        cursor: "default",
        ...sx,
      }}
      {...props}
    >
      #{label}
    </Pill>
  );
}