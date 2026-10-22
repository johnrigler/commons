# The cost of challenging a claim

The current Commons argument collection consolidates the debt-record, ownership,
admission, representation, and traffic recollection branches into seven general
articles and one adaptable request. The articles lead with institutional
mechanisms and published research rather than an individual's case history.

| Current article | Entry ID |
| --- | --- |
| Deterrence through administrative burden | `administrative-burden` |
| A debt claim needs a traceable account | `records-proof` |
| When procedure decides a debt claim | `debt-default` |
| Unsupported rent acceleration | `rent-acceleration` |
| Credit reporting as collection pressure | `credit-reporting` |
| The price of a different traffic record | `traffic-insurance` |
| When citations fund the town | `traffic-revenue` |
| Request the basis of a reported balance | `request` |

The main feed presents these articles once. Earlier entry URLs remain usable as
unindexed references to the appropriate consolidated article. Historical
CID-named editions remain unchanged; existing contribution parent CIDs are not
rewritten.

Research includes administrative-burden scholarship, the FTC's empirical
debt-buying study, Pew's review of debt litigation, CFPB rental-debt and recent
credit-reporting reports, official court procedures, statutes, federal findings,
and an audited municipal budget. Each source's date, sample, jurisdiction, and
scope are recorded alongside the claims it supports.

Numbered HTML parts assemble into a standalone static edition:

```bash
source /absolute/path/to/commons/sb/publish.bash
sb.publish ./source/page.php index.html
```

`edition.json` and its frozen CID copy record the selected artifacts and sources.
`examples/commons-arguments.draft.json` prepares the current unsigned ledger
reference. Pinning, funding, signing, and broadcast have not been performed.
