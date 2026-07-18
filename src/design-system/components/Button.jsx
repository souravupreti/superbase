import { forwardRef } from "react";
import JoyButton from "@mui/joy/Button";
import CircularProgress from "@mui/joy/CircularProgress";

export const Button = forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      fullWidth = false,

      startIcon,
      endIcon,

      type = "button",

      sx,

      ...props
    },
    ref
  ) => {
    const joyVariant = {
      primary: "solid",
      secondary: "soft",
      ghost: "plain",
      destructive: "solid",
      icon: "plain",
    }[variant];

    const joyColor = {
      primary: "primary",
      secondary: "neutral",
      ghost: "neutral",
      destructive: "danger",
      icon: "neutral",
    }[variant];

    const joySize = {
      sm: "sm",
      md: "md",
      lg: "lg",
    }[size];

    return (
      <JoyButton
        ref={ref}
        type={type}
        loading={loading}
        loadingIndicator={<CircularProgress size="sm" />}
        disabled={disabled}
        fullWidth={fullWidth}
        variant={joyVariant}
        color={joyColor}
        size={joySize}
        startDecorator={!loading ? startIcon : null}
        endDecorator={endIcon}
        sx={{
          borderRadius: "12px",
          fontWeight: 700,
          textTransform: "none",
          transition: "all .2s ease",

          "&:hover": {
            transform: "translateY(-2px)",
          },

          "&:active": {
            transform: "scale(.98)",
          },

          ...sx,
        }}
        {...props}
      >
        {children}
      </JoyButton>
    );
  }
);

Button.displayName = "Button";
