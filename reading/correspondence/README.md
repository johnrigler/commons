# Signed-document and company-policy correspondence

This generic two-page letter asks the signer about their own act of digitally signing the original PDF,
capacity, company policy, delegated authority, outside instructions and individual
initiative. It keeps the substantive unsupported-rent-acceleration questions in
the same correspondence without assuming personal wrongdoing.

All values are blank in the public edition. Print the form and fill it by hand,
or use the browser controls for a private working copy. Keep the signed original,
make a copy and mail the copy. The email-text control prepares reviewable text;
it does not create a remote draft or send anything. Case facts, attachments and
delivery records belong in private Daisy.

`source/fields.json` defines empty fields. Runtime JavaScript writes text nodes
in the current tab with no storage, URL parameters or network submission. The
blank-print control preserves the user's typed values and removes them from the letter for that
print, then restores the working copy. Current-copy printing checks for clipping. Handwritten signatures are
separate from typed names; no cryptographic signature of the template or completed letter is claimed.

Numbered HTML parts, CSS and vanilla JavaScript are assembled by PHP into a
self-contained static edition. Source `sb/publish.bash` by absolute path, then
run `sb.publish ./source/page.php index.html` here. Freeze the new HTML and edition
metadata under new raw CIDs and update the portal. Keep prior CID files unchanged.

See `../../docs/CORRESPONDENCE.md` for the public/private and professional-handoff
policy. Company profiles may retain sourced organization-specific information;
those names are not default values in reusable letters. The broader Web3 and
legal-cost rationale belongs in the project README, not automatically in letters.
