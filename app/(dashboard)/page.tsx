import {
  Paper,
  Title,
  Text,
  SimpleGrid,
  Button,
  Group,
  Badge,
} from "@mantine/core";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div>
      <Paper withBorder radius="xl" p="xl">
        <Group justify="space-between" align="flex-start">
          <div>
            <Title
              order={1}
              style={{
                background: "linear-gradient(90deg, #0f766e, #06b6d4)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontWeight: 900,
                letterSpacing: -0.5,
              }}
            >
              Dashboard
            </Title>
            <Text c="dimmed" mt={6}>
              Create an intake → generate a scope → edit → export proposal
            </Text>
            <Group gap="xs" mt="sm">
              <Badge
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
              >
                Teal System
              </Badge>
              <Badge variant="light" color="teal">
                Mantine
              </Badge>
              <Badge variant="light" color="teal">
                Clerk Auth
              </Badge>
            </Group>
          </div>

          <Group>
            <Button
              component={Link}
              href="/intakes/new"
              variant="gradient"
              gradient={{ from: "teal", to: "cyan", deg: 60 }}
              radius="md"
            >
              New Intake
            </Button>
            <Button
              component={Link}
              href="/projects"
              variant="light"
              color="teal"
              radius="md"
            >
              View Projects
            </Button>
          </Group>
        </Group>
      </Paper>

      <SimpleGrid
        cols={{ base: 1, md: 3 }}
        spacing="lg"
        style={{ marginTop: 18 }}
      >
        <Paper withBorder radius="xl" p="xl">
          <Title order={3} c="teal.8">
            Intakes
          </Title>
          <Text c="dimmed" mt="sm">
            Collect requirements, constraints, and success criteria.
          </Text>
          <Button
            component={Link}
            href="/intakes"
            variant="light"
            color="teal"
            radius="md"
            mt="md"
            fullWidth
          >
            Manage Intakes
          </Button>
        </Paper>

        <Paper withBorder radius="xl" p="xl">
          <Title order={3} c="teal.8">
            Scopes
          </Title>
          <Text c="dimmed" mt="sm">
            Generated + edited JSON, timeline, risks, milestones.
          </Text>
          <Button
            component={Link}
            href="/projects"
            variant="light"
            color="teal"
            radius="md"
            mt="md"
            fullWidth
          >
            Open Scopes
          </Button>
        </Paper>

        <Paper withBorder radius="xl" p="xl">
          <Title order={3} c="teal.8">
            Exports
          </Title>
          <Text c="dimmed" mt="sm">
            Proposal PDF, SOW, contract-ready deliverables (coming next).
          </Text>
          <Button
            component={Link}
            href="/settings"
            variant="light"
            color="teal"
            radius="md"
            mt="md"
            fullWidth
          >
            Configure
          </Button>
        </Paper>
      </SimpleGrid>
    </div>
  );
}
