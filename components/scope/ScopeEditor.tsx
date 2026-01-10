"use client";

import { useMemo, useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  List,
  Divider,
  Badge,
  SimpleGrid,
  Tabs,
  ThemeIcon,
  Box,
  Modal,
  Textarea,
  Notification,
  Anchor,
  ScrollArea,
} from "@mantine/core";
import {
  IconSparkles,
  IconEdit,
  IconAlertTriangle,
  IconTimeline,
  IconChecklist,
  IconTargetArrow,
  IconBraces,
  IconList,
} from "@tabler/icons-react";

type Props = {
  scopeId: string;
  initialGeneratedJson: any;
  initialEditedJson: any;
};

function safeArray<T = any>(v: any): T[] {
  return Array.isArray(v) ? v : [];
}

function safeString(v: any, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function ScopeEditor({
  scopeId,
  initialGeneratedJson,
  initialEditedJson,
}: Props) {
  const [view, setView] = useState<"generated" | "edited">("generated");

  // JSON editor modal state
  const [showJson, setShowJson] = useState(false);
  const [jsonDraft, setJsonDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const hasGenerated = !!initialGeneratedJson;
  const hasEdited = !!initialEditedJson;

  const data = useMemo(() => {
    return view === "generated" ? initialGeneratedJson : initialEditedJson;
  }, [view, initialGeneratedJson, initialEditedJson]);

  // Use generated title even when viewing edited (so header never blanks)
  const headerTitle =
    safeString(initialGeneratedJson?.projectTitle) ||
    safeString(initialEditedJson?.projectTitle) ||
    "Scope";

  const timeline = safeArray<any>(data?.timeline);
  const risks = safeArray<any>(data?.risks);

  function openJsonEditor() {
    setSaveError(null);

    const current =
      view === "generated" ? initialGeneratedJson : initialEditedJson;

    // Fall back to generated if edited is missing
    const seed = current ?? initialGeneratedJson ?? {};

    setJsonDraft(JSON.stringify(seed, null, 2));
    setShowJson(true);
  }

  async function saveJson() {
    setSaving(true);
    setSaveError(null);

    try {
      const parsed = JSON.parse(jsonDraft);

      const res = await fetch(`/api/scope/${scopeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });

      const out = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(out?.error || "Save failed");

      window.location.reload();
    } catch (e: any) {
      setSaveError(e?.message || "Invalid JSON");
    } finally {
      setSaving(false);
    }
  }

  const Section = ({
    id,
    title,
    icon,
    children,
  }: {
    id: string;
    title: string;
    icon?: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <Paper withBorder radius="lg" p="xl" id={id}>
      <Group gap="sm" mb="sm">
        {icon ? (
          <ThemeIcon
            size={34}
            radius="md"
            variant="gradient"
            gradient={{ from: "teal", to: "cyan", deg: 60 }}
          >
            {icon}
          </ThemeIcon>
        ) : null}

        <Box style={{ flex: 1 }}>
          <Title order={3} c="teal.8">
            {title}
          </Title>
          <Divider mt={8} size="sm" variant="gradient" />
        </Box>
      </Group>

      <Box mt="md">{children}</Box>
    </Paper>
  );

  const StringList = ({ items }: { items?: string[] }) => {
    const list = safeArray<string>(items);
    if (!list.length) return <Text c="dimmed">None</Text>;

    return (
      <List
        spacing="xs"
        icon={
          <ThemeIcon
            size={20}
            radius="xl"
            variant="gradient"
            gradient={{ from: "teal", to: "cyan", deg: 60 }}
          >
            <IconChecklist size={14} />
          </ThemeIcon>
        }
      >
        {list.map((x, i) => (
          <List.Item key={i}>
            <Text>{x}</Text>
          </List.Item>
        ))}
      </List>
    );
  };

  // Table of Contents (left column)
  const tocItems = [
    { label: "Executive Summary", id: slugify("Executive Summary") },
    { label: "Problem Statement", id: slugify("Problem Statement") },
    { label: "Goals", id: slugify("Goals") },
    { label: "User Types", id: slugify("User Types") },
    { label: "MVP Features", id: slugify("MVP Features") },
    { label: "MVP User Stories", id: slugify("MVP User Stories") },
    { label: "Phase 2 Features", id: slugify("Phase 2 Features") },
    { label: "Non-Goals", id: slugify("Non-Goals") },
    { label: "Scope Boundaries", id: slugify("Scope Boundaries") },
    { label: "Timeline", id: slugify("Timeline") },
    { label: "Milestones", id: slugify("Milestones") },
    { label: "Assumptions", id: slugify("Assumptions") },
    { label: "Dependencies", id: slugify("Dependencies") },
    { label: "Risks", id: slugify("Risks") },
    { label: "Acceptance Criteria", id: slugify("Acceptance Criteria") },
    { label: "Deliverables", id: slugify("Deliverables") },
    { label: "Pricing Estimate", id: slugify("Pricing Estimate") },
    { label: "Tech Stack", id: slugify("Tech Stack") },
    { label: "Next Steps", id: slugify("Next Steps") },
  ];

  function scrollToId(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    // Update URL hash without hard-jumping
    history.replaceState(null, "", `#${id}`);
  }

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 35%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container size="xl" py="xl">
        {/* Header always visible */}
        <Paper radius="xl" p="xl" withBorder>
          <Group justify="space-between" align="flex-start">
            <Box>
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
                {headerTitle}
              </Title>

              <Group gap="xs" mt="sm">
                <Badge
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  SCOPE
                </Badge>

                <Text size="sm" c="dimmed">
                  {scopeId}
                </Text>

                {!hasGenerated ? (
                  <Badge color="red" variant="light">
                    Missing generated JSON
                  </Badge>
                ) : null}

                {!hasEdited ? (
                  <Badge color="yellow" variant="light">
                    No edited version yet
                  </Badge>
                ) : null}
              </Group>
            </Box>

            <Tabs
              value={view}
              onChange={(v) => setView((v as any) ?? "generated")}
              variant="pills"
              radius="xl"
              color="teal"
            >
              <Tabs.List>
                <Tabs.Tab
                  value="generated"
                  leftSection={<IconSparkles size={16} />}
                >
                  Generated
                </Tabs.Tab>
                <Tabs.Tab
                  value="edited"
                  leftSection={<IconEdit size={16} />}
                  disabled={!hasEdited}
                >
                  Edited
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
          </Group>

          <Group mt="lg" gap="sm">
            <Button
              variant="gradient"
              gradient={{ from: "teal", to: "cyan", deg: 60 }}
              radius="md"
              onClick={() => setView("generated")}
            >
              View Generated
            </Button>

            <Button
              variant="light"
              color="teal"
              radius="md"
              onClick={() => setView("edited")}
              disabled={!hasEdited}
              title={!hasEdited ? "No edited JSON saved yet" : undefined}
            >
              View Edited
            </Button>

            <Button
              variant="default"
              leftSection={<IconBraces size={16} />}
              onClick={openJsonEditor}
            >
              View / Edit JSON
            </Button>
          </Group>
        </Paper>

        {/* Layout: TOC (left) + content (right) */}
        <SimpleGrid cols={{ base: 1, md: 12 }} spacing="lg" mt="lg">
          {/* TOC */}
          <Box style={{ gridColumn: "span 3" }}>
            <Paper withBorder radius="lg" p="md">
              <Group gap="sm" mb="sm">
                <ThemeIcon
                  size={30}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  <IconList size={16} />
                </ThemeIcon>
                <Title order={4} c="teal.8">
                  Contents
                </Title>
              </Group>

              <Divider mb="sm" />

              <ScrollArea h={520} type="always">
                <Stack gap={6}>
                  {tocItems.map((item) => (
                    <Anchor
                      key={item.id}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToId(item.id);
                      }}
                      c="teal.9"
                      style={{ fontWeight: 600 }}
                    >
                      {item.label}
                    </Anchor>
                  ))}
                </Stack>
              </ScrollArea>
            </Paper>
          </Box>

          {/* Content */}
          <Box style={{ gridColumn: "span 9" }}>
            {!data ? (
              <Paper withBorder radius="lg" p="xl">
                <Title order={3} c="teal.8">
                  {view === "edited"
                    ? "No edited scope yet"
                    : "Scope not found"}
                </Title>
                <Text c="dimmed" mt="sm">
                  {view === "edited"
                    ? "You haven’t saved an edited version yet. Open the JSON editor, make changes, and click Save to create editedJson."
                    : "The API did not return a generated scope JSON for this document. Check your /api/scope/[scopeId] route response."}
                </Text>
              </Paper>
            ) : (
              <Stack gap="lg">
                <Section
                  id={slugify("Executive Summary")}
                  title="Executive Summary"
                  icon={<IconTargetArrow size={18} />}
                >
                  <Text>{safeString(data.executiveSummary, "—")}</Text>
                </Section>

                <Section
                  id={slugify("Problem Statement")}
                  title="Problem Statement"
                  icon={<IconAlertTriangle size={18} />}
                >
                  <Text>{safeString(data.problemStatement, "—")}</Text>
                </Section>

                <Section
                  id={slugify("Goals")}
                  title="Goals"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.goals} />
                </Section>

                <Section
                  id={slugify("User Types")}
                  title="User Types"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.userTypes} />
                </Section>

                <Section
                  id={slugify("MVP Features")}
                  title="MVP Features"
                  icon={<IconSparkles size={18} />}
                >
                  <StringList items={data.mvp?.features} />
                </Section>

                <Section
                  id={slugify("MVP User Stories")}
                  title="MVP User Stories"
                  icon={<IconTargetArrow size={18} />}
                >
                  <StringList items={data.mvp?.userStories} />
                </Section>

                <Section
                  id={slugify("Phase 2 Features")}
                  title="Phase 2 Features"
                  icon={<IconEdit size={18} />}
                >
                  <StringList items={data.phase2?.features} />
                </Section>

                <Section
                  id={slugify("Non-Goals")}
                  title="Non-Goals"
                  icon={<IconAlertTriangle size={18} />}
                >
                  <StringList items={data.nonGoals} />
                </Section>

                <Section
                  id={slugify("Scope Boundaries")}
                  title="Scope Boundaries"
                  icon={<IconChecklist size={18} />}
                >
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    <Paper withBorder radius="md" p="md">
                      <Title order={5} c="teal.8" mb="xs">
                        In Scope
                      </Title>
                      <StringList items={data.scopeBoundaries?.inScope} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Title order={5} c="teal.8" mb="xs">
                        Out of Scope
                      </Title>
                      <StringList items={data.scopeBoundaries?.outOfScope} />
                    </Paper>
                  </SimpleGrid>
                </Section>

                <Section
                  id={slugify("Timeline")}
                  title="Timeline"
                  icon={<IconTimeline size={18} />}
                >
                  <Stack gap="sm">
                    {timeline.length ? (
                      timeline.map((t: any, i: number) => (
                        <Paper key={i} withBorder radius="lg" p="md">
                          <Group justify="space-between" mb={6}>
                            <Text fw={700} c="teal.9">
                              {safeString(t?.phase, `Phase ${i + 1}`)}
                            </Text>
                            <Badge variant="light" color="teal" radius="sm">
                              {t?.durationWeeks ?? "?"} weeks
                            </Badge>
                          </Group>
                          <Divider my="sm" />
                          <StringList items={t?.whatHappens} />
                        </Paper>
                      ))
                    ) : (
                      <Text c="dimmed">No timeline provided.</Text>
                    )}
                  </Stack>
                </Section>

                <Section
                  id={slugify("Milestones")}
                  title="Milestones"
                  icon={<IconTimeline size={18} />}
                >
                  <Stack gap="sm">
                    {Array.isArray(data.milestones) &&
                    data.milestones.length ? (
                      data.milestones.map((m: any, i: number) => (
                        <Paper key={i} withBorder radius="lg" p="md">
                          <Group justify="space-between" mb={6}>
                            <Text fw={700} c="teal.9">
                              {safeString(m?.name, "Milestone")}
                            </Text>
                            <Badge variant="light" color="teal" radius="sm">
                              Week {m?.dueWeek ?? "?"}
                            </Badge>
                          </Group>
                          <Text c="dimmed">
                            {safeString(m?.description, "—")}
                          </Text>
                          <Divider my="sm" />
                          <Text fw={600} mb={6}>
                            Deliverables
                          </Text>
                          <StringList items={m?.deliverables} />
                        </Paper>
                      ))
                    ) : (
                      <Text c="dimmed">No milestones provided.</Text>
                    )}
                  </Stack>
                </Section>

                <Section
                  id={slugify("Assumptions")}
                  title="Assumptions"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.assumptions} />
                </Section>

                <Section
                  id={slugify("Dependencies")}
                  title="Dependencies"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.dependencies} />
                </Section>

                <Section
                  id={slugify("Risks")}
                  title="Risks"
                  icon={<IconAlertTriangle size={18} />}
                >
                  <Stack gap="sm">
                    {risks.length ? (
                      risks.map((r: any, i: number) => (
                        <Paper key={i} withBorder radius="lg" p="md">
                          <Group justify="space-between" mb={6}>
                            <Text fw={700}>{safeString(r?.risk, "Risk")}</Text>
                            <Badge
                              variant="gradient"
                              gradient={{ from: "teal", to: "cyan", deg: 60 }}
                            >
                              {safeString(r?.impact, "Impact")}
                            </Badge>
                          </Group>
                          <Text c="dimmed">
                            {safeString(r?.mitigation, "—")}
                          </Text>
                        </Paper>
                      ))
                    ) : (
                      <Text c="dimmed">No risks provided.</Text>
                    )}
                  </Stack>
                </Section>

                <Section
                  id={slugify("Acceptance Criteria")}
                  title="Acceptance Criteria"
                  icon={<IconTargetArrow size={18} />}
                >
                  <StringList items={data.acceptanceCriteria} />
                </Section>

                <Section
                  id={slugify("Deliverables")}
                  title="Deliverables"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.deliverables} />
                </Section>

                <Section
                  id={slugify("Pricing Estimate")}
                  title="Pricing Estimate"
                  icon={<IconTargetArrow size={18} />}
                >
                  <Paper withBorder radius="md" p="md">
                    <Group justify="space-between">
                      <Text fw={700}>Estimated Range</Text>
                      <Badge
                        variant="gradient"
                        gradient={{ from: "teal", to: "cyan", deg: 60 }}
                      >
                        ${data.pricingEstimate?.lowUSD ?? "—"} – $
                        {data.pricingEstimate?.highUSD ?? "—"}
                      </Badge>
                    </Group>
                    <Divider my="sm" />
                    <Text fw={600} mb={6}>
                      Pricing Drivers
                    </Text>
                    <StringList items={data.pricingEstimate?.pricingDrivers} />
                    <Divider my="sm" />
                    <Text fw={600} mb={6}>
                      Payment Schedule
                    </Text>
                    <Text c="dimmed">
                      {safeString(
                        data.pricingEstimate?.paymentScheduleSuggestion,
                        "—"
                      )}
                    </Text>
                  </Paper>
                </Section>

                <Section
                  id={slugify("Tech Stack")}
                  title="Tech Stack"
                  icon={<IconSparkles size={18} />}
                >
                  <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Frontend
                      </Text>
                      <StringList items={data.techStack?.frontend} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Backend
                      </Text>
                      <StringList items={data.techStack?.backend} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Database
                      </Text>
                      <StringList items={data.techStack?.database} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Auth
                      </Text>
                      <StringList items={data.techStack?.auth} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Hosting
                      </Text>
                      <StringList items={data.techStack?.hosting} />
                    </Paper>
                    <Paper withBorder radius="md" p="md">
                      <Text fw={700} mb={6}>
                        Integrations
                      </Text>
                      <StringList items={data.techStack?.integrations} />
                    </Paper>
                  </SimpleGrid>
                </Section>

                <Section
                  id={slugify("Next Steps")}
                  title="Next Steps"
                  icon={<IconChecklist size={18} />}
                >
                  <StringList items={data.nextSteps} />
                </Section>
              </Stack>
            )}
          </Box>
        </SimpleGrid>

        {/* JSON Editor Modal */}
        <Modal
          opened={showJson}
          onClose={() => setShowJson(false)}
          title={`Edit ${view === "generated" ? "Generated" : "Edited"} JSON`}
          size="xl"
        >
          <Stack>
            {saveError ? (
              <Notification color="red" onClose={() => setSaveError(null)}>
                {saveError}
              </Notification>
            ) : null}

            <Textarea
              minRows={18}
              autosize
              value={jsonDraft}
              onChange={(e) => setJsonDraft(e.currentTarget.value)}
              styles={{ input: { fontFamily: "monospace", fontSize: 13 } }}
            />

            <Group justify="flex-end">
              <Button variant="default" onClick={() => setShowJson(false)}>
                Close
              </Button>

              <Button
                loading={saving}
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
                onClick={saveJson}
              >
                Save JSON
              </Button>
            </Group>

            <Text size="xs" c="dimmed">
              Saving writes your JSON to <b>editedJson</b> for this scope. After
              refresh, the “Edited” tab will be available.
            </Text>
          </Stack>
        </Modal>
      </Container>
    </Box>
  );
}
