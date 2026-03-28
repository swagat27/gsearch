# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x | ✅ Yes |
| < 1.0 | ❌ No |

---

## Reporting a Vulnerability

If you discover a security vulnerability in GSearch, please **do not open a public GitHub issue**.

Instead, report it privately:

1. Go to the [Security Advisories](https://github.com/swagat27/gsearch/security/advisories/new) page
2. Click **"New draft security advisory"**
3. Describe the vulnerability clearly

Or email directly: reach out via GitHub profile [@swagat27](https://github.com/swagat27)

---

## What to Include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

---

## Response Timeline

- **Acknowledgment:** Within 48 hours
- **Assessment:** Within 7 days
- **Fix & Disclosure:** Coordinated with the reporter

---

## Scope

GSearch is a **fully client-side, static web app**. It makes no server-side requests and stores no user data. 

Potential security concerns include:
- XSS via unsanitized search results from scraped sources
- Third-party API key exposure (currently none are used)
- Open redirect vulnerabilities in fallback search URLs

---

Thank you for helping keep GSearch safe!
