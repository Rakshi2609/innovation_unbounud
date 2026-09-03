# Digital Banking Fraud Prevention & Account Takeover SOP (SOP-FR-2026)

**Policy ID:** SOP-FR-2026
**Effective Date:** 2026-01-01
**Review Cycle:** Semi-Annual
**Owning Function:** Financial Crime Operations (FCO) & Information Security
**Applicable To:** All digital channels — mobile banking, internet banking, UPI, card-not-present (CNP) transactions, ATM, POS, and contact-center-assisted transactions. This SOP binds the bank's internal product, engineering, risk, and operations teams as well as partner ecosystem (merchants, payment aggregators, BC agents, fintech integrators).

This SOP implements the RBI Master Direction on Digital Lending, the Reserve Bank's Cybersecurity Framework for Banks, the Payment and Settlement Systems Act, and the regulatory guidance on digital fraud prevention issued from time to time. It defines device-trust, behavioral, transactional, and human-interaction controls to prevent, detect, and respond to fraud and account takeover (ATO) incidents.

---

## Section 1: Device Trust and Behavioral Telemetry

### Clause 1.1 — Device Trust Scoring
**Clause 1.1** Digital transactions are evaluated by behavioral telemetry yielding a **Device Trust Score** between **0.00 and 1.00**. The score is a composite of: device fingerprint uniqueness, historical association with the customer, IP geolocation vs. customer address, biometric match (where available), behavioral biometrics (typing rhythm, swipe pattern), and network trust (known VPN / Tor / proxy exit nodes).

### Clause 1.2 — High-Risk Anomaly Trigger
**Clause 1.2** Any transaction initiated from a **new device ID, unmapped IP address, or known VPN proxy** with a Device Trust Score below **0.30** requires immediate **Step-Up Biometric Authentication** or **Out-of-Band SMS/IVR Verification**. A 60-second soft-block window applies for out-of-band confirmation.

### Clause 1.3 — Critical Freeze Action
**Clause 1.3** Transactions exceeding **₹50,000** with a Device Trust Score below **0.20** originating from high-risk merchant categories (crypto exchanges, gift card aggregators, wire remittors, forex brokers, online casinos / gaming) must be temporarily held pending verbal human confirmation. The customer safety team shall complete confirmation within **15 minutes** before transaction expiry.

### Clause 1.4 — Continuous Authentication
**Clause 1.4** For sessions lasting more than 10 minutes, the system shall re-evaluate trust on the basis of in-session behavior. Sudden deviations (rapid transaction bursts, change in typing rhythm, simultaneous logins from geographically distant IPs) trigger re-authentication.

### Clause 1.5 — Rooted / Jailbroken Device Flag
**Clause 1.5** Transactions from rooted (Android) or jailbroken (iOS) devices shall be processed only with step-up authentication and a reduced session value cap. Limits are tier-defined by risk team and re-evaluated quarterly.

### Clause 1.6 — SIM Swap and Device Swap Detection
**Clause 1.6** The system shall, where telecom signal is available, detect SIM swap events in the prior **48 hours** and require biometric re-authentication before processing high-value transactions. Device swap signals (new IMEI association) follow the same protocol.

---

## Section 2: Protection of Vulnerable and Senior Customers

### Clause 2.1 — Senior Citizen Account Safeguards
**Clause 2.1** For account holders aged **60+** or flagged under the **vulnerable customer registry**, any single transfer exceeding **40.0%** of average monthly liquid savings must trigger a mandatory cooldown period of **2 hours**. The customer receives an SMS notification and may cancel the transfer during the cooldown.

### Clause 2.2 — Coercion and Impersonation Verification
**Clause 2.2** When an elderly customer attempts an unprecedented high-value outward transfer following prolonged phone activity, the customer safety team must verify against known **remote-access / police impersonation scam scripts**. Verification includes callback to the registered mobile number (not the calling number), a question on a previously agreed safe word, and an offer to escalate to in-branch confirmation.

### Clause 2.3 — Cooling-Off on New Payee Activation
**Clause 2.3** Newly added payees for senior and vulnerable customers carry a **24-hour cooling-off period** before the first transfer above ₹10,000 is permitted. Cooling-off may be overridden only with video branch-callback confirmation.

### Clause 2.4 — Caregiver / Trusted Contact Registration
**Clause 2.4** Senior and vulnerable customers may register up to two trusted contacts (with consent). The system informs trusted contacts of high-value transfers but does not seek their approval — preserving customer autonomy while providing an early-warning channel.

### Clause 2.5 — Differently-Abled and PwD Customers
**Clause 2.5** Customers with registered visual / hearing impairment are entitled to: voice-only IVR, larger-font UIs, screen-reader compatibility, and the right to nominate a caregiver jointly on the account with full audit trail of caregiver actions.

---

## Section 3: Transaction Monitoring, Velocity, and Value Limits

### Clause 3.1 — Velocity Limits by Channel
**Clause 3.1** Velocity limits apply per customer per channel per 24-hour rolling window:

| Channel                 | Default Cap (₹) | Step-Up Auth Cap (₹) |
|-------------------------|-----------------|----------------------|
| UPI P2P                 | 100,000         | 250,000              |
| UPI P2M (merchant)      | 200,000         | 500,000              |
| IMPS                    | 500,000         | 1,000,000            |
| NEFT / RTGS             | No cap (subject to step-up auth > ₹10L) | n/a |
| Card-not-present (CNP)  | 250,000         | 500,000              |
| ATM cash withdrawal     | 25,000 (per txn) / 100,000 (per day) | 100,000 / 200,000 |

### Clause 3.2 — High-Risk MCC Allowlist
**Clause 3.2** Card transactions on merchant category codes (MCC) classified as high-risk (6051, 7995, 4829, 5933, 7994, 5967, 5966) require explicit customer opt-in with a 7-day cooling-off. Subsequent transactions within the opt-in are processed with no further friction but are logged for analytics.

### Clause 3.3 — Burst Detection
**Clause 3.3** More than **5** transactions in any **5-minute** window from the same session, or more than **10** failed login attempts in **30 minutes**, triggers an automatic soft lock requiring re-authentication and a fraud-team alert.

### Clause 3.4 — Card Velocity and Geography Rules
**Clause 3.4** Card-not-present transactions from IPs geolocated >2,000 km from the cardholder's registered city, without a recent travel declaration, trigger step-up authentication and a customer notification.

---

## Section 4: Account Takeover (ATO) Detection and Response

### Clause 4.1 — ATO Indicators
**Clause 4.1** ATO is suspected when one or more of the following occurs:
- Multiple failed login attempts followed by a successful login from a new device.
- Sudden change in profile (email, mobile, address) followed by a high-value transfer.
- New payee added and transacted within 60 minutes.
- Successful login from an IP associated with a known fraud ring (third-party threat intel).
- Credential stuffing pattern matching across multiple customer IDs.

### Clause 4.2 — ATO Containment Actions
**Clause 4.2** Upon ATO detection, the system shall immediately:
1. Lock the affected session and require step-up authentication.
2. Freeze outbound transfers for **30 minutes** pending human review.
3. Notify the customer via SMS, email, and in-app push.
4. Open a fraud case in the case management system with high priority.
5. Preserve forensic logs for **8 years**.

### Clause 4.3 — Customer Re-Verification
**Clause 4.3** Re-verification to restore access requires a minimum of two of the following: biometric match, video KYC, in-branch visit, CKYC re-validation, or successful knowledge-based authentication using data not present in the breached dataset.

### Clause 4.4 — Post-Incident Reporting
**Clause 4.4** Material ATO incidents shall be reported to the bank's senior management within **4 hours**, to RBI (under the cyber-incident reporting framework) within the prescribed timeline, and to law enforcement where applicable. A post-incident review (PIR) is conducted within **10 business days**.

---

## Section 5: Authentication Standards

### Clause 5.1 — Two-Factor Authentication (2FA)
**Clause 5.1** All digital transactions above ₹500 (or the threshold prescribed by RBI from time to time) require 2FA. Acceptable factors are: something the customer **knows** (PIN / password), **has** (device, OTP token), or **is** (biometric — fingerprint, face, iris, voice).

### Clause 5.2 — OTP Standards
**Clause 5.2** OTPs are valid for **5 minutes**, single-use, generated using a CSPRNG, and delivered via the registered mobile and email. The bank does not rely solely on SMS-OTP for transactions above ₹100,000 — biometric factor or hardware-token factor is required.

### Clause 5.3 — Biometric Standards
**Clause 5.3** Biometric authentication uses the device's secure enclave (TEE / SE) where possible. Server-side biometric matching is performed using liveness detection and a 1:1 match against CKYC-registered biometric data. Spoof attempts trigger an alert and a 24-hour cooldown.

### Clause 5.4 — Out-of-Band Verification
**Clause 5.4** For risk-flagged transactions, the bank may require out-of-band verification through a callback to the **registered** mobile number. The bank does not call from numbers other than its verified customer-care numbers and never solicits credentials.

### Clause 5.5 — Phishing-Resistant Authentication
**Clause 5.5** High-risk privileged operations (beneficiary registration, password reset, address change) require phishing-resistant authentication: hardware-bound cryptographic key (FIDO2 / passkey) or registered-device biometric plus OTP.

---

## Section 6: Customer Education and Anti-Phishing

### Clause 6.1 — Awareness Content
**Clause 6.1** The bank publishes customer education content covering phishing, vishing, smishing, OTP scams, fake customer-care numbers, fake KYC update messages, and screen-sharing scams. Content is available in 12 Indian languages on the bank's website, app, and social channels.

### Clause 6.2 — Verification Helpers
**Clause 6.2** The bank provides a 24x7 verification channel (chatbot + human) where customers can verify if a message they received is genuine. The bank shall never object to a customer verifying a communication through official channels.

### Clause 6.3 — Customer Reporting Mechanism
**Clause 6.3** Customers may report suspected fraud through:
- The "Report Fraud" tile in the mobile app.
- A dedicated toll-free number.
- Email to the fraud response inbox.
- Branch walk-in to the Customer Care desk.

Reports trigger immediate containment per Clause 4.2 if the report is credible.

---

## Section 7: Merchant and Partner Ecosystem Controls

### Clause 7.1 — Merchant Onboarding
**Clause 7.1** All merchants accepting the bank's payment instruments are onboarded through a risk-tiered due diligence process. High-risk MCC merchants require enhanced due diligence (EDD), beneficial ownership verification, and a higher reserve / holdback percentage.

### Clause 7.2 — Transaction Monitoring at Acquirer Level
**Clause 7.2** The acquirer-side monitoring system flags unusual patterns at the merchant level: chargeback rate > 1.0%, refund-to-sale ratio > 5.0%, abnormal transaction surge (>5x trailing average), and patterns matching known card-testing behavior. Flagged merchants are reviewed within 24 hours.

### Clause 7.3 — Partner Liability
**Clause 7.3** Contracts with merchants and payment aggregators include clearly defined liability allocation for fraudulent transactions, chargeback timelines, and dispute resolution. The bank's customer is held harmless from merchant-side fraud, with chargeback rights protected.

### Clause 7.4 — API and Integration Security
**Clause 7.4** All partner integrations must use mutual TLS, signed requests, and IP allowlists. Sandbox / production segregation is mandatory. API keys are rotated at least every 90 days.

---

## Section 8: Internal Threat and Social Engineering

### Clause 8.1 — Insider Fraud Prevention
**Clause 8.1** Employees with access to customer data or transaction systems are subject to: background verification at hire, mandatory vacation policy, dual control on critical operations, periodic access reviews, and continuous behavioral monitoring.

### Clause 8.2 — Social Engineering Drills
**Clause 8.2** The bank conducts quarterly phishing simulation exercises for staff. Departments with click rates above 8.0% receive targeted re-training. Findings inform policy and procedure updates.

### Clause 8.3 — Privileged Access Management (PAM)
**Clause 8.3** Privileged sessions are recorded, time-bound, and require dual approval for high-risk actions. PAM logs are retained for **8 years** and reviewed monthly.

---

## Section 9: Forensics, Evidence, and Law Enforcement Cooperation

### Clause 9.1 — Forensic Preservation
**Clause 9.1** Upon a confirmed fraud event, forensic data (transaction logs, session recordings, device telemetry, IP traces, communication logs) are preserved in tamper-evident storage for **8 years**, accessible only to authorized FCO personnel.

### Clause 9.2 — Law Enforcement Coordination
**Clause 9.2** The bank maintains standing coordination with law enforcement (cyber cells, FIU-IND, CBI) for high-value or systemic fraud events. Information sharing follows legal process and customer-confidentiality preservation.

### Clause 9.3 — Customer Refunds for Unauthorized Transactions
**Clause 9.3** Per RBI's Customer Protection norms, customers are entitled to a zero-liability outcome for unauthorized transactions where the bank is at fault, and a limited liability outcome (capped at the customer's contribution to negligence) otherwise. Disputed credit-card transactions follow the standard chargeback process under card network rules.

### Clause 9.4 — Reporting Timelines
**Clause 9.4** Cyber-incident reporting to RBI follows the latest RBI Cyber Security Framework. Suspected money-laundering events are reported to FIU-IND in the prescribed formats and timelines.

---

## Section 10: Regulatory and Audit

### Clause 10.1 — Regulatory Mapping
**Clause 10.1** This SOP aligns with: RBI Master Direction on Digital Lending, RBI Master Direction on KYC, RBI Cybersecurity Framework for Banks, RBI Guidelines on Card-Not-Present Transactions, IT Act 2000 (and amendments), Aadhaar Act provisions for eKYC, and the Payment and Settlement Systems Act.

### Clause 10.2 — Independent Audit
**Clause 10.2** Annual independent audit of fraud prevention and detection controls is mandatory. Audit observations must be remediated within 90 days; material findings are escalated to the Audit Committee of the Board.

### Clause 10.3 — Penetration Testing
**Clause 10.3** Annual third-party penetration testing of all digital channels is mandatory. Findings are categorized by severity and remediated within SLA: Critical (24 hours), High (7 days), Medium (30 days), Low (90 days).

### Clause 10.4 — Annual Policy Review
**Clause 10.4** This SOP is reviewed semi-annually by the Fraud Risk Management Committee. Material regulatory changes trigger an out-of-cycle revision.

---

## Section 11: Appendix — Scam Playbooks

### Clause 11.1 — UPI Request Money Scam
**Clause 11.1** A scammer sends a collect-request disguised as a refund or prize claim. The customer, believing they will receive money, authorizes the debit. **Bank's response:** Block the payee, refund the amount where the bank's fault is established, raise a customer awareness campaign, and pursue fraud actor through law enforcement.

### Clause 11.2 — Screen-Share / Remote Access Scam
**Clause 11.2** Caller pretends to be bank / RBI / police, instructs customer to install AnyDesk / TeamViewer / Quick Support, then initiates fraudulent transactions. **Bank's response:** Hard-block on-screen-share apps installed immediately before a banking transaction, IVR warnings during high-value transactions, IVR prompt to call back only on the bank's official number.

### Clause 11.3 — Fake KYC Update Scam
**Clause 11.3** Customer receives SMS / WhatsApp claiming KYC is expiring, with a phishing link. **Bank's response:** Never send KYC-updating links via SMS. KYC is updated only via the official app or in-branch.

### Clause 11.4 — QR Code / Phishing Payment Scam
**Clause 11.4** Fraudster shares a QR code that, when scanned, authorizes a debit instead of a credit. **Bank's response:** UPI collect-requests carry customer-readable payee name and amount; merchant-pay QR codes cannot initiate debits. Awareness campaigns reinforce the difference.

### Clause 11.5 — Account Takeover via Credential Stuffing
**Clause 11.5** Credentials leaked in third-party breaches are reused against the bank's login. **Bank's response:** Strong password policy (no common-password usage), breached-password detection (HPI / haveibeenpwned integration), step-up auth on new-device login, customer notification on suspicious sessions.

---

## Section 12: Glossary

- **ATO:** Account Takeover.
- **CNP:** Card-Not-Present.
- **MCC:** Merchant Category Code.
- **DTS:** Device Trust Score.
- **2FA / MFA:** Two-Factor / Multi-Factor Authentication.
- **PAM:** Privileged Access Management.
- **PIR:** Post-Incident Review.
- **CSPRNG:** Cryptographically Secure Pseudo-Random Number Generator.
- **FIU-IND:** Financial Intelligence Unit – India.
- **EDD:** Enhanced Due Diligence.

---

**Document Metadata:**
Version: 2026.1
Last Updated: 2026-01-01
Owner: Chief — Financial Crime Operations (FCO)
Approved By: Fraud Risk Management Committee
Next Review Due: 2026-06-30
Classification: Internal — Highly Confidential