import type { TeamPageSection as TeamPageSectionType } from "../../api/types";

type Member = TeamPageSectionType["executiveMembers"][number];

const renderTitle = (title?: string | null, accent?: string | null, className?: string) => {
  if (!title && !accent) return null;
  return (
    <h2 className={className}>
      {title}
      {accent ? <span className="text-[#0d9a8a]"> {accent}</span> : null}
    </h2>
  );
};

const MemberCard = ({ member, compact = false }: { member: Member; compact?: boolean }) => (
  <article
    className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${compact ? "p-5 text-center" : "p-4"}`}
  >
    {member.avatar?.url ? (
      <img
        src={member.avatar.url}
        alt={member.avatar.alternativeText || member.name}
        className={`${compact ? "mx-auto h-20 w-20 rounded-full" : "h-56 w-full rounded-2xl"} object-cover`}
        loading="lazy"
      />
    ) : (
      <div className={`${compact ? "mx-auto h-20 w-20 rounded-full" : "h-56 w-full rounded-2xl"} bg-slate-200`} />
    )}
    <div className={compact ? "mt-4" : "mt-4"}>
      <h3 className={`font-bold text-[#111827] ${compact ? "text-base" : "text-xl"}`}>{member.name}</h3>
      {member.role ? <p className="mt-1 text-sm font-semibold uppercase tracking-[0.06em] text-[#0d9a8a]">{member.role}</p> : null}
      {member.bio ? <p className="mt-2 text-sm text-slate-500">{member.bio}</p> : null}
      {(member.email || member.linkedinUrl) ? (
        <div className={`mt-3 flex gap-3 text-xs ${compact ? "justify-center" : ""}`}>
          {member.email ? <a className="text-slate-500 hover:text-[#0d9a8a]" href={`mailto:${member.email}`}>Email</a> : null}
          {member.linkedinUrl ? (
            <a className="text-slate-500 hover:text-[#0d9a8a]" href={member.linkedinUrl} rel="noreferrer">
              LinkedIn
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  </article>
);

const ORG_TONE_CLASS: Record<"outline" | "teal" | "yellow" | "orange", string> = {
  outline: "border border-[#0d9a8a] bg-white text-[#1f2937]",
  teal: "border border-[#0d9a8a] bg-[#0d9a8a] text-white",
  yellow: "border border-[#f4cb2e] bg-[#f6d44f] text-[#1f2937]",
  orange: "border border-[#f97316] bg-[#f97316] text-white"
};

const OrgChip = ({
  label,
  tone = "outline"
}: {
  label: string;
  tone?: "outline" | "teal" | "yellow" | "orange" | null;
}) => (
  <span
    className={`inline-flex rounded-full px-4 py-1 text-xs font-semibold shadow-sm ${
      ORG_TONE_CLASS[tone || "outline"]
    }`}
  >
    {label}
  </span>
);

export default function TeamPageSection({ section }: { section: TeamPageSectionType }) {
  return (
    <section className="perf-section bg-[#f4f5f6] text-[#111827]">
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            {section.eyebrow ? (
              <span className="inline-block rounded-full bg-[#e6f5f2] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#0d9a8a]">
                {section.eyebrow}
              </span>
            ) : null}
            {renderTitle(section.title, section.titleAccent, "mt-4 text-5xl font-bold leading-tight")}
            {section.intro ? <p className="mt-5 max-w-xl text-lg text-slate-600">{section.intro}</p> : null}
            {section.heroCtaLabel && section.heroCtaUrl ? (
              <a
                href={section.heroCtaUrl}
                className="mt-7 inline-flex items-center rounded-full bg-[#0d9a8a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0b8679]"
              >
                {section.heroCtaLabel}
              </a>
            ) : null}
          </div>

          <article className="relative overflow-hidden rounded-[1rem] bg-gradient-to-br from-[#d6ece7] via-[#b8e2da] to-[#46ad9e] p-6 shadow-[0_12px_30px_rgba(15,23,42,0.15)]">
            {section.heroImage?.url ? (
              <img
                src={section.heroImage.url}
                alt={section.heroImage.alternativeText || "Team hero"}
                className="h-72 w-full rounded-[1rem] object-cover"
              />
            ) : (
              <div className="h-72 w-full rounded-[1rem] bg-white/30" />
            )}
            {(section.heroCardEyebrow || section.heroCardTitle || section.heroCardText) ? (
              <div className="absolute bottom-8 left-10 right-10 rounded-2xl bg-[#0d9a8a]/85 p-5 text-white backdrop-blur">
                {section.heroCardEyebrow ? <p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#f6d44f]">{section.heroCardEyebrow}</p> : null}
                {section.heroCardTitle ? <h3 className="mt-1 text-2xl font-bold">{section.heroCardTitle}</h3> : null}
                {section.heroCardText ? <p className="mt-1 text-sm text-white/90">{section.heroCardText}</p> : null}
              </div>
            ) : null}
          </article>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="text-center">
          {renderTitle(section.organizationTitle, section.organizationAccent, "text-4xl font-bold")}
          {section.organizationSubtitle ? <p className="mt-3 text-slate-500">{section.organizationSubtitle}</p> : null}
        </div>
        {section.orgBranches.length > 0 ? (
          <div className="mt-10 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            {section.orgDirectorLabel ? (
              <div className="flex justify-center">
                <OrgChip label={section.orgDirectorLabel} tone={section.orgDirectorTone} />
              </div>
            ) : null}
            <div className="mx-auto mt-2 h-6 w-px bg-[#8fd0c8]" />
            <div className="mx-auto h-px w-[88%] bg-[#8fd0c8]" />
            <div className="mt-2 grid gap-6 md:grid-cols-3">
              {section.orgBranches.map((branch, branchIndex) => (
                <div key={`${branch.leadLabel}-${branchIndex}`} className="text-center">
                  <div className="mx-auto h-5 w-px bg-[#8fd0c8]" />
                  <OrgChip label={branch.leadLabel} tone={branch.leadTone} />
                  <div className="mx-auto mt-1 h-4 w-px bg-[#8fd0c8]" />
                  <div className="flex flex-col items-center gap-2">
                    {branch.roles.map((role, roleIndex) => (
                      <OrgChip key={`${role.label}-${roleIndex}`} label={role.label} tone={role.tone} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : section.organizationImage?.url ? (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <img
              src={section.organizationImage.url}
              alt={section.organizationImage.alternativeText || "Organisation"}
              className="w-full rounded-2xl object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="text-center">
          {renderTitle(section.executiveTitle, section.executiveAccent, "text-4xl font-bold")}
          {section.executiveSubtitle ? <p className="mt-3 text-slate-500">{section.executiveSubtitle}</p> : null}
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {section.executiveMembers.map((member, index) => (
            <MemberCard key={`${member.name}-${index}`} member={member} />
          ))}
        </div>
      </div>

      <div className="border-t-2 border-[#0d9a8a] border-b-2 border-[#f6d44f] bg-[#f0f2f3]">
        <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
          <div className="text-center">
            {renderTitle(section.boardTitle, section.boardAccent, "text-4xl font-bold")}
            {section.boardSubtitle ? <p className="mt-3 text-slate-500">{section.boardSubtitle}</p> : null}
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {section.boardMembers.map((member, index) => (
              <MemberCard key={`${member.name}-${index}`} member={member} compact />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-14 md:py-18">
        <div className="relative overflow-hidden rounded-[1rem] bg-gradient-to-r from-[#0d9a8a] to-[#1ca68f] p-8 text-white md:p-12">
          <div className="grid items-center gap-8 md:grid-cols-[1.6fr_1fr]">
            <div>
              {section.joinTitle ? <h3 className="text-4xl font-bold leading-tight">{section.joinTitle}</h3> : null}
              {section.joinText ? <p className="mt-4 max-w-2xl text-white/90">{section.joinText}</p> : null}
              <div className="mt-7 flex flex-wrap gap-3">
                {section.joinPrimaryLabel && section.joinPrimaryUrl ? (
                  <a
                    href={section.joinPrimaryUrl}
                    className="rounded-full bg-[#f6d44f] px-6 py-3 text-sm font-semibold text-[#1f2937] hover:bg-[#f4cb2e]"
                  >
                    {section.joinPrimaryLabel}
                  </a>
                ) : null}
                {section.joinSecondaryLabel && section.joinSecondaryUrl ? (
                  <a
                    href={section.joinSecondaryUrl}
                    className="rounded-full border border-white/70 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
                  >
                    {section.joinSecondaryLabel}
                  </a>
                ) : null}
              </div>
            </div>
            {section.joinImage?.url ? (
              <img
                src={section.joinImage.url}
                alt={section.joinImage.alternativeText || "Join team"}
                className="mx-auto h-40 w-40 rounded-2xl object-cover opacity-90"
              />
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
