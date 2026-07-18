import { forwardRef } from "react";
import JoyCard from "@mui/joy/Card";
import CardContent from "@mui/joy/CardContent";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";

const variants = {
  post: {
    variant: "outlined",
    color: "neutral",
    sx: {
      borderRadius: "16px",
      bgcolor: "background.surface",
      borderColor: "neutral.outlinedBorder",
      transition: "all .2s ease",
      "&:hover": {
        boxShadow: "0 12px 30px rgba(15, 23, 42, 0.07)",
        transform: "translateY(-2px)",
      },
    },
  },

  container: {
    variant: "soft",
    color: "neutral",
    sx: {
      borderRadius: "16px",
    },
  },

  elevated: {
    variant: "outlined",
    color: "neutral",
    sx: {
      borderRadius: "16px",
      bgcolor: "background.surface",
      borderColor: "neutral.outlinedBorder",
      boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    },
  },

  flat: {
    variant: "plain",
    color: "neutral",
    sx: {
      borderRadius: "16px",
    },
  },
};

const paddings = {
  none: 0,
  sm: 2,
  md: 3,
  lg: 4,
};

export const Card = forwardRef(function Card(
  {
    variant = "post",
    padding = "md",
    className,
    children,
    sx,
    ...props
  },
  ref
) {
  const config = variants[variant];

  return (
    <JoyCard
      ref={ref}
      className={className}
      variant={config.variant}
      color={config.color}
      invertedColors={config.invertedColors}
      sx={{
        p: paddings[padding],
        ...config.sx,
        ...sx,
      }}
      {...props}
    >
      {children}
    </JoyCard>
  );
});

Card.displayName = "Card";

export function CardHeader({
  children,
  className,
  sx,
  ...props
}) {
  return (
    <CardOverflow
      className={className}
      sx={{
        px: 0,
        pb: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        ...sx,
      }}
      {...props}
    >
      {children}
    </CardOverflow>
  );
}

export function CardTitle({
  children,
  level = "h4",
  sx,
  ...props
}) {
  return (
    <Typography
      level={level}
      fontWeight="lg"
      sx={sx}
      {...props}
    >
      {children}
    </Typography>
  );
}

export function CardBody({
  children,
  sx,
  ...props
}) {
  return (
    <CardContent
      sx={{
        p: 0,
        ...sx,
      }}
      {...props}
    >
      {children}
    </CardContent>
  );
}

export function CardFooter({
  children,
  sx,
  ...props
}) {
  return (
    <>
      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          ...sx,
        }}
        {...props}
      >
        {children}
      </Box>
    </>
  );
}
