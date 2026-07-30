# -*- coding: utf-8 -*-
from reportlab.lib.pagesizes import letter
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, ListFlowable, ListItem
from reportlab.lib.colors import HexColor

NAVY = HexColor("#0F2144")
TEAL = HexColor("#0284C7")
TEXT = HexColor("#1E293B")
MUTED = HexColor("#64748B")

doc = SimpleDocTemplate(
    "Abhijeet_Bhowmick_Resume.pdf",
    pagesize=letter,
    topMargin=0.55 * inch,
    bottomMargin=0.55 * inch,
    leftMargin=0.65 * inch,
    rightMargin=0.65 * inch,
)

styles = getSampleStyleSheet()

name_style = ParagraphStyle("Name", parent=styles["Title"], fontName="Helvetica-Bold",
                            fontSize=20, leading=24, textColor=NAVY, alignment=TA_CENTER, spaceAfter=2)
title_style = ParagraphStyle("JobTitle", parent=styles["Normal"], fontName="Helvetica",
                             fontSize=11.5, leading=14, textColor=TEAL, alignment=TA_CENTER, spaceAfter=4)
contact_style = ParagraphStyle("Contact", parent=styles["Normal"], fontName="Helvetica",
                               fontSize=9, leading=12, textColor=MUTED, alignment=TA_CENTER, spaceAfter=2)
section_style = ParagraphStyle("Section", parent=styles["Normal"], fontName="Helvetica-Bold",
                               fontSize=11.5, leading=14, textColor=NAVY, spaceBefore=12, spaceAfter=5,
                               borderColor=TEAL, borderWidth=0, borderPadding=0)
body_style = ParagraphStyle("Body", parent=styles["Normal"], fontName="Helvetica",
                            fontSize=9.5, leading=13.5, textColor=TEXT, spaceAfter=6)
bullet_style = ParagraphStyle("Bullet", parent=styles["Normal"], fontName="Helvetica",
                              fontSize=9.5, leading=13, textColor=TEXT)
role_style = ParagraphStyle("Role", parent=styles["Normal"], fontName="Helvetica-Bold",
                            fontSize=10, leading=13, textColor=TEXT, spaceBefore=8, spaceAfter=1)
role_meta_style = ParagraphStyle("RoleMeta", parent=styles["Normal"], fontName="Helvetica-Oblique",
                                 fontSize=9, leading=12, textColor=MUTED, spaceAfter=4)

def bullets(items):
    return ListFlowable(
        [ListItem(Paragraph(t, bullet_style), bulletColor=TEAL, value="circle", leftIndent=6) for t in items],
        bulletType="bullet", start="circle", leftIndent=14, bulletFontSize=6, spaceBefore=2, spaceAfter=6,
    )

story = []

story.append(Paragraph("ABHIJEET BHOWMICK", name_style))
story.append(Paragraph("Enterprise Data Platform &amp; Cloud Governance Leader", title_style))
story.append(Paragraph(
    "Mumbai, Maharashtra, India &nbsp;|&nbsp; +91 8108932139 &nbsp;|&nbsp; bhowmick2021@gmail.com",
    contact_style))
story.append(Paragraph(
    "linkedin.com/in/abhijeetbhowmick &nbsp;|&nbsp; bhowmick2021.github.io/portfolio",
    contact_style))
story.append(Spacer(1, 6))

story.append(Paragraph("PROFESSIONAL SUMMARY", section_style))
story.append(Paragraph(
    "Enterprise Data Platform &amp; Cloud Governance leader with <b>19 years</b> of experience building, "
    "modernizing and governing large-scale analytics platforms across Google Cloud. Specializes in "
    "<b>AI-ready data architecture</b> that balances innovation with governance &mdash; enabling engineering "
    "and business teams to move faster without compromising security, reliability, or cloud cost. Deep "
    "expertise in BigQuery, GCP, SQL, Python and dbt, with a growing focus on AI-assisted operational "
    "automation using n8n and self-hosted LLM infrastructure.",
    body_style))

story.append(Paragraph("CORE TECHNICAL SKILLS", section_style))
story.append(bullets([
    "<b>Cloud &amp; Data Stack:</b> GCP, BigQuery, Dataflow, Cloud Composer",
    "<b>Languages &amp; Tools:</b> SQL, Python, dbt, Git, n8n, Docker, Ollama",
    "<b>Data Architecture:</b> ETL/ELT Design, Data Modeling, Partitioning &amp; Clustering, Schema Optimization",
    "<b>BI &amp; Analytics:</b> Tableau, Looker Studio, KPI Frameworks, Executive Dashboards",
    "<b>Governance &amp; FinOps:</b> IAM &amp; Access Governance, Metadata &amp; Lineage, Cost Optimization, Platform Observability",
    "<b>Automation &amp; AI:</b> n8n + self-hosted LLM workflows, AI-assisted operational automation",
]))

story.append(Paragraph("SELECTED BUSINESS IMPACT", section_style))
story.append(bullets([
    "Reduced BigQuery reporting latency by <b>40%</b> through partitioning, clustering and performance guardrails",
    "Reduced cloud infrastructure and query costs by <b>30%</b> via enterprise BigQuery migration",
    "Delivered <b>$50K+</b> in annual cloud savings through FinOps governance initiatives",
    "Increased enterprise BI adoption by <b>50%</b> across India, APAC and Europe",
    "Led enterprise cloud modernization with <b>zero production disruption</b>",
]))

story.append(Paragraph("PROFESSIONAL EXPERIENCE", section_style))

def role(title_line, meta_line, items):
    story.append(Paragraph(title_line, role_style))
    story.append(Paragraph(meta_line, role_meta_style))
    story.append(bullets(items))

role("Manager &mdash; Data &amp; BI Platforms", "Radix &middot; India &middot; Jul 2022 &ndash; Present", [
    "Own the enterprise Google Cloud data platform powering analytics, reporting and AI-ready data capabilities across India, APAC and Europe.",
    "Define and execute enterprise platform strategy across GCP, BigQuery, IAM, metadata, data lineage and lifecycle governance.",
    "Lead Cloud FinOps initiatives &mdash; query optimization, cost attribution, anomaly detection &mdash; delivering $50K+ in annual cloud savings.",
    "Modernized BigQuery architecture through partitioning, clustering and performance guardrails, reducing reporting latency by 40%.",
    "Built enterprise-wide governance covering metadata, auditability, data quality, lifecycle management and secure access for analytics and AI workloads.",
    "Increased enterprise BI adoption by 50% through scalable self-service analytics and platform enablement.",
])

role("Sr. Lead &mdash; BI Tech", "Radix &middot; Mumbai, India &middot; Jun 2020 &ndash; Jul 2022", [
    "Led the organization's transformation from legacy on-premise analytics infrastructure to Google Cloud.",
    "Architected and executed enterprise migration to BigQuery, reducing infrastructure and query costs by 30% while improving platform availability by 25%.",
    "Designed migration governance &mdash; rollout planning, rollback strategy, change management &mdash; delivering zero production disruption.",
    "Standardized ETL architecture, data modeling and access governance, reducing enterprise data access time by 50%.",
])

role("Sr Team Lead &mdash; Application Development", "Radix &middot; Mumbai, India &middot; Oct 2016 &ndash; Jun 2020", [
    "Designed scalable internal platforms that standardized reporting logic across multiple business units.",
    "Integrated analytics into operational systems, enabling usage tracking and data-driven prioritization.",
    "Built automation frameworks reducing manual operational effort by 25%.",
])

role("Business Intelligence Team Lead", "Radix &middot; Mumbai, India &middot; May 2015 &ndash; Oct 2016", [
    "Designed centralized BI reporting architecture, improving reporting accuracy and stakeholder confidence.",
    "Reduced ad hoc reporting requests by 50% through scalable dashboard ecosystems.",
    "Defined KPI governance with Product and Finance leadership; improved reporting turnaround by 30%.",
])

role("Senior Analyst &mdash; Business Intelligence", "Directi Group &middot; Mumbai &middot; Jan 2012 &ndash; May 2015", [
    "Developed Radix360, a client growth and adoption analytics platform &mdash; 20% improvement in customer retention.",
    "Built Directi360, an enterprise BI portal that reduced reporting turnaround by 40%.",
    "Automated recurring reporting processes, reducing manual effort by 60%.",
])

role("Business Intelligence &amp; Development", "LogicBoxes (The Directi Group) &middot; Mumbai &middot; Jun 2010 &ndash; Jan 2012", [
    "Designed and launched the LB360 analytics portal supporting 100+ internal users.",
    "Automated MIS reporting and operational tracking, improving accuracy and turnaround.",
])

role("Earlier Roles", "Business Operations Liaison &middot; Mphasis &middot; Sutherland Global Services &middot; Mumbai &middot; 2006 &ndash; 2010", [
    "Client onboarding coordination, enterprise infrastructure support and production support across Product, Finance and BI teams &mdash; the operational foundation behind later platform and governance work.",
])

story.append(Paragraph("CERTIFICATIONS", section_style))
story.append(bullets([
    "Google AI Essentials &mdash; Google (2024)",
    "Foundations: Data, Data, Everywhere &mdash; Google",
    "Stakeholder Management &mdash; LinkedIn Learning",
    "Red Hat Certified Engineer (RHCE) &mdash; Red Hat (2009)",
]))

story.append(Paragraph("EDUCATION", section_style))
story.append(bullets([
    "B.Com &mdash; University of Mumbai",
    "Computer Diploma (GNIIT Futurz) &mdash; NIIT",
]))

story.append(Paragraph("LANGUAGES", section_style))
story.append(Paragraph("Hindi (Full Professional) &middot; English (Full Professional) &middot; Bengali (Limited Working)", body_style))

doc.build(story)
print("done")
