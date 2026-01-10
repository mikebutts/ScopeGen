"use client";

import { MantineProvider, createTheme } from "@mantine/core";
import { MantineNextProvider } from "@mantine/next";
import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "teal",
  fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial",
  defaultRadius: "md",
});

export function MantineRegistry({ children }: { children: React.ReactNode }) {
  return (
    <MantineNextProvider>
      <MantineProvider theme={theme} defaultColorScheme="light">
        {children}
      </MantineProvider>
    </MantineNextProvider>
  );
}
