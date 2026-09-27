# Platform tree — sidebar UI + everything found across our docs/notes

Merges: `README-IDEA.md` (v1), `README-IDEA-V2.md` (v2 pivot), `PLATFORM-SECTIONS.md`,
the Excalidraw board (`docs_excaladraw/Untitled-2026-05-16-1730.excalidraw`), and the
detailed Finance field spec given in chat. Status marks are checked against the actual
code, not just the docs.

Legend: ✅ built & wired · ⚠️ stub/placeholder only, no data behind it · ❌ not started at all

## 1. Sidebar tree, fully expanded — Finance detail + Board↔Finance link merged in

```
Sidebar
├── Overview                → "/"        ✅ live (stat cards, filters, project board — all mock data)
│
├── Finance ▾ (dropdown)                 ⚠️ stub group, no route
│   │
│   ├── Income                           ⚠️ stub, no file
│   │   └── fields (spec only, nothing built): Amount · Date · Source (Sponsor /
│   │       Donation / Grant / Membership) · From · Payment Method (Bank, Cash) ·
│   │       Reference Number · Receipt / Proof (PDF or image) · Notes
│   │
│   ├── Expenses                         ⚠️ stub, no file
│   │   └── fields (spec only, nothing built): Amount · Date · Category (Event /
│   │       Marketing / Transport / Equipment) · Paid to · Payment Method ·
│   │       Invoice / Justification (Facture, Bon, Reçu) · Approved by · Notes
│   │
│   ├── Documents                        ⚠️ stub, no file
│   │   └── types (spec only): Invoice · Receipt · Bank Transfer Proof · Contract ·
│   │       PDF or Image — every Income/Expense entry links to one
│   │
│   └── Reports                          ⚠️ stub, no file
│       └── = "Dashboard" in the field spec (same thing, different name):
│           Total Money Raised · Total Expenses · Current Balance ·
│           Monthly Income vs Expenses · Budget per Project
│           (Excalidraw also adds: active projects count, grants count —
│            post-login only, per the visibility rule in §8 below)
│
├── Board                                ⚠️ stub — file exists (Board.tsx) but unrouted, v1-shaped
│   └── 🔗 Link with Projects (Finance ↔ Board — not its own sidebar item, lives on
│       each project's own detail page, pulling from Finance's entries):
│       e.g. Project A — Budget 20,000 DH, Spent 12,300 DH, Remaining 7,700 DH,
│       every invoice/justificatif for it attached here. (Excalidraw's "Budgets"
│       — one per project/program — and "Bourses/grants" — source, date, method,
│       reason, approval doc — are this same concept, one level up.)
│
├── New Idea                             ⚠️ stub — file exists (NewIdea.tsx) but unrouted, v1-shaped
├── My Requests                          ❌ stub, no file at all
├── Directory                            ❌ stub, no file — only ever "proposed," never confirmed
├── Notifications                        ❌ stub, no file at all
└── (account box, bottom)
    ├── Account                          ❌ stub
    ├── Settings                         ❌ stub
    └── Logout                           ❌ stub
```

Routes that exist but aren't in the sidebar at all: `/login` (✅ live), `/template` (⚠️ empty
shell preview). Pages on disk with zero route and zero sidebar entry: `Home.tsx`, `About.tsx`
(old marketing pair).

**What Finance buys once built** (your own framing, kept verbatim): for every dirham, always
know — where it came from, why it was spent, who approved it, where the justificatif is,
and which project it's tied to.

### Finance build status: 0%
No DB table, no backend route, no page, no form, no document upload anywhere in the repo.
The only "finance" that exists today is 4 dead sidebar links and two hardcoded numbers on
Overview's stat cards (`2.4M MAD` / `1.1M MAD` in `GlobalStats.tsx`) plus a flat
`moneyRaised`/`moneyNeeded` pair per mock project in `ProjectBoard.tsx` (just enough for a
progress bar — no transactions, no dates, no documents, no approval).

---

## 2. Board → Projects (+ Events) — from `README-IDEA-V2.md` §1/§4 + Excalidraw

```
📂 Projects (+ Events)
├── Overview        — all projects, filterable by status / department / intern-extern
├── Project detail  — idea/description, document, requirements, members, sponsors,
│                      owners, status, progress %
├── Create project  — global or per-department; intern or extern; sponsor +
│                      member-limit rules enforced at creation
├── Approval pipeline — status stages leading to "approved," then moves to the next board
└── Events          — noted as "the forgotten piece," ties into projects
                       (exact relationship still an open question)
```

Project status model (Excalidraw, cut off mid-note but captured as-is): **open / closed**,
and within a status there's the ability to **join** — i.e. a request-to-join action,
carrying the same shape as the old collab-request concept from `README-IDEA.md`.

Two project types — **intern** / **extern** — both need, to be approved:
- at least one sponsor, and
- a member-limit rule.

### Build status: partial UI mock, no backend
`Overview.tsx` + `ProjectBoard.tsx` already render this shape (intern/extern pills, Draft/
Submitted/Approved tabs, sponsors, members, money bars) — but it's all mock array data in
`ProjectBoard.tsx`, no backend, no create-project form, no approval pipeline logic, no
Events link.

---

## 3. New Idea — v1 concept (`README-IDEA.md` §5), likely superseded

Idea fields: Name (internal), Title (public), Description, Founder(s) + co-founders, Open
to collaboration? (yes/no), Department + jiha tag(s), Project PDF (**locked**), Contact
info (**locked**).

**Lock rule:** regular members see only public fields + a "request to collaborate" button.
PDF + contact unlock for an approved collaborator, and are *always* visible to founder(s),
regional coordinator, national dept lead, and leadership — even without founder approval.
Stays locked even after approval (no auto-generated public case-study version, for now).

⚠️ **Open conflict, not yet reconciled:** `README-IDEA-V2.md` §0 explicitly pivots away
from this jiha-based idea lifecycle toward the department/Project model in §2 above. This
sidebar item's whole concept may be obsolete — flagged here, not resolved (you said to
hold off touching the sidebar for now).

### Build status
`NewIdea.tsx` file exists (v1-shaped form), not routed, not reconciled with the Project
model.

---

## 4. My Requests — `PLATFORM-SECTIONS.md` §3 row 5

Outgoing collab requests the viewer sent, plus incoming ones if they're a founder.

### Build status
Only the button exists (`CollabRequestButton.tsx`) — no list view of any kind.

---

## 5. Directory — `PLATFORM-SECTIONS.md` §3, "proposed, not confirmed"

Browse departments × jihat × members — answers the "nobody knows who owns what" problem
from `README-IDEA.md` §1, but was never explicitly signed off as in-scope.

### Build status: ❌ nothing, and not even confirmed as wanted.

---

## 6. Notifications — `PLATFORM-SECTIONS.md` §3 row 9

Collab request updates, stage changes.

### Build status: ❌ nothing.

---

## 7. Account / Settings / Logout — `PLATFORM-SECTIONS.md` §3 row 10

Own info, department/jiha membership, language — conceptually backed by
`AuthContext.tsx`, but no Settings page exists.

---

## 8. Header / auth-state logic — Excalidraw board, matches `README-IDEA-V2.md` §6

- **Two states everywhere:** before-login and after-login. Protected sections hidden
  entirely pre-login.
- **Two separate header components:**
  1. **Primary/main header** — rendered on the pen artwork, top-level section nav.
  2. **Secondary header** — not on the pen, lives inside each section for sub-nav (e.g.
     inside Invoices/Payments: sub-nav for money in / money out / project-raised money).
     This is exactly the pill-style `SectionNav` component already built and currently
     previewed on Overview.
- **Teaser-snapshot pattern** — applies to KPI tiles/charts (not the header): show a live
  snapshot from the protected route even logged out; clicking one for full detail requires
  login. Header nav items are simpler — just hidden pre-login, no teaser behavior.
- Candidate authenticated-dashboard KPIs: current balance, total income, total expenses,
  active projects, grants, payment/due notifications. Since finance is hidden pre-login
  entirely, the public teaser set would have to draw from project-side KPIs instead
  (which ones, still open).

---

## 9. Roles — `README-IDEA.md` §3 (status unclear after the v2 pivot)

| Role | Scope |
|---|---|
| Member | one department, one jiha |
| Regional coordinator (منسق) | one department, one jiha |
| National department lead (ممثل) | one department, all jihat |
| National leadership | everything |

⚠️ `README-IDEA-V2.md` never explicitly redefined roles for the department-first model —
open question whether this 4-tier table still applies as-is.

---

## 10. Explicitly deferred / out of scope (`README-IDEA-V2.md`, "Note on a pasted feature list")

- **AI** — pillar 3, deferred on purpose.
- Member management as its own domain (cards, subscriptions, attendance, committees) —
  members have only ever been a field on a project.
- A standalone Documents domain (bylaws, meeting minutes, contracts) beyond the project
  document + finance factures already listed here.
- International-standards/security role block (Président/Trésorier/Comptable, audit log,
  backups, encryption, 2FA) — conflicts with the Member/Coordinator/National-lead model
  and needs its own explicit reconciliation, not a silent merge.

---

## 11. Found but unrelated — flagging, not included above

The same Excalidraw canvas also has a cluster of notes about a Python "node registry"
refactor (`Base.py`, `Factory.py`, `Generic_node.py`, `Register.py`, an `@register_node`
decorator, `BaseNode`/`Component`/`LCModelComponent` classes, deduplicating 7+ places
declaring the same node). That's unrelated to this platform — reads like notes from a
different coding project sharing the same whiteboard. Left out of the tree above; flagging
in case it landed on the wrong canvas.
