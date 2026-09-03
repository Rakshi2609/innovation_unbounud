# Consumer Lending & Credit Risk Underwriting Policy (v2026.1)

**Policy ID:** POL-LEND-2026.1
**Effective Date:** 2026-01-01
**Review Cycle:** Annual
**Owning Function:** Retail Credit Risk & Policy Office
**Applicable To:** All branches, digital channels, partner network, and BC agents originating consumer credit (unsecured personal loans, credit cards, consumer durable loans, salary advances, BNPL).

This policy consolidates the consumer credit underwriting standards aligned with the RBI Master Directions on the Prudential Framework for Credit Cards, the Fair Practices Code for Lenders, and the Charter of Customer Rights. It defines quantitative and qualitative thresholds, documentation requirements, decision matrices, and escalation pathways. It must be read in conjunction with the Product-Level Credit Policy Addenda and the Hardship Relief & Debt Restructuring Policy (POL-HD-2026).

---

## Section 1: Debt-to-Income (DTI) Ratios and Thresholds

### Clause 1.1 — Standard DTI Limit
**Clause 1.1** The maximum acceptable Debt-to-Income (DTI) ratio for unsecured consumer credit facilities, calculated as the ratio of all monthly fixed obligations (proposed EMI plus existing EMIs and rental outflows) to verified gross monthly income, shall not exceed **45.0%**. All applications above this threshold must be auto-declined unless explicitly approved under Section 6 escalation.

### Clause 1.2 — Elevated Risk Threshold
**Clause 1.2** Any application where the applicant's existing debt obligations exceed **50.0%** of recurring monthly net cash flow shall be classified as **HIGH RISK** and routed to manual underwriter review with a mandatory income re-verification step. The decision outcome must be recorded in the case management system with a documented rationale.

### Clause 1.3 — Distress Warning Trigger
**Clause 1.3** When an active customer reaches a Debt-to-Income ratio above **55.0%** on their aggregate outstanding book, automated hardship monitoring shall be initiated per the Hardship Relief Policy (POL-HD-2026). The credit limit review committee shall not approve incremental unsecured exposure exceeding an additional **2.0%** of sanctioned limit without board-level delinquency committee review.

### Clause 1.4 — Income Definition for DTI
**Clause 1.4** For salaried applicants, gross monthly income is defined as the latest net take-home plus tax-shielded deductions verified through Form 16 / payslip / bank credit traces. For self-employed and informal segment applicants, income is defined per the Gig Worker Cashflow Framework (POL-GIG-2026). Rental income from owned property may be considered up to **85.0%** of declared rent subject to a registered lease agreement or 12 months of bank credits.

### Clause 1.5 — Existing Obligation Enumeration
**Clause 1.5** Existing obligations captured in DTI computation include: active EMIs across all lenders (as reported in CIBIL CIR / Experian / Equifax), rental outflows (declared under Section 26 of the application or bank debit traces), margin lending exposures, BNPL outstanding balances, unsecured internal limits (overdraft, personal loan, credit card utilization), and statutory dues (income tax advance installments).

---

## Section 2: Revolving Credit Utilization Thresholds

### Clause 2.1 — Safe Range
**Clause 2.1** Credit card and revolving credit utilization under **30.0%** of sanctioned limit represents optimal credit management. Customers in this band qualify for pre-approved limit enhancement offers subject to standard risk re-scoring on a 12-month rolling cycle.

### Clause 2.2 — Elevated Utilization
**Clause 2.2** Revolving line utilization between **60.0%** and **80.0%** indicates liquidity pressure and warrants discretionary risk review. No new credit line or limit enhancement may be sanctioned until utilization falls back below **50.0%** for at least two consecutive statement cycles.

### Clause 2.3 — Critical Distress Signal
**Clause 2.3** Revolving credit utilization exceeding **85.0%** combined with more than **1** recent delinquency (30+ DPD in the last 12 months) indicates imminent default risk. Unsecured credit limits shall **not** be increased. Internal risk review must initiate a conversation (IVR / SMS) referring the customer to the financial wellness module and, where applicable, the hardship relief pathway.

### Clause 2.4 — Cash Limit Sub-Limits
**Clause 2.4** For credit cards, the cash withdrawal sub-limit shall not exceed **20.0%** of the overall credit limit and shall carry a separate cash advance fee as published in the MITC (Most Important Terms & Conditions) document. Cash advances trigger interest from transaction date without grace period.

### Clause 2.5 — Overlimit Authorization
**Clause 2.5** Overlimit transactions beyond **105.0%** of sanctioned card limit require explicit OTP-based customer consent. The bank shall not levy overlimit charges exceeding the cap prescribed by RBI from time to time (currently ₹500 per occurrence as amended). Repeat overlimit patterns shall be flagged in the customer risk profile.

---

## Section 3: Responsible Interventions & Documentation Step-Ups

### Clause 3.1 — Documentation Step-Up
**Clause 3.1** Applicants with DTI between **45.0%** and **55.0%** must provide 6 months of verified bank statements (salary credits, fixed obligations trace), 2 years of ITR (if self-employed), asset disclosures (FD, mutual fund, property), and a clean exit-interview summary from their existing lender. Branch managers and underwriters must validate consistency between declared income and bank credit pattern.

### Clause 3.2 — Restructuring Eligibility for Distressed Borrowers
**Clause 3.2** For distressed borrowers experiencing debt spirals (DTI > 70.0% with at least one delinquency), the Loan Committee may approve conversion of high-interest revolving balances into a fixed-rate amortizing personal term loan with maximum tenor of **48 months**, at a rate not exceeding the contractual ceiling for the relevant risk grade. Pre-existing delinquency flags must be cured within 60 days of conversion to qualify for normalized pricing.

### Clause 3.3 — Cooling-Off Periods After Default Cures
**Clause 3.3** Customers who have completed a successful restructuring and remained current for **12** consecutive months may be eligible for incremental unsecured exposure, subject to a fresh credit appraisal and a debt consolidation buffer of at least **5.0%** of monthly income reserved as emergency liquidity.

### Clause 3.4 — Behavioral Risk Signals
**Clause 3.4** The behavioral risk engine shall monitor for the following signals and weight them in credit decisions:
- Increase in cash withdrawal ratio exceeding **40.0%** of total card spend month-on-month.
- Sudden spike in utility, insurance, or tax payment patterns indicative of distress-driven consumption.
- Multiple BNPL / micro-credit originations in a 30-day window (more than **4** distinct lenders).
- Bounce in EMI auto-debit for **2** consecutive months.

Each signal triggers a soft alert; combinations of **3 or more** simultaneous signals route the account to manual underwriting for any new exposure.

---

## Section 4: Approval Authority and Delegation Matrix

| Sanction Limit (₹)         | Approving Authority                | Co-Approval Required         |
|----------------------------|-------------------------------------|-------------------------------|
| Up to 100,000              | Automated Decision Engine (ADE)     | None (rules-based)            |
| 100,001 – 500,000          | Branch Credit Officer               | None                          |
| 500,001 – 2,500,000        | Branch Manager                      | Zonal Credit Officer          |
| 2,500,001 – 10,000,000     | Zonal Credit Head                   | Regional Credit Risk Head     |
| 10,000,001 – 50,000,000    | Regional Credit Risk Head           | National Credit Risk Committee|
| Above 50,000,000           | Executive Credit Committee          | Board Risk Management Committee|

### Clause 4.1 — Automated Decision Engine (ADE)
**Clause 4.1** The ADE may approve up to **₹100,000** for new customers with CIBIL score >= 750, FOIR <= 40.0%, clean recent delinquency record, and KYC + CKYC verified within the last 24 months. Approval decisions must be reproducible and explainable to the customer on request.

### Clause 4.2 — Manual Underwriter Turnaround Time
**Clause 4.2** Manual underwriting turnaround shall not exceed **5** business days from receipt of complete documentation. Incomplete applications shall be auto-reverted within **48 hours** with a checklist of outstanding items.

### Clause 4.3 — Declined Applications and Re-Application Cooling-Off
**Clause 4.3** Declined applicants are eligible to re-apply after a cooling-off period of **30 days** if material circumstances have changed (income, employment, obligation closure). Repeat declines within 90 days from the same PAN/address cluster shall be auto-routed to the dedicated financial wellness outreach program.

---

## Section 5: Pricing, Interest Rates, and Risk-Based Pricing

### Clause 5.1 — Risk-Based Pricing Bands
**Clause 5.1** Interest rates are mapped to internal risk grades (R1–R12). The annual percentage rate (APR) for unsecured personal loans ranges between **9.99%** and **24.99%**; for credit cards, the APR ranges between **24.0%** and **42.0%**, including all fees annualized. The bank shall not charge interest rates in excess of the ceilings prescribed by RBI from time to time.

### Clause 5.2 — No Coerced Cross-Sell
**Clause 5.2** Pricing decisions shall not be conditioned on purchase of unrelated insurance, mutual fund, or investment products. Optional add-on insurance covers must be offered with explicit opt-in consent and an easy opt-out before disbursement.

### Clause 5.3 — Transparent Disclosure
**Clause 5.3** The bank shall disclose, prior to contract execution: annualized rate, processing fee (capped at **2.5%** of sanctioned amount for personal loans and **2.0%** for credit cards), insurance premium (if opted), GST, and total cost of credit. Disclosures must comply with RBI's Key Fact Statement (KFS) standards.

### Clause 5.4 — Rate Reset Triggers
**Clause 5.4** Variable-rate facilities may reset on the bank's reference benchmark (RBLR / MCLR) plus contractual spread. Customers shall receive **30 days** advance notice of any rate increase via SMS, email, and statement notification.

---

## Section 6: Documentation, KYC, and Identity Verification

### Clause 6.1 — Mandatory KYC
**Clause 6.1** All applicants must complete CKYC-compliant identity and address verification before sanction. Aadhaar-based eKYC, video KYC, or in-branch KYC are acceptable channels as per RBI's Master Direction on KYC (updated periodically).

### Clause 6.2 — Income Documentation Tiers
**Clause 6.2** Documentation requirements scale with ticket size and risk band:
- Up to ₹100,000 — last 3 months bank statement; latest payslip or Form 16.
- ₹100,001 – ₹1,000,000 — last 6 months bank statement; 2 latest payslips; employer identity verification.
- Above ₹1,000,000 — 6 months bank statement; 2 years ITR / Form 26AS; employer contactability check; collateral valuation (if applicable).

### Clause 6.3 — Anti-Fraud and Forgery Screening
**Clause 6.3** Every application must clear the following checks: PAN-Aadhaar match (where mandated), CIBIL recent-application overlay, document tampering forensic scan, employer email/phone verification, and device-IP behavioral risk score. Hits trigger manual investigation under SOP-FR-2026.

### Clause 6.4 — Third-Party Data Consent
**Clause 6.4** Customers shall provide explicit, informed, and revocable consent for use of alternative data (utility payments, telecom data, account aggregator-sourced financial information) in credit decisioning. Consent records must be retained for **8 years** from closure of the relationship.

---

## Section 7: Loan-to-Value (LTV) and Collateralized Lending

### Clause 7.1 — Gold Loan LTV
**Clause 7.1** The maximum Loan-to-Value ratio for gold loans shall not exceed **75.0%** of the value as appraised by an internal or empaneled valuer, in line with RBI's revised LTV framework. For bullet repayment loans, margin requirements shall be tightened by an additional **5.0%**.

### Clause 7.2 — Loan Against Property / Securities LTV
**Clause 7.2** Loan Against Property: maximum LTV **65.0%** of the forced-sale-value as determined by the bank's empaneled valuer. Loan Against Securities (equity / mutual fund): maximum LTV **50.0%** of the prevailing market value, subject to a **20.0%** margin call trigger.

### Clause 7.3 — Top-Up Lending Discipline
**Clause 7.3** Top-up loans on existing collateral must not cumulatively exceed the LTV ceilings above. Top-up eligibility requires **24 months** of clean repayment history on the existing facility.

---

## Section 8: Co-Borrower and Guarantor Standards

### Clause 8.1 — Eligible Co-Borrowers
**Clause 8.1** Co-borrowers may include spouse, parents (in case of education loans), earning siblings (with documented income), and corporate guarantors. Co-borrower income may be aggregated for DTI calculation only when the co-borrower is also an earning co-applicant on the loan agreement.

### Clause 8.2 — Third-Party Guarantee Limits
**Clause 8.2** A third-party personal guarantee may be accepted for exposures above ₹2,500,000 with due diligence on the guarantor's net worth (minimum 2x the guaranteed amount). Guarantees shall be evidenced by a registered guarantee deed.

### Clause 8.3 — Spouse as Co-Borrower (Policy Default)
**Clause 8.3** For family-income underwritten home loans and personal loans above ₹500,000, the spouse may be considered as a co-borrower by default unless explicitly waived by the underwriter with documented justification (legal separation, NRI spouse, etc.).

---

## Section 9: NRI / Foreign Currency Borrowers

### Clause 9.1 — Eligibility
**Clause 9.1** NRIs holding Indian passports with valid employment / residence permits abroad are eligible for INR-denominated loans subject to FEMA regulations. Repayment must be received through NRE / NRO accounts via authorized dealer channels.

### Clause 9.2 — Income Verification
**Clause 9.2** NRI income shall be verified through employer certificates, payslips, and 6-month foreign-currency bank statements attested by the foreign bank's compliance officer or Indian embassy. Foreign-currency income shall be converted at the bank's prevailing TT buying rate for DTI computation.

### Clause 9.3 — Repatriation Compliance
**Clause 9.3** For NRI loans, repayment and foreclosure must comply with RBI's repatriation norms. Foreign currency risk, where applicable, is borne by the borrower unless explicitly hedged through approved derivative products.

---

## Section 10: Vulnerable Customer and Accessibility Provisions

### Clause 10.1 — Senior Citizen and Differently-Abled Borrowers
**Clause 10.1** Senior citizens (aged 60+) and customers registered under the Differently-Abled Category shall be offered:
- Simplified application documentation on request.
- Priority branch service and doorstep documentation collection for ticket sizes up to ₹500,000.
- No discriminatory pricing — risk-based pricing applies uniformly.
- Assisted digital onboarding via video KYC with caregiver participation.

### Clause 10.2 — Rural and Tier-3 / Tier-6 Branches
**Clause 10.2** Rural and small-town customers shall be onboarded through BC (Business Correspondent) channels with biometric eKYC. Loan origination rules may be calibrated to local cashflow realities per the Gig Worker Framework (POL-GIG-2026).

### Clause 10.3 — Linguistic Inclusion
**Clause 10.3** All disclosures, sanction letters, loan agreements, and grievance communications shall be made available in English and at least one regional language of the customer's state. Vernacular customer service is available through the multilingual helpline.

---

## Section 11: Grievance Redressal and Internal Ombudsman

### Clause 11.1 — Tiered Grievance Process
**Clause 11.1** Customer complaints shall be acknowledged within **2 business days** and resolved within **30 days** of receipt. Escalation matrix:
1. Branch Credit Officer → 3 days
2. Branch Manager → 7 days
3. Zonal Credit Head → 14 days
4. Nodal Officer → 21 days
5. Internal Ombudsman → 30 days

### Clause 11.2 — RBI Banking Ombudsman
**Clause 11.2** Customers unsatisfied with the bank's internal redressal may approach the RBI Banking Ombudsman in whose jurisdiction their branch falls. The bank shall comply with Ombudsman awards within **30 days** of receipt.

### Clause 11.3 — Reporting and Audit Trail
**Clause 11.3** All underwriting decisions (approve, decline, refer) must be auditable with timestamped rationale, model version, decision engine version, and approver identity. Logs shall be retained for a minimum of **8 years** as required by RBI.

---

## Section 12: Reporting, Audit, and Model Governance

### Clause 12.1 — Monthly Portfolio Monitoring
**Clause 12.1** The retail credit portfolio shall be reviewed monthly for: portfolio-at-risk (PAR 30+, PAR 90+), vintage curves, delinquency concentrations by branch / geography / product, average ticket size, and risk grade distribution. Material deviations trigger a management information note within 5 business days.

### Clause 12.2 — Annual Independent Audit
**Clause 12.2** An independent audit of credit underwriting processes shall be conducted annually, covering at least **10%** of sanctioned accounts stratified by ticket size and risk grade. Audit observations must be remediated within 90 days.

### Clause 12.3 — Model Risk Management
**Clause 12.3** All credit scoring and decisioning models are subject to model governance standards: annual back-testing, discriminatory impact assessment, input drift monitoring, and Out-of-Sample validation. Material deviations require model recalibration and board-level risk committee notification.

### Clause 12.4 — Adverse Action Notice
**Clause 12.4** All declined applications shall receive an adverse action notice within **7 days** stating the principal reason(s) for decline, the bureau(s) consulted, the customer's right to seek a review, and the grievance redressal contact details.

---

## Section 13: Roles, Responsibilities, and Three Lines of Defense

### Clause 13.1 — First Line: Origination and Operations
**Clause 13.1** Sales, branch, and digital channel teams execute underwriting within delegated authority. They own data quality, KYC compliance, and customer communication discipline.

### Clause 13.2 — Second Line: Credit Policy and Risk
**Clause 13.2** The Credit Policy team owns policy formulation, training, exception analytics, and policy exceptions. The Risk Management function owns portfolio monitoring, model governance, and stress testing.

### Clause 13.3 — Third Line: Internal Audit
**Clause 13.3** Internal Audit provides independent assurance on policy adherence, process integrity, and control effectiveness. Audit findings are reported to the Audit Committee of the Board.

---

## Section 14: Exceptions and Waivers

### Clause 14.1 — Standard Exception Governance
**Clause 14.1** Policy exceptions (deviation from DTI, LTV, FOIR, documentation, or pricing ceilings) require documented business justification and must be approved by at least **one level above** the standard sanctioning authority. Exceptions exceeding **5.0%** of portfolio by volume require Risk Committee ratification.

### Clause 14.2 — Repeat Exception Monitoring
**Clause 14.2** Approving authorities with exception rates exceeding **10%** of their sanction volume across any 90-day rolling window shall be subject to a management review and may have their sanction authority temporarily suspended.

### Clause 14.3 — Board Reporting
**Clause 14.3** All exceptions above ₹10,000,000 and any exception rates by product/segment above threshold shall be reported quarterly to the Board Risk Management Committee with trend analysis and remedial actions.

---

## Section 15: Glossary

- **DTI / FOIR:** Debt-to-Income / Fixed Obligations to Income Ratio — used interchangeably in this document to denote the ratio of monthly fixed obligations to monthly gross income.
- **PAR 30+ / PAR 90+:** Portfolio-at-Risk, accounts overdue by 30 / 90 days.
- **DPD:** Days Past Due.
- **RBLR / MCLR:** Repo-Based Lending Rate / Marginal Cost of Funds-based Lending Rate.
- **BC:** Business Correspondent.
- **CIR:** Credit Information Report (CIBIL / Experian / Equifax).
- **CKYC:** Central KYC Records Registry.

---

**Document Metadata:**
Version: 2026.1
Last Updated: 2026-01-01
Owner: Head — Retail Credit Risk & Policy Office
Approved By: Board Risk Management Committee
Next Review Due: 2026-12-31
Classification: Internal — Confidential