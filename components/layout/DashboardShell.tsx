"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AppShell,
  Burger,
  Group,
  Box,
  Title,
  Text,
  NavLink,
  ScrollArea,
  Divider,
  Badge,
  ThemeIcon,
} from "@mantine/core";
import {
  IconLayoutDashboard,
  IconFileText,
  IconBriefcase,
  IconSettings,
  IconChevronRight,
} from "@tabler/icons-react";
import { SignedIn, SignedOut, UserButton, SignInButton } from "@clerk/nextjs";

type Props = {
  children: React.ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const [opened, setOpened] = useState(false);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 35%, rgba(255,255,255,1) 100%)",
      }}
    >
      <AppShell
        header={{ height: 72 }}
        navbar={{
          width: 280,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding="lg"
      >
        <AppShell.Header
          style={{
            background:
              "linear-gradient(90deg, rgba(13,148,136,0.08), rgba(6,182,212,0.06))",
            backdropFilter: "blur(10px)",
          }}
        >
          <Group h="100%" px="lg" justify="space-between">
            <Group gap="md">
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                hiddenFrom="sm"
                size="sm"
              />

              <Box>
                <Title
                  order={3}
                  style={{
                    background: "linear-gradient(90deg, #0f766e, #06b6d4)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 900,
                    letterSpacing: -0.4,
                  }}
                >
                  ScopeGen
                </Title>
                <Text size="xs" c="dimmed">
                  AI Scopes • Proposals • Hand-off docs
                </Text>
              </Box>

              <Badge
                visibleFrom="sm"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
              >
                Consulting Toolkit
              </Badge>
            </Group>

            <Group gap="sm">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    style={{
                      borderRadius: 10,
                      padding: "10px 14px",
                      border: "1px solid rgba(0,0,0,0.08)",
                      background:
                        "linear-gradient(90deg, rgba(13,148,136,0.10), rgba(6,182,212,0.10))",
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: { width: 38, height: 38 },
                    },
                  }}
                />
              </SignedIn>
            </Group>
          </Group>
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <ScrollArea h="calc(100vh - 72px)">
            <Box mb="sm">
              <Text fw={700} c="teal.9">
                Navigation
              </Text>
              <Text size="xs" c="dimmed">
                Everything matches your ScopeEditor styling
              </Text>
            </Box>

            <Divider my="sm" />

            <NavLink
              component={Link}
              href="/dashboard"
              label="Dashboard"
              leftSection={
                <ThemeIcon
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                  radius="md"
                >
                  <IconLayoutDashboard size={18} />
                </ThemeIcon>
              }
              rightSection={<IconChevronRight size={16} />}
              variant="subtle"
            />

            <NavLink
              component={Link}
              href="/intakes"
              label="Intakes"
              description="Create & manage project intake forms"
              leftSection={
                <ThemeIcon variant="light" color="teal" radius="md">
                  <IconFileText size={18} />
                </ThemeIcon>
              }
              rightSection={<IconChevronRight size={16} />}
              variant="subtle"
            />

            <NavLink
              component={Link}
              href="/projects"
              label="Projects"
              description="Generated scopes and client projects"
              leftSection={
                <ThemeIcon variant="light" color="teal" radius="md">
                  <IconBriefcase size={18} />
                </ThemeIcon>
              }
              rightSection={<IconChevronRight size={16} />}
              variant="subtle"
            />

            <Divider my="sm" />

            <NavLink
              component={Link}
              href="/settings"
              label="Settings"
              leftSection={
                <ThemeIcon variant="light" color="teal" radius="md">
                  <IconSettings size={18} />
                </ThemeIcon>
              }
              variant="subtle"
            />

            <Box mt="xl" p="md">
              <Text size="xs" c="dimmed">
                Tip: Your ScopeEditor already matches this palette: teal → cyan
                gradients + soft paper cards.
              </Text>
            </Box>
          </ScrollArea>
        </AppShell.Navbar>

        <AppShell.Main>{children}</AppShell.Main>
      </AppShell>
    </Box>
  );
}
