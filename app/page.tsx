"use client";
import Link from "next/link";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  Badge,
  SimpleGrid,
  ThemeIcon,
  Box,
} from "@mantine/core";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

import {
  IconSparkles,
  IconFileText,
  IconTimeline,
  IconAlertTriangle,
  IconReceipt2,
} from "@tabler/icons-react";

export default function HomePage() {
  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(16,185,129,0.10) 0%, rgba(6,182,212,0.06) 35%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container size="lg" py="xl">
        {/* Top bar */}
        <Paper withBorder radius="xl" p="lg">
          <Group justify="space-between" align="center">
            <Box>
              <Title
                order={2}
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
              <Text size="sm" c="dimmed">
                Proposal-ready scopes in minutes
              </Text>
            </Box>

            <Group gap="sm">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    variant="gradient"
                    gradient={{ from: "teal", to: "cyan", deg: 60 }}
                    radius="md"
                  >
                    Sign in
                  </Button>
                </SignInButton>
              </SignedOut>

              <SignedIn>
                <Button
                  component={Link}
                  href="/dashboard"
                  variant="light"
                  color="teal"
                  radius="md"
                >
                  Go to Dashboard
                </Button>
              </SignedIn>
            </Group>
          </Group>
        </Paper>

        {/* Hero */}
        <Paper withBorder radius="xl" p="xl" mt="lg">
          <Stack gap="sm">
            <Badge
              variant="gradient"
              gradient={{ from: "teal", to: "cyan", deg: 60 }}
              w="fit-content"
            >
              Consulting toolkit
            </Badge>

            <Title order={1} style={{ fontWeight: 900, letterSpacing: -0.6 }}>
              Turn a client intake into a{" "}
              <span
                style={{
                  background: "linear-gradient(90deg, #0f766e, #06b6d4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                proposal-ready scope
              </span>
              .
            </Title>

            <Text c="dimmed" size="lg">
              Generate timeline, milestones, risks, assumptions, deliverables,
              and pricing ranges — then edit and export.
            </Text>

            <Group mt="sm" gap="sm">
              <SignedOut>
                <SignInButton mode="modal">
                  <Button
                    size="md"
                    radius="md"
                    variant="gradient"
                    gradient={{ from: "teal", to: "cyan", deg: 60 }}
                  >
                    Get started (sign in)
                  </Button>
                </SignInButton>

                <Button
                  component={Link}
                  href="/dashboard"
                  size="md"
                  radius="md"
                  variant="light"
                  color="teal"
                >
                  View demo dashboard
                </Button>
              </SignedOut>

              <SignedIn>
                <Button
                  component={Link}
                  href="/intakes/new"
                  size="md"
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  New intake
                </Button>

                <Button
                  component={Link}
                  href="/dashboard"
                  size="md"
                  radius="md"
                  variant="light"
                  color="teal"
                >
                  Open dashboard
                </Button>
              </SignedIn>
            </Group>
          </Stack>
        </Paper>

        {/* Feature grid */}
        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="lg" mt="lg">
          <Paper withBorder radius="xl" p="xl">
            <Group gap="sm">
              <ThemeIcon
                size={44}
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
              >
                <IconFileText size={22} />
              </ThemeIcon>
              <Box>
                <Title order={4} c="teal.9">
                  Intake → Scope
                </Title>
                <Text c="dimmed" size="sm">
                  Collect requirements and generate a structured scope doc.
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper withBorder radius="xl" p="xl">
            <Group gap="sm">
              <ThemeIcon size={44} radius="md" variant="light" color="teal">
                <IconTimeline size={22} />
              </ThemeIcon>
              <Box>
                <Title order={4} c="teal.9">
                  Timeline & milestones
                </Title>
                <Text c="dimmed" size="sm">
                  Phases, weeks, deliverables, and handoff-ready planning.
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper withBorder radius="xl" p="xl">
            <Group gap="sm">
              <ThemeIcon size={44} radius="md" variant="light" color="teal">
                <IconAlertTriangle size={22} />
              </ThemeIcon>
              <Box>
                <Title order={4} c="teal.9">
                  Risks & assumptions
                </Title>
                <Text c="dimmed" size="sm">
                  Make projects safer by default (and reduce scope creep).
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper withBorder radius="xl" p="xl">
            <Group gap="sm">
              <ThemeIcon size={44} radius="md" variant="light" color="teal">
                <IconReceipt2 size={22} />
              </ThemeIcon>
              <Box>
                <Title order={4} c="teal.9">
                  Pricing range
                </Title>
                <Text c="dimmed" size="sm">
                  Low/high estimates + payment schedule suggestion.
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper withBorder radius="xl" p="xl">
            <Group gap="sm">
              <ThemeIcon
                size={44}
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
              >
                <IconSparkles size={22} />
              </ThemeIcon>
              <Box>
                <Title order={4} c="teal.9">
                  Edit & export
                </Title>
                <Text c="dimmed" size="sm">
                  Save an edited JSON version and export later (PDF/SOW next).
                </Text>
              </Box>
            </Group>
          </Paper>

          <Paper withBorder radius="xl" p="xl">
            <Box>
              <Title order={4} c="teal.9">
                Built for consulting
              </Title>
              <Text c="dimmed" size="sm" mt="xs">
                Reusable templates, consistent output, faster proposals.
              </Text>
            </Box>
          </Paper>
        </SimpleGrid>

        {/* Footer CTA */}
        <Paper withBorder radius="xl" p="xl" mt="lg">
          <Group justify="space-between" align="center">
            <Box>
              <Title order={3}>Ready to generate your first scope?</Title>
              <Text c="dimmed">Sign in and create a new intake.</Text>
            </Box>

            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  Sign in
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button
                component={Link}
                href="/intakes/new"
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
              >
                New intake
              </Button>
            </SignedIn>
          </Group>
        </Paper>
      </Container>
    </Box>
  );
}
