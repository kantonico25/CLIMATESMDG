import React, { useMemo } from "react";
import { Box, Flex, Field, TextInput, Typography } from "@strapi/design-system";

const DEFAULT_THEME_COLORS = [
  "#008282",
  "#006e6e",
  "#14b8a6",
  "#0f766e",
  "#f59e0b",
  "#f87171",
  "#1f2937",
  "#ffffff"
];

const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

const normalizeHexColor = (value) => {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  return HEX_COLOR_PATTERN.test(trimmed) ? trimmed : "";
};

const toChangeEvent = (name, value) => ({
  target: {
    name,
    type: "string",
    value
  }
});

export default function ThemeColorInput(props) {
  const {
    name,
    value,
    onChange,
    disabled,
    required,
    error,
    hint,
    label,
    attribute
  } = props;

  const themeColors = useMemo(() => {
    const fromOptions = attribute?.options?.themeColors;
    if (Array.isArray(fromOptions) && fromOptions.length) {
      return fromOptions.filter((color) => typeof color === "string");
    }
    return DEFAULT_THEME_COLORS;
  }, [attribute?.options?.themeColors]);

  const normalized = normalizeHexColor(value);
  const pickerValue = normalized || "#008282";

  return (
    <Field.Root id={name} name={name} required={required} error={error} hint={hint}>
      <Field.Label>{label}</Field.Label>
      <Flex direction="column" gap={2} alignItems="stretch">
        <Flex gap={2} alignItems="center">
          <Box
            as="input"
            type="color"
            value={pickerValue}
            disabled={disabled}
            onChange={(event) => onChange(toChangeEvent(name, event.target.value))}
            style={{
              width: "48px",
              height: "40px",
              border: "1px solid var(--strapi-colors-neutral200)",
              borderRadius: "8px",
              backgroundColor: "transparent",
              padding: "4px",
              cursor: disabled ? "not-allowed" : "pointer"
            }}
          />
          <TextInput
            value={value || ""}
            placeholder="#008282"
            disabled={disabled}
            onChange={(event) => onChange(toChangeEvent(name, event.target.value))}
          />
        </Flex>
        <Flex gap={2} wrap="wrap">
          {themeColors.map((color) => {
            const isSelected = normalizeHexColor(value)?.toLowerCase() === color.toLowerCase();
            return (
              <Box key={color} position="relative">
                <Box
                  as="button"
                  type="button"
                  disabled={disabled}
                  onClick={() => onChange(toChangeEvent(name, color))}
                  aria-label={`Use ${color}`}
                  title={color}
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "999px",
                    border: isSelected
                      ? "2px solid var(--strapi-colors-primary600)"
                      : "1px solid var(--strapi-colors-neutral200)",
                    background: color,
                    cursor: disabled ? "not-allowed" : "pointer"
                  }}
                />
              </Box>
            );
          })}
        </Flex>
        <Typography variant="pi" textColor="neutral600">
          Theme presets plus custom HEX value.
        </Typography>
      </Flex>
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
}
