---
slug: eu-ai-act-draft-high-risk-classification-guidelines
title: "EU AI Act — Draft High-Risk Classification Guidelines"
date: 2026-04-20
tags: verdict, ai, law, regulation, european-union
summary: The EU AI Office published draft guidelines for high-risk AI classification, clarifying the Annex III boundary.
form: article
verdictId: 6
---

## What Happened

On 20 April 2026, the EU AI Office published for public consultation its draft implementing guidelines on the application of the high-risk classification criteria under Article 6(1) of the EU AI Act. The guidelines — 78 pages of worked examples, decision trees, and jurisdictional analysis — were the most detailed regulatory guidance produced by any AI jurisdiction globally. The consultation ran for 12 weeks, closing 13 July 2026, with final guidelines expected in Q3 2026.

The core question the guidelines addressed was a persistent source of legal uncertainty: when does an AI system fall within Annex III (the high-risk use case list), and when does it remain in the limited- or minimal-risk categories? Annex III lists eight domains — education, employment, essential services, financial, healthcare, law enforcement, migration, and administration of justice — but the boundaries between these categories were ambiguous in the original regulation. A recruitment AI system that screens CVs and a credit-scoring AI system that assesses loan eligibility are both clearly high-risk. But what about an AI system that suggests professional development content based on an employee's performance data? Or an AI system that flags potentially fraudulent transactions but does not make the final decision?

The guidelines introduced a "primary purpose" test: an AI system is high-risk if its primary purpose falls within Annex III, even if the system has secondary functions outside Annex III. If a system has multiple purposes, the classification applies to the AI system as a whole if the primary purpose is listed. Systems whose primary purpose is not in Annex III remain in their applicable risk tier even if they incidentally touch on Annex III domains.

## Legal Mechanism

EU AI Act implementing guidelines are non-binding but carry significant practical weight. Under the Act's conformity assessment framework, notified bodies are required to "have regard to" the guidelines when assessing whether a system falls within Annex III. A company whose AI system is assessed as non-high-risk by a notified body — contrary to the guidelines' prescription — would face significant enforcement risk if the AI Office subsequently determined the classification was incorrect. The guidelines therefore operate as *de facto* binding standards, even without formal legal force.

The primary purpose test is the most operationally significant interpretative choice in the document. It provides more certainty than the original Act's "directly related to" test — language in the recitals that had been interpreted broadly by some notified bodies, leading to concerns that the high-risk classification was being applied to systems whose AI component was ancillary to a non-regulated primary activity. The guidelines correct this by requiring that the high-risk use case be the system's deliberate design objective, not merely an incidental application.

## Economic and Market Implications

The guidelines' effect on EU AI market structure is primarily clarifying rather than restrictive. By narrowing the scope of the primary purpose test, they likely reduce the number of AI systems classified as high-risk compared to the pre-guideline interpretive approach. The EU AI Office estimates that the clarification will reclassify approximately 15–20% of AI systems previously assessed as high-risk into the limited-risk category — primarily systems that use AI for auxiliary functions (analytics, suggestions, search) within products whose primary purpose is not in Annex III.

For companies that have been building compliance programs around the broader "directly related to" interpretation, the primary purpose test requires a reassessment of classification conclusions and potentially a revision of conformity assessment timelines. For startups and SMEs — which have disproportionately borne compliance costs for high-risk classification — the narrowing is likely welcome, reducing the scope of mandatory conformity assessments without reducing the quality of the compliance framework for systems that genuinely present high risk.

## Global Context

The publication of the guidelines was closely watched by AI regulators in the UK, Canada, Singapore, and Australia, all of which are developing or consulting on AI risk classification frameworks. The guidelines' worked examples (the "worked example" approach to classification) was explicitly adopted from the UK's FCA approach to Algorithmic Accountability Framework guidance. Singapore's Infocomm Media Development Authority has indicated that the IMDA's forthcoming AI governance guidelines will use a similar decision-tree methodology, harmonised with the EU guidelines where possible to reduce compliance burden for Singaporean firms operating in both jurisdictions.

The US NIST AI Management Framework — last updated in January 2026 — takes a voluntary, tiered approach to AI risk classification, without mandating a specific high-risk category equivalent to Annex III. NIST's framework remains the primary US reference for AI risk management in non-regulated sectors; in regulated sectors (financial services, healthcare, energy), the relevant sector regulator's existing authority governs.

---

## Sources

- https://artificialintelligenceact.eu/high-risk-guidelines/
- https://commission.europa.eu/artificial-intelligence-act_en
- https://www.europarl.europa.eu/legislative-train/theme-europe-fit-for-the-digital-age/file-artificial-intelligence-act

---