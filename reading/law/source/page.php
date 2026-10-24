<?php
$lawReference = json_decode(file_get_contents(dirname(__DIR__, 3) . '/legal-references.json'), true, 512, JSON_THROW_ON_ERROR);
function law_escape($text) { return htmlspecialchars((string)$text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
?>
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Commons — Laws, Duties, Deadlines and Remedies</title>
<meta name="description" content="A shared reference for unsupported rent acceleration: identify the responsible party, legal trigger, deadline, required action and remedy.">
<style><?php readfile(__DIR__ . '/../../arguments/source/style.css'); ?>
.law-record { border-top: 1px solid var(--rule); padding-top: 12px; margin-top: 24px; }
.law-record h3 { font: 700 18px/1.4 Arial, sans-serif; margin: 12px 0; }
.law-record dl { font: 15px/1.55 Arial, sans-serif; }
.law-record dt { font-weight: 700; margin-top: 12px; }
.law-record dd { margin: 3px 0 0; }
.law-index { columns: 2; padding-left: 20px; font: 14px/1.6 Arial, sans-serif; }
.law-index li { break-inside: avoid; margin-bottom: 7px; }
@media(max-width:600px) { .law-index { columns: 1; } }
@media print { .law-record dl { font-size: 10pt; } .law-record h3 { break-after: avoid; } .law-index { font-size: 9pt; } }
</style></head><body>
<nav class="tools screen-only" aria-label="Read and print this reference"><a href="../../index.html">Commons feed</a><a href="#dispute-deadlines">Deadlines</a><a href="#legal-reference">Law index</a><a href="#debt-remedies">Remedies</a><a href="../../entry/rent-acceleration.html">Unsupported rent acceleration</a><button id="print-button" type="button">Print / save PDF</button></nav>
<?php foreach (glob(__DIR__ . '/1_*') as $part) include $part; ?>
<script>document.getElementById('print-button').addEventListener('click', () => window.print());</script>
</body></html>
