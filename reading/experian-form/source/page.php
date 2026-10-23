<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="referrer" content="no-referrer"><title>Commons — Experian correction form</title>
<style><?php readfile(__DIR__ . '/style.css'); ?></style></head><body>
<nav class="tools screen-only"><a href="../../index.html">Commons</a><a href="../../entry/dispute-referral-loop.html">The argument behind this form</a></nav>
<?php
$reference = json_decode(file_get_contents(__DIR__ . '/pdf-reference.json'), true, 512, JSON_THROW_ON_ERROR);
foreach (['1_10-overview.html', '1_20-controls.html'] as $part) {
    echo str_replace('href="Experian-Correction-Blank.pdf"', 'href="' . htmlspecialchars($reference['path'], ENT_QUOTES) . '"', file_get_contents(__DIR__ . '/' . $part));
}
?>
<div class="preview" aria-label="Two-page letter preview">
<?php readfile(__DIR__ . '/1_30-letter.html'); readfile(__DIR__ . '/1_40-request.html'); ?>
</div>
<script id="form-fields" type="application/json"><?php readfile(__DIR__ . '/fields.json'); ?></script>
<script id="blank-reference" type="application/json"><?php readfile(__DIR__ . '/pdf-reference.json'); ?></script>
<script><?php readfile(__DIR__ . '/index.js'); ?></script>
</body></html>
