import Box from "@mui/joy/Box";

const sizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

export function Icon({
  children,
  size = "md",
  sx,
  ...props
}) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: sizes[size],
        height: sizes[size],
        flexShrink: 0,

        "& svg": {
          width: "100%",
          height: "100%",
        },

        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export function UpvoteIcon({
  active = false,
  sx,
  ...props
}) {
  return (
    <Icon
      sx={{
        color: active ? "danger.500" : "text.secondary",
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 3.5L3.5 12H8v4.5h4V12h4.5L10 3.5z" />
      </svg>
    </Icon>
  );
}

export function DownvoteIcon({
  active = false,
  sx,
  ...props
}) {
  return (
    <Icon
      sx={{
        color: active ? "primary.500" : "text.secondary",
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 16.5L16.5 8H12V3.5H8V8H3.5L10 16.5z" />
      </svg>
    </Icon>
  );
}

export function NexusIcon({
  sx,
  ...props
}) {
  return (
    <Icon
      sx={{
        color: "primary.500",
        ...sx,
      }}
      {...props}
    >
      <svg viewBox="0 0 24 24" fill="none">
        <circle
          cx="12"
          cy="12"
          r="9"
          stroke="currentColor"
          strokeWidth="2"
        />

        <path
          d="M7 16L17 8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />

        <circle
          cx="7"
          cy="16"
          r="2"
          fill="currentColor"
        />

        <circle
          cx="17"
          cy="8"
          r="2"
          fill="currentColor"
        />
      </svg>
    </Icon>
  );
}

export const iconSizes = sizes;