# Prepare, print, retain

[Open the self-contained HTML](bafkreibydv3yrnxjkxw6ep22ku5fucwpolllwplmbyzlnrsqdxwhlfpbc4.html)
or [download the ready-to-print PDF](Commons-Preparation-and-Assistance.pdf).
The PDF has three US Letter pages. It is a blank, unsigned procedural draft.

| Page | Use |
| --- | --- |
| 1. Walkthrough | Adapt the request, add evidence, review, print and retain the sent version. |
| 2. Assistance record | Record the person's review, helper's work, separate signing authority if applicable, and actual dispatch. Complete privately. |
| 3. Foundations and articles | Articles can connect broad subjects; Parsonage Exemption is the proposed intersection of Real Estate and Religion. |

The [request and explanations](../) remain the starting document. Page 2 is an
optional record for credit correspondence. It is not an official authorization
form, power of attorney, VA appointment or court appearance form. The person can
use the material independently. The public Commons material is freely reusable
under the repository's CC0 dedication and is not sold as a service.

## Directory and comments

| Path | Contents |
| --- | --- |
| `source/1_10-walkthrough.html` | Reading and printing steps. |
| `source/1_20-assistance-record.html` | Blank record; comments explain the separate roles. |
| `source/1_30-common-structure.html` | Foundations, intersecting articles, cases and scope distinctions. |
| `source/style.css` and `source/index.js` | Print layout and local print button. |
| `source/page.php` | Literal-file assembler; completed HTML works without PHP. |
| `source/build.py` | Optional Python + ReportLab publication fallback and PDF typesetter. |
| `index.html` | Relative selector symlink to the immutable HTML snapshot. |
| `edition.json` | Authorship, scope, exact artifact hashes and source references. |

Build the HTML using the existing publisher:

```bash
source ~/commons/sb/publish.bash
cd ~/commons/reading/assistance
sb.publish source/page.php
```

Alternatively, `python3 source/build.py` creates both artifacts (ReportLab is a
development dependency). The PDF typesets the same numbered text independently;
it is not claimed to be a Chrome print export. The PDF is a print-and-handwrite
template, not an AcroForm. Retain finalized or signed editions separately before
regenerating the working PDF. A changed HTML receives a new CID filename; retain
historical snapshots and update the README link deliberately.

No account, payment, network request, storage or submission is required by this
HTML. Printing uses the browser's print dialog. The PDF and HTML were checked
for source-text consistency; all three PDF pages were rendered and visually
reviewed. Browser rendering was unavailable in the authoring environment.

## Primary references and limits

Sources checked October 21, 2026:

- [CFPB: submitting a complaint for another consumer](https://www.consumerfinance.gov/complaint/submitting-a-complaint-on-behalf-of-a-consumer/):
  identify the helper and obtain permission; a company may require written proof.
  This guidance concerns CFPB complaints, not universal signature authority.
- [Arizona Judicial Branch: defensive-driving FAQ](https://www.azcourts.gov/DefensiveDriving/FAQ)
  and [cost to attend](https://www.azcourts.gov/drive/cost-to-attend-school):
  eligible diversion can involve fees and course completion, dismissal and
  driving-record benefits. Eligibility and conditions matter.
- [Arizona Judicial Branch: program purposes](https://www.azcourts.gov/drive/court-information):
  education, diversion and a sanction. A critique of incentives does not establish
  that public safety is absent as a purpose.
- [VA: decision reviews](https://www.va.gov/decision-reviews/) and
  [accredited-representative FAQs](https://www.va.gov/resources/va-accredited-representative-faqs/):
  routes depend on the decision; benefit-claim preparation and representation
  have specific accreditation rules, and accredited VSO assistance is free.

John Rigler proposes traffic-ticket procedures as a sludge case connected to the
**Deterrence through administrative burden** article. His personal jurisdiction,
documents, offer and outcome have not been supplied for this edition. Arizona is
an illustrative mechanism, not an identification of his case. A case's evidence
must show which burdens were unnecessary or excessive.

Foundations are broad subjects such as Real Estate and Religion. A proposed
Parsonage Exemption article connects both. Articles may connect several foundations;
cases may reference several articles. Religious exemption and parsonage topics
remain organizational examples, with substantive scope and sources still to be
selected. See [foundations, articles and cases](../../docs/FOUNDATIONS.md).

Private evidence, signatures, IDs and completed assistance records stay outside
this public directory. GitHub publication is not mailing, filing, a digital
signature, an IPFS pin or a chain transaction.

