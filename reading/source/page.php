<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <title>Commons — Dispute Request and Shared Explanations</title>
  <style><?php readfile(__DIR__ . '/style.css'); ?></style>
</head>
<body data-print="all">
  <aside class="tools screen-only" aria-label="Customize and print">
    <details id="request-fields">
      <summary>Customize this request</summary>
      <div class="fields">
        <label for="bureau">Credit reporting agency
          <input id="bureau" value="" maxlength="160">
        </label>
        <label for="collector">Debt collector<input id="collector" value="" maxlength="160"></label>
        <label for="lessor">Lessor / property company<input id="lessor" value="" maxlength="160"></label>
      </div>
      <p class="hint">Click an organization name in the request to edit its field. Names update the opening only; attach and review the evidence for the individual case.</p>
    </details>
    <div class="print-tools">
      <label for="print-scope">Pages to print<select id="print-scope"><option value="all">Request and all explanations</option><option value="request">Request only</option></select></label>
      <button id="print-button" type="button">Print / save PDF</button>
      <button id="reset-button" type="button">Reset names</button>
    </div>
    <p class="hint">Edits stay in this open page. To retain them, print or save a PDF. No information is submitted by this page.</p>
  </aside>
<?php readfile(__DIR__ . '/1_10-request.html'); ?>

<?php readfile(__DIR__ . '/1_20-rent-acceleration.html'); ?>

<?php readfile(__DIR__ . '/1_30-administrative-burden.html'); ?>

<?php readfile(__DIR__ . '/1_40-about-commons.html'); ?>
<script><?php readfile(__DIR__ . '/index.js'); ?></script>
</body>
</html>
