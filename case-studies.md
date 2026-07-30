---
title: Case Studies
---

# Case Studies
Real work, not demo projects. Metrics are representative of delivered outcomes.

---

## Built With AI-Assisted Engineering
Most of my new work now gets built using AI-assisted development (Claude Code and similar tools) — it takes a tool from idea to a working, deployed build in days instead of months. That speed is part of what makes the pricing on the [homepage](https://bhowmick2021.github.io/portfolio/) realistic. A note on data handling: your files are never used to train any model, and everything I deliver is reviewed by me personally before it reaches you.

### 🩺 Query Doctor — BigQuery SQL Cost Estimator
* **What it is:** Paste a BigQuery SQL query, get an instant dry-run cost estimate, monthly cost projection, cache-hit rate, a 0–100 optimization score, and AI-generated rewrite suggestions.
* **Stack:** Next.js, Tailwind, FastAPI, Google BigQuery, Docker
* **Status:** Live and deployed — [governance.radixbi.tech](https://governance.radixbi.tech)

### 📊 BigQuery Cost & Spend Dashboards
* **What it is:** Executive dashboards that read BigQuery's own usage metadata to show which queries are driving spend (Pareto view, KPIs, drill-down), with AI-generated optimization tips.
* **Stack:** FastAPI, BigQuery INFORMATION_SCHEMA, GPT-4o / Gemini
* **Status:** Live and deployed

### 💰 Recurring Cloud-Cost Audit
* **What it is:** An automated monthly audit pipeline that scans BigQuery storage and query patterns and writes findings straight to a Google Sheet.
* **Outcome:** One April 2026 run identified 566 wasteful storage clusters (10.5 TB) and **$368/month ($4,416/year) in cloud-cost savings opportunities** — a real, traceable finding from the tool, not a projection.

---

## Quick-Turnaround Data Jobs (10–15 day builds)
The kind of scoped, "get this data usable fast" work I'm taking on now — multi-format ingestion, cleanup, automation, and stable datasets for outside vendors and partners.

### 🧩 Pandalytics
* **About:** Data analytics platform offering business intelligence APIs.
* **Tools:** Cloud Functions, BigQuery
* **Outcome:** Integrated nested JSON data into GCP and BigQuery, enabling analytics-ready dashboards.

### 🌐 Similarweb
* **About:** Market intelligence platform offering traffic and engagement insights.
* **Tools:** Python, BigQuery, Cloud Scheduler
* **Outcome:** Automated cohort generation and dashboard updates on a weekly cadence.

### 🗂️ DataProvider
* **About:** Global web data provider delivering structured business intelligence datasets.
* **Tools:** Cloud Storage, BigQuery Views
* **Outcome:** Merged monthly snapshots into dynamic views for seamless dashboard integration.

### 📑 Abuse & Compliance
* **About:** Third-party security and audit service for digital compliance reporting.
* **Tools:** Cloud Functions, BigQuery
* **Outcome:** Created compliance-ready reference datasets with document proofing capabilities.

### 🌐 DNSLookup
* **About:** DNS intelligence service offering real-time and historical DNS datasets.
* **Tools:** Cloud Storage, BigQuery
* **Outcome:** Stored and optimized DNS data for scalable, big-data consumption.

### 🔍 Namify
* **About:** AI-powered domain name generator and branding platform.
* **Tools:** BigQuery, Cloud Functions
* **Outcome:** Powered real-time domain name recommendations for Namify's platform.

### 🌐 ICANN Zone Data
* **About:** Public registry of top-level domain zone files managed by ICANN.
* **Tools:** Cloud Scheduler, Workflows, BigQuery
* **Outcome:** Automated daily ingestion of ICANN zone files for monitoring and reporting.

---

## Bigger Platform Work (When Projects Scale Up)
The enterprise-scale side of my day job — for reference, if your project ever grows past a spreadsheet or a small database.

### 1) BigQuery Migration + Cost Optimization
**Theme:** Cloud modernization + FinOps discipline
**Stack:** GCP · BigQuery · SQL · Tableau

**Situation:** Legacy on-premise infrastructure and mixed query patterns led to slow delivery and unpredictable costs.

**What I did**
- Architected and executed the migration from on-premise to BigQuery
- Designed migration governance — rollout planning, rollback strategy, change management
- Introduced partitioning, clustering, and query tuning after the move
- Added spend visibility, cost attribution, and anomaly-detection alerting

**Outcomes**
- 💸 30% lower infrastructure and query cost, 25% better platform availability — with **zero production disruption**
- ⏱️ A further 40% cut in reporting latency once partitioning/clustering and FinOps guardrails were rolled out
- 🧭 $50K+ in annual cloud savings sustained through ongoing cost controls

---

### 2) Technical Debt Reduction + Platform Modernization
**Theme:** Reliability + clarity + ownership
**Stack:** BigQuery · Tableau · Governance

**Situation:** Years of incremental BI growth caused duplicated logic, fragmented pipelines, and maintenance drag.

**What I did**
- Audited pipelines, scheduled queries, extracts, and "who owns what"
- Standardized datasets and conventions (naming, lifecycle, documentation)
- Implemented performance policies and quality scorecards

**Outcomes**
- 📉 Lower compute waste via lifecycle policies and optimization patterns
- ✅ Better reliability and less surprise breakage across reporting

---

### 3) Self-Serve BI Platform Launch
**Theme:** Reduce ad-hoc load, improve adoption
**Stack:** GCP · BigQuery · Tableau

**Situation:** Central BI teams were overloaded with recurring questions and custom extracts.

**What I did**
- Built governed shared datasets and a BI hub
- Defined access patterns and documentation
- Created repeatable onboarding so teams could self-serve

**Outcomes**
- 🙅 50% reduction in ad-hoc reporting requests
- ⚡ Faster insight turnaround and higher adoption — enterprise BI adoption up 50% across India, APAC and Europe

---

### 4) BI Extract Monitoring + Alert Automation
**Theme:** Operational BI reliability
**Stack:** BigQuery metadata · n8n · Tableau

**Situation:** Extract failures and stale dashboards created downtime and invisible data drift.

**What I did**
- Built monitoring signals from metadata and usage patterns
- Automated alerting and routing (team-appropriate notifications)
- Reduced manual chasing and improved response time

**Outcomes**
- 🛠️ Lower incident load and faster detection (reported improvements in downtime reduction)

---

### 5) AI-Powered Industry News Automation
**Theme:** Internal enablement via automation
**Stack:** n8n · LLM summarization · Slack/email

**Situation:** Stakeholders needed a daily signal without manual curation.

**What I did**
- Aggregated sources, summarized, tagged, and distributed updates
- Owned orchestration, scheduling, and delivery pipeline

**Outcomes**
- 🧠 Reduced manual curation effort (reported ~90%)
