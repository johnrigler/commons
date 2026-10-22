> Current articles: [The cost of challenging a claim](../arguments/index.html).
> Linked PDFs below preserve earlier editions; the live feed uses the revised HTML.

# Six short articles to read and refine

[Download the six-page PDF](Commons-Overview-and-Review.pdf) or
[open the complete HTML edition](bafkreielzf2nxo2ghrqwjhtiy5mspokl7tbqypsalzxdnuymtx3b6nyrre.html).
On GitHub, the PDF is ready to preview or download. For the interactive reading
layout, download the complete HTML file and open it locally, or serve the repo
using the existing static workflow. Opening HTML in GitHub's file viewer shows
its source.

This is a new unsigned editorial draft for John Rigler's review, based on the
October 21 conversation and the current project notes. It is an overview of
the intended model, not a claim that a new public-address service or naming
protocol has been deployed.

| Page | Article | What to review |
| --- | --- | --- |
| 1 | An open place to publish | The shared stream versus one selected collection. |
| 2 | Subjects meet in articles | Foundations, cross-subject articles and individual cases. |
| 3 | Recognizing a shared pattern | Comparing rent, VA and traffic processes without treating their rules as interchangeable. |
| 4 | Knowledge in the internet of value | The connection from peer-to-peer exchange to reusable public knowledge. |
| 5 | Independent scribes, many doorways | The tentative scribes name, independent readers and optional DNS ownership. |
| 6 | Useful work within the Commons | Ordinary paid services, professional knowledge and the next revision pass. |

Each page ends with a short review prompt. Identify a page and passage when
suggesting a change; the corresponding numbered source part can be revised
without rewriting all the other articles.

## Read the concrete examples next

1. [Request and explanations](../README.md): the existing four-page PDF and
   editable request about unsupported rent acceleration and administrative burden.
2. [Preparation and assistance](../assistance/README.md): the three-page
   walkthrough and optional private credit-correspondence assistance record.

These remain separate, identifiable editions. The overview does not change
their bytes or make the credit-correspondence form a universal VA or court form.
No private case evidence or identity documents are included here.

## Source parts and publication

The [source directory](source/) contains six numbered HTML articles, a shared
stylesheet, a local print control, a literal-file PHP assembler and the optional
Python publication tool. JavaScript stays in its own source file; the completed
HTML embeds all runtime code and styles and has no network dependency for reading.

The HTML can be rebuilt with the existing repository publisher:

```bash
source ~/commons/sb/publish.bash
cd ~/commons/reading/overview
sb.publish source/page.php
```

Alternatively, `python3 source/build.py` builds both HTML and PDF. The authoring
tool requires ReportLab and DejaVu Serif/Sans regular and bold fonts. Set
`COMMONS_FONT_DIR` if those four TTF files are not in the default Linux font
directory. Readers need none of these dependencies.

The PDF typesets the same numbered article text independently. It is not a
Chrome print export. Preserve completed or signed editions separately before
regenerating the working PDF. Keep historical CID snapshots and update this
README's edition link deliberately after a source change.

[Edition metadata](edition.json) records the exact artifact hashes and CIDs,
the source commit, authorship, scope and draft status. Byte identity is separate
from the reliability of an argument, identity attribution or legal effect.

## Sources and fuller discussion

- [Foundations and articles](../../docs/FOUNDATIONS.md).
- [The address and the scribes](../../docs/ADDRESS-AND-SCRIBES.md).
- [Commons and Web3](../../docs/COMMONS-AND-WEB3.md).
- [Professional participation](../../docs/PROFESSIONAL-PARTICIPATION.md).
- [VA: Decision Reviews and Appeals](https://www.va.gov/decision-reviews/).
- [Satoshi Nakamoto: Bitcoin white paper](https://bitcoin.org/bitcoin.pdf),
  abstract and sections 1, 4 and 6.
- [Bitcoin Core: genesis construction](https://github.com/bitcoin/bitcoin/blob/master/src/kernel/chainparams.cpp).
- [ABA Model Rule 1.1 Comment 8](https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_1_competence/comment_on_rule_1_1/).
- [Federal Rules of Evidence](https://www.uscourts.gov/sites/default/files/document/federal-rules-of-evidence.pdf),
  December 1, 2025 edition; Rules 901 and 902.

The primary-source passages were checked earlier in the same October 21
conversation. The case comparisons are a research framework. No particular
VA claim, traffic jurisdiction, procedural deadline or outcome is supplied.

## Verification

All six PDF pages were rendered and visually reviewed. Source-text consistency,
artifact hashes, CID names, HTML anchors and the local print action were checked.
Full browser rendering was unavailable in the authoring environment. No IPFS
pin, digital signature, ledger transaction, dispatch or court approval is claimed.
