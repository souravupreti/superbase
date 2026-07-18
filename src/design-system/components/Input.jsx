import { forwardRef, useState } from "react";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input as JoyInput,
  Textarea as JoyTextarea,
  IconButton,
} from "@mui/joy";

import SearchRounded from "@mui/icons-material/SearchRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    required,
    startDecorator,
    endDecorator,
    ...props
  },
  ref
) {
  return (
    <FormControl error={!!error} required={required}>
      {label && <FormLabel>{label}</FormLabel>}

      <JoyInput
        ref={ref}
        size="lg"
        startDecorator={startDecorator}
        endDecorator={endDecorator}
        error={!!error}
        {...props}
      />

      {(helperText || error) && (
        <FormHelperText>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

export const PasswordInput = forwardRef(function PasswordInput(
  {
    label,
    error,
    helperText,
    required,
    ...props
  },
  ref
) {
  const [show, setShow] = useState(false);

  return (
    <FormControl error={!!error} required={required}>
      {label && <FormLabel>{label}</FormLabel>}

      <JoyInput
        ref={ref}
        type={show ? "text" : "password"}
        size="lg"
        error={!!error}
        endDecorator={
          <IconButton
            variant="plain"
            color="neutral"
            onClick={() => setShow((p) => !p)}
          >
            {show ? (
              <VisibilityOffRounded />
            ) : (
              <VisibilityRounded />
            )}
          </IconButton>
        }
        {...props}
      />

      {(helperText || error) && (
        <FormHelperText>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    required,
    minRows = 4,
    ...props
  },
  ref
) {
  return (
    <FormControl error={!!error} required={required}>
      {label && <FormLabel>{label}</FormLabel>}

      <JoyTextarea
        ref={ref}
        minRows={minRows}
        error={!!error}
        {...props}
      />

      {(helperText || error) && (
        <FormHelperText>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

export const SearchInput = forwardRef(function SearchInput(
  {
    label,
    error,
    helperText,
    required,
    ...props
  },
  ref
) {
  return (
    <FormControl error={!!error} required={required}>
      {label && <FormLabel>{label}</FormLabel>}

      <JoyInput
        ref={ref}
        type="search"
        size="lg"
        startDecorator={<SearchRounded />}
        error={!!error}
        {...props}
      />

      {(helperText || error) && (
        <FormHelperText>
          {error || helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
});

export function InputGroup({ children, ...props }) {
  return (
    <FormControl
      sx={{
        display: "flex",
        gap: 1,
      }}
      {...props}
    >
      {children}
    </FormControl>
  );
}

export function InputLabel(props) {
  return <FormLabel {...props} />;
}

export function InputError({ children }) {
  if (!children) return null;

  return (
    <FormHelperText error>
      {children}
    </FormHelperText>
  );
}