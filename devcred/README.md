# 🛠️ DevCred – Decentralized Developer Credentialing & Reputation System (Stacks / Clarity)

DevCred is a Web3 project built on the **Stacks blockchain**, leveraging **Clarity smart contracts** to create a decentralized credential and reputation system for software developers.

> Empower developers to **own** their reputation.  
> Allow companies to **verify** skills, contributions, and certifications **on-chain**.

---

## 🚀 Key Features

- ✅ Verifiable developer credentials (certifications, hackathons, bounties)
- 🎖️ Contribution proofs as NFTs (e.g. GitHub commits, bug fixes)
- 🧠 Soulbound identity and skill NFTs
- 🤝 Endorsement + reputation score system
- 💼 On-chain job matching (opt-in)
- 💰 Bug bounty escrow with reputation rewards
- 🗳️ DAO governance for issuers and standards

---

## 📦 Smart Contract Modules (Clarity)

| Contract Name             | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| `devcred-profile.clar`   | Registers developer profiles and manages identity                          |
| `devcred-credentials.clar`| Issues and verifies credentials as NFTs or SBTs                           |
| `devcred-contributions.clar`| Records and mints verifiable GitHub/FOSS contributions                 |
| `devcred-bounty.clar`    | Handles bug bounty creation, staking, and escrow logic                     |
| `devcred-endorsements.clar`| Enables peer endorsement with anti-spam staking                        |
| `devcred-reputation.clar`| Aggregates scores from credentials, contributions, and endorsements        |
| `devcred-governance.clar`| DAO voting on verified issuers, dispute resolutions, and updates           |
| `devcred-registry.clar`  | NFT/SBT registry for credentials and contributions                         |
| `devcred-jobs.clar`      | Optional: Smart contract job board integrated with on-chain scores         |
| `devcred-token.clar`     | Optional: Utility token for incentives, staking, and governance            |

---

## 🛠️ Getting Started

### Prerequisites

- Node.js + Clarinet CLI
- Stacks blockchain devnet or testnet
- Hiro Wallet for development/testing

### Install Clarinet

```bash
npm install -g @hirosystems/clarinet
