<article id="legal-reference">
  <header><p class="eyebrow">Common reference · Law and procedure</p><h1>Laws, duties, deadlines and remedies</h1><p class="deck">A reusable place to identify the jurisdiction, covered actor, trigger, time limit, required action and consequence before applying a provision to a case.</p><p class="byline"><?= law_escape($lawReference['author']) ?> · 24 October 2026 · <?= law_escape($lawReference['status']) ?></p></header>
  <p>Start with the disputed proposition and the entity responsible. <a href="../../entry/rent-acceleration.html">Unsupported rent acceleration</a> remains the substantive rental issue. A legal reference supplies a rule to examine; private case records establish receipt, conduct, loss and the facts required to apply it.</p>
  <p>Each entry below summarizes the identified provisions and links their text. Definitions, statutory duties, regulations, remedies and judicial decisions remain distinct. A source check is not an independent legal review or a finding that a named company violated a law.</p>
  <h2>Find a provision</h2><ul class="law-index">
  <?php foreach ($lawReference['rules'] as $rule) { ?><li><a href="#law-<?= law_escape($rule['id']) ?>"><?= law_escape($rule['citation']) ?> — <?= law_escape($rule['title']) ?></a></li><?php } ?>
  </ul>
  <?php $group = ''; foreach ($lawReference['rules'] as $rule) { if ($group !== $rule['group']) { $group = $rule['group']; ?><h2><?= law_escape($group) ?></h2><?php } ?>
  <section class="law-record" id="law-<?= law_escape($rule['id']) ?>">
    <h3><?= law_escape($rule['citation']) ?> — <?= law_escape($rule['title']) ?></h3>
    <dl><?php foreach (['applies_to'=>'Who it applies to', 'trigger'=>'What starts the duty', 'deadline'=>'Time limit', 'required_action'=>'Required action', 'consequence'=>'Consequence or remedy', 'limits'=>'Scope and limits'] as $key=>$label) { ?><dt><?= law_escape($label) ?></dt><dd><?= law_escape($rule[$key]) ?></dd><?php } ?></dl>
    <p class="source-note"><a href="<?= law_escape($rule['source_url']) ?>">Read the legal text</a><?php foreach ($rule['additional_sources'] ?? [] as $url) { ?> · <a href="<?= law_escape($url) ?>">Companion source</a><?php } ?> · <?= law_escape($rule['jurisdiction']) ?> · Checked <?= law_escape($rule['checked']) ?> · <?= law_escape($rule['review_status']) ?></p>
  </section>
  <?php } ?>
  <h2>Judicial applications</h2>
  <?php foreach ($lawReference['case_law'] as $case) { ?><section class="law-record" id="law-<?= law_escape($case['id']) ?>"><h3><a href="<?= law_escape($case['url']) ?>"><?= law_escape($case['citation']) ?></a></h3><p><?= law_escape($case['scope']) ?></p></section><?php } ?>
  <h2>Existing legal references across the Commons</h2>
  <p>This inventory carries forward legal and administrative references already cited by the current housing, courts, traffic, disability and other reading editions. These references retain their earlier scope and checking dates. Their inclusion is not a fresh review of every rule or an assertion that a benefit, traffic or court rule governs a rental dispute.</p>
  <ul class="sources"><?php foreach ($lawReference['existing_legal_sources'] as $reference) { ?><li><a href="<?= law_escape($reference['url']) ?>"><?= law_escape($reference['description']) ?></a><br><small>Recorded in <?php foreach ($reference['cited_by'] as $i=>$edition) { if ($i) echo '; '; ?><a href="../../<?= law_escape($edition) ?>"><?= law_escape($edition) ?></a><?php } ?>. Imported reference; see those editions for scope and date.</small></li><?php } ?></ul>
  <h2>Use the same reference next time</h2>
  <p>The editable source is <a href="../../legal-references.json">legal-references.json</a>; this frozen edition records the exact version it used. Add newly cited laws to that common source with a stable ID, primary URL, jurisdiction, covered actor, trigger, deadline and limits. Record uncertain application as uncertain. Keep private evidence in its intended Daisy case.</p>
  <div class="reading-links"><a href="#dispute-deadlines">Which deadline belongs to which party? →</a><a href="#debt-remedies">Damages follow the claim →</a><a href="../../entry/rent-acceleration.html">Unsupported rent acceleration →</a></div>
</article>
