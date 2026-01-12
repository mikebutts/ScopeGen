// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";

// type Intake = {
//   _id: string;
//   projectName: string;
//   industry: string;
//   projectType: string;
//   budgetRange: string;
//   deadline: string;
//   createdAt: string;
// };

// export default function DashboardHome() {
//   const [intakes, setIntakes] = useState<Intake[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState<string | null>(null);

//   async function load() {
//     setLoading(true);
//     setErr(null);
//     try {
//       const res = await fetch("/api/intakes", { cache: "no-store" });
//       if (!res.ok) throw new Error(`Failed: ${res.status}`);
//       const data = await res.json();
//       setIntakes(data.intakes ?? []);
//     } catch (e: any) {
//       setErr(e?.message ?? "Unknown error");
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   return (
//     <div>
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-semibold">Dashboard</h1>
//           <p className="mt-1 text-zinc-300">
//             Create an intake, then generate a scope doc.
//           </p>
//         </div>

//         <Link
//           href="/projects/new"
//           className="rounded-lg bg-white px-4 py-2 text-zinc-900 font-medium hover:bg-zinc-200"
//         >
//           + New Intake
//         </Link>
//       </div>

//       <div className="mt-8">
//         {loading && <p className="text-zinc-300">Loading…</p>}
//         {err && <p className="text-red-400">Error: {err}</p>}

//         {!loading && !err && intakes.length === 0 && (
//           <div className="rounded-xl border border-zinc-800 p-6">
//             <p className="text-zinc-300">No intakes yet.</p>
//             <Link className="mt-3 inline-block underline" href="/projects/new">
//               Create your first intake →
//             </Link>
//           </div>
//         )}

//         {!loading && !err && intakes.length > 0 && (
//           <div className="grid gap-3">
//             {intakes.map((i) => (
//               <Link
//                 key={i._id}
//                 href={`/projects/${i._id}`}
//                 className="rounded-xl border border-zinc-800 p-4 hover:bg-zinc-900 transition"
//               >
//                 <div className="flex items-start justify-between gap-4">
//                   <div>
//                     <div className="text-lg font-medium">{i.projectName}</div>
//                     <div className="mt-1 text-sm text-zinc-300">
//                       {i.industry} · {i.projectType}
//                     </div>
//                     <div className="mt-2 text-sm text-zinc-400">
//                       Budget: {i.budgetRange} · Deadline: {i.deadline}
//                     </div>
//                   </div>
//                   <div className="text-xs text-zinc-500">
//                     {new Date(i.createdAt).toLocaleString()}
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Paper,
  Title,
  Text,
  Group,
  Button,
  Stack,
  SimpleGrid,
  Badge,
  Divider,
  ThemeIcon,
  Box,
  Skeleton,
} from "@mantine/core";
import {
  IconPlus,
  IconClipboardList,
  IconCalendar,
  IconCash,
} from "@tabler/icons-react";

type Intake = {
  _id: string;
  projectName: string;
  industry: string;
  projectType: string;
  budgetRange: string;
  deadline: string;
  createdAt: string;
};

function safeString(v: any, fallback = "—") {
  return typeof v === "string" && v.trim().length ? v : fallback;
}

function formatDate(v?: string) {
  if (!v) return "—";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return v;
  return d.toLocaleString();
}

export default function DashboardHome() {
  const [intakes, setIntakes] = useState<Intake[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch("/api/intakes", { cache: "no-store" });
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      const data = await res.json();
      setIntakes(data.intakes ?? []);
    } catch (e: any) {
      setErr(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const sorted = useMemo(() => {
    return [...intakes].sort(
      (a, b) =>
        new Date(b.updatedAt ?? b.createdAt).getTime() -
        new Date(a.updatedAt ?? a.createdAt).getTime()
    );
    // NOTE: if your API doesn't include updatedAt, this still works via createdAt.
    // @ts-expect-error updatedAt is optional and may exist from Mongo
  }, [intakes]);

  return (
    <Box
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, rgba(16,185,129,0.06) 0%, rgba(6,182,212,0.04) 35%, rgba(255,255,255,1) 100%)",
      }}
    >
      <Container size="lg" py="xl">
        {/* Header */}
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
                  letterSpacing: -0.6,
                }}
              >
                Dashboard
              </Title>

              <Text c="dimmed" mt={6}>
                Create an intake, then generate a scope doc.
              </Text>

              <Group gap="xs" mt="md">
                <Badge
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  ScopeGen
                </Badge>
                <Badge variant="light" color="teal">
                  Intakes: {loading ? "…" : sorted.length}
                </Badge>
              </Group>
            </Box>

            <Group gap="sm">
              <Button
                component={Link}
                href="/projects/new"
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
                leftSection={<IconPlus size={16} />}
              >
                New Intake
              </Button>

              <Button radius="md" variant="light" color="teal" onClick={load}>
                Refresh
              </Button>
            </Group>
          </Group>
        </Paper>

        {/* Content */}
        <Box mt="lg">
          {err ? (
            <Paper withBorder radius="lg" p="xl">
              <Group gap="sm" mb="sm">
                <ThemeIcon
                  size={34}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  <IconClipboardList size={18} />
                </ThemeIcon>
                <Box>
                  <Title order={3} c="teal.8">
                    Couldn’t load intakes
                  </Title>
                  <Text c="dimmed">Error: {err}</Text>
                </Box>
              </Group>

              <Button
                mt="md"
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
                onClick={load}
              >
                Try again
              </Button>
            </Paper>
          ) : null}

          {loading ? (
            <Stack gap="md" mt="lg">
              <Skeleton height={110} radius="lg" />
              <Skeleton height={110} radius="lg" />
              <Skeleton height={110} radius="lg" />
            </Stack>
          ) : null}

          {!loading && !err && sorted.length === 0 ? (
            <Paper withBorder radius="lg" p="xl" mt="lg">
              <Group gap="sm" mb="sm">
                <ThemeIcon
                  size={34}
                  radius="md"
                  variant="gradient"
                  gradient={{ from: "teal", to: "cyan", deg: 60 }}
                >
                  <IconClipboardList size={18} />
                </ThemeIcon>
                <Box>
                  <Title order={3} c="teal.8">
                    No intakes yet
                  </Title>
                  <Text c="dimmed">
                    Create your first intake to generate a proposal-ready scope.
                  </Text>
                </Box>
              </Group>

              <Button
                component={Link}
                href="/projects/new"
                radius="md"
                variant="gradient"
                gradient={{ from: "teal", to: "cyan", deg: 60 }}
                leftSection={<IconPlus size={16} />}
              >
                Create first intake
              </Button>
            </Paper>
          ) : null}

          {!loading && !err && sorted.length > 0 ? (
            <Stack gap="md" mt="lg">
              <Group justify="space-between" align="center">
                <Title order={3} c="teal.8">
                  Recent Intakes
                </Title>
                <Text size="sm" c="dimmed">
                  Sorted by most recent
                </Text>
              </Group>

              <Divider />

              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {sorted.map((i) => (
                  <Paper
                    key={i._id}
                    withBorder
                    radius="lg"
                    p="lg"
                    component={Link as any}
                    href={`/projects/${i._id}`}
                    style={{
                      textDecoration: "none",
                      transition: "transform 120ms ease, box-shadow 120ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as any).style.transform =
                        "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as any).style.transform =
                        "translateY(0px)";
                    }}
                  >
                    <Group justify="space-between" align="flex-start" mb="xs">
                      <Box style={{ minWidth: 0 }}>
                        <Title
                          order={4}
                          style={{
                            background:
                              "linear-gradient(90deg, #0f766e, #06b6d4)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 800,
                            lineHeight: 1.2,
                          }}
                        >
                          {safeString(i.projectName, "Untitled Intake")}
                        </Title>

                        <Text size="sm" c="dimmed" mt={6}>
                          {safeString(i.industry)} · {safeString(i.projectType)}
                        </Text>
                      </Box>

                      <Badge variant="light" color="teal" radius="sm">
                        Open →
                      </Badge>
                    </Group>

                    <Divider my="sm" />

                    <Stack gap={8}>
                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon
                          size={26}
                          radius="md"
                          variant="light"
                          color="teal"
                        >
                          <IconCash size={16} />
                        </ThemeIcon>
                        <Text size="sm">
                          <Text span fw={600}>
                            Budget:
                          </Text>{" "}
                          {safeString(i.budgetRange)}
                        </Text>
                      </Group>

                      <Group gap="xs" wrap="nowrap">
                        <ThemeIcon
                          size={26}
                          radius="md"
                          variant="light"
                          color="teal"
                        >
                          <IconCalendar size={16} />
                        </ThemeIcon>
                        <Text size="sm">
                          <Text span fw={600}>
                            Deadline:
                          </Text>{" "}
                          {safeString(i.deadline)}
                        </Text>
                      </Group>

                      <Text size="xs" c="dimmed" mt={4}>
                        Created {formatDate(i.createdAt)}
                      </Text>
                    </Stack>
                  </Paper>
                ))}
              </SimpleGrid>
            </Stack>
          ) : null}
        </Box>
      </Container>
    </Box>
  );
}
