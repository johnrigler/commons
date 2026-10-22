<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/cid.php';
try {
    $catalog = json_decode(file_get_contents($root . '/portal.json'), true, 512, JSON_THROW_ON_ERROR);
    $ids = [];
    foreach ($catalog['items'] as $record) {
        if (isset($ids[$record['id']])) throw new RuntimeException('Duplicate portal entry.');
        $ids[$record['id']] = true;
        $path = realpath($root . '/' . $record['path']);
        if (!$path || !str_starts_with($path, $root . '/') || commons_cid(file_get_contents($path)) !== $record['cid']) throw new RuntimeException('Portal document does not match its CID.');
        if (!str_contains(file_get_contents($path), 'id="' . $record['fragment'] . '"')) throw new RuntimeException('Portal fragment not found.');
    }
    foreach ($catalog['items'] as $record) foreach ($record['related'] as $id) if (!isset($ids[$id])) throw new RuntimeException('Unknown connected entry.');
    $json = json_encode($catalog, JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    if (PHP_SAPI === 'cli') fwrite(STDERR, $error->getMessage() . "\n");
    else { http_response_code(500); echo htmlspecialchars($error->getMessage()); }
    exit(1);
}
?>
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Browse connected Commons stories, attestations, explanations and descriptions.">
<title>Commons — Portal</title><style><?php readfile($root . '/portal.css'); ?></style></head><body>
<?php foreach (glob($root . '/portal/1_*.html') as $part) include $part; ?>
<script id="portal-data" type="application/json"><?= $json ?></script>
<?php foreach (['verify.js', 'portal-core.js', 'portal.js'] as $script) { ?>
<script><?= str_ireplace('</script', '<\/script', file_get_contents($root . '/' . $script)) ?></script>
<?php } ?>
</body></html>
