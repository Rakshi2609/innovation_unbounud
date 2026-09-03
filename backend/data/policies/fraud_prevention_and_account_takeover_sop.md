# Digital Banking Fraud Prevention & Account Takeover SOP (SOP-FR-2026)

## Section 1: Device Trust and Behavioral Telemetry
* **Clause 1.1 (Device Trust Scoring)**: Digital transactions are evaluated by behavioral telemetry yielding a Device Trust Score between 0.00 and 1.00.
* **Clause 1.2 (High-Risk Anomaly Trigger)**: Any transaction initiated from a new device ID, unmapped IP address, or known VPN proxy with a Device Trust Score below 0.30 requires immediate Step-Up Biometric Authentication or Out-of-Band SMS/IVR Verification.
* **Clause 1.3 (Critical Freeze Action)**: Transactions exceeding ₹50,000 with a Device Trust Score below 0.20 originating from high-risk merchant categories (crypto exchanges, gift card aggregators, wire remittors) must be temporarily held pending verbal human confirmation.

## Section 2: Protection of Vulnerable and Senior Customers
* **Clause 2.1 (Senior Citizen Account Safeguards)**: For account holders aged 60+ or flagged under vulnerable customer registry, any single transfer exceeding 40.0% of average monthly liquid savings must trigger a mandatory cooldown period of 2 hours.
* **Clause 2.2 (Coercion and Impersonation Verification)**: When an elderly customer attempts an unprecedented high-value outward transfer following prolonged phone activity, the customer safety team must verify against known remote-access / police impersonation scam scripts.
