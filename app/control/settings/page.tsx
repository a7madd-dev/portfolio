export const dynamic = "force-dynamic";

export default function ControlSettingsPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2 border-b border-hairline pb-6">
        <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-ink-dim">
          / Settings
        </p>
        <h1 className="text-3xl font-semibold tracking-[-0.02em]">Settings</h1>
        <p className="max-w-md text-sm text-ink-muted">
          Portfolio-level configuration lives here. Not wired up yet — the data
          layer is designed to accept a second JSON store in the same shape as
          projects.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <InfoTile
          label="Password"
          value="Set via CONTROL_PASSWORD env var (defaults to “admin”)"
        />
        <InfoTile
          label="Storage"
          value="content/projects.json · file-backed, hot-reloaded on write"
        />
        <InfoTile
          label="API"
          value="/api/projects · GET, POST, PUT, DELETE"
        />
        <InfoTile
          label="Revalidation"
          value="revalidatePath('/') fires after every mutation"
        />
      </section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2 rounded-xl border border-hairline bg-surface/60 p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-dim">
        {label}
      </p>
      <p className="text-sm text-ink">{value}</p>
    </div>
  );
}
