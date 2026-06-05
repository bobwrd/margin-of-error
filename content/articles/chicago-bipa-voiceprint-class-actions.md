---
slug: chicago-bipa-voiceprint-class-actions
title: "Chicago — BIPA Voiceprint Class Actions"
date: 2026-03-15
tags: verdict, ai, law, regulation, biometrics, privacy, illinois
summary: Class actions under Illinois' BIPA statute targeted AI companies deploying voice recognition in Chicago workplaces and financial services.
form: article
verdictId: 5
---

## What Happened

Between March and April 2026, three separate class action lawsuits were filed in the Northern District of Illinois alleging that AI companies had violated the Biometric Information Privacy Act (BIPA) — Illinois' landmark 2008 biometric privacy statute — by collecting, storing, and using voiceprints without informed written consent. Two of the suits targeted financial services firms that had deployed AI-powered voice authentication for phone banking and customer identity verification; the third targeted a workplace productivity company whose AI meeting summarisation tool extracted and stored voice biometric data from employee conversations.

BIPA is one of the most plaintiff-friendly privacy statutes in the United States. It requires that private entities collecting biometric identifiers (including retina scans, fingerprints, voiceprints, and face geometry) obtain informed written consent before collection, specify the purpose and length of storage, and prohibit the sale or disclosure of biometric data without consent. Violations are actionable at law, with statutory damages of $1,000 per negligent violation and $5,000 per intentional or reckless violation — plus reasonable attorneys' fees.

The three cases involve classes ranging from 12,000 to 340,000 members, placing aggregate exposure in each case between $12 million and $1.7 billion, before accounting for willfulness multipliers.

## Legal Mechanism

The central legal question — whether AI-derived voice embeddings constitute "voiceprints" under BIPA — is unsettled in the Seventh Circuit. BIPA was enacted in 2008, well before modern voice AI systems were commercialised. The statute's definition of "biometric identifier" covers "a retina or iris scan, fingerprint, voiceprint, or scan of hand or face geometry." The question is whether an AI-generated mathematical representation of vocal characteristics (a voice embedding vector) falls within "voiceprint."

The defendants' primary argument is that a voice embedding is a mathematical abstraction — a vector of floating-point numbers — rather than a "voiceprint" as the legislature contemplated in 2008. They also argue that the processing occurs on-device or in-memory and is not "stored" in the form BIPA contemplates. Plaintiffs counter that the legislative purpose of BIPA was to prevent the exact risk these technologies create: identification of individuals without consent through physiological characteristics. Both arguments have some support in the case law, but the Seventh Circuit has not yet addressed the specific AI voice embedding question.

## Economic and Market Implications

The stakes are significant for any company deploying voice AI in Illinois or serving Illinois residents. BIPA's jurisdiction is not limited to companies headquartered in Illinois — it applies to any entity that collects biometric information from Illinois residents. This extraterritorial reach has made BIPA the de facto national standard for biometric consent compliance: most major companies have adopted BIPA-compliant consent flows (informed written consent, purpose disclosure, retention policies) for all US users because the cost of maintaining two separate compliance frameworks exceeds the cost of full compliance.

The Illinois Supreme Court's 2025 ruling in *Thornley v. Clearview AI* — which held that Clearview AI's scraping of Illinois residents' facial geometry from public photographs constituted a BIPA violation even where images were publicly accessible — suggests that the court takes a broad view of BIPA's protective purpose. If the same interpretive approach applies to voice embeddings, the financial services and enterprise software sectors face substantial retroactive liability exposure.

## Global Context

BIPA's consent-and-disclosure framework has influenced state-level biometric privacy legislation nationwide. Texas, Washington, and California have enacted similar (though less plaintiff-friendly) biometric privacy statutes. At the federal level, no comprehensive biometric privacy law exists. The FTC has applied its Section 5 authority to biometric data practices, but has not issued rules specifically addressing voice biometrics. The EU AI Act's provisions on biometric categorisation (Article 5(1)(b), prohibiting real-time remote biometric identification in public spaces) operate in a fundamentally different regulatory register — risk-prohibition rather than consent-disclosure — making direct comparison difficult.

---

## Sources

- https://ilga.gov/legislation/publicacts/fulltext.asp?name=095-0854
- https://www.iapp.org/resources/analysis/bipa-litigation-update-2026/
- https://www.classaction.org/2026/03/chicago-voiceprint-bipa-class-action/

---