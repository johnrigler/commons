<?php $root = dirname(__DIR__, 3); ?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="referrer" content="no-referrer"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'"><title>Commons — Artifact intake</title><style><?php readfile(__DIR__.'/style.css'); ?></style></head><body>
<?php foreach (glob(__DIR__.'/1_*.html') as $part) readfile($part); ?>
<script><?php echo str_ireplace('</script','<\/script',file_get_contents($root.'/vendor/pdf-lib/pdf-lib-1.17.1.min.js')); ?></script>
<script><?php readfile(__DIR__.'/core.js'); ?></script><script><?php readfile(__DIR__.'/app.js'); ?></script></body></html>
