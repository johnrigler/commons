<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/cid.php';
try {
    $catalog = json_decode(file_get_contents($root . '/portal.json'), true, 512, JSON_THROW_ON_ERROR);
    $ids = [];
    $documents = [];
    foreach ($catalog['items'] as $record) {
        if (isset($ids[$record['id']])) throw new RuntimeException('Duplicate portal entry.');
        $class = $record['record_class'] ?? 'article';
        if (!in_array($class, ['article', 'company'], true)) throw new RuntimeException('Unknown portal record class.');
        if ($class === 'company' && (empty($record['legal_name']) || empty($record['role']) || $record['kind'] !== 'description')) throw new RuntimeException('Incomplete company profile.');
        $ids[$record['id']] = $class;
        $path = realpath($root . '/' . $record['path']);
        if (!$path || !str_starts_with($path, $root . '/') || commons_cid(file_get_contents($path)) !== $record['cid']) throw new RuntimeException('Portal document does not match its CID.');
        $content = file_get_contents($path);
        if (!str_contains($content, 'id="' . $record['fragment'] . '"')) throw new RuntimeException('Portal fragment not found.');
        $documents[$record['cid']] = base64_encode($content);
    }
    foreach ($catalog['items'] as $record) foreach ($record['related'] as $id) if (!isset($ids[$id])) throw new RuntimeException('Unknown connected entry.');
    foreach ($catalog['items'] as $record) foreach ($record['companies'] ?? [] as $id) if (($ids[$id] ?? null) !== 'company') throw new RuntimeException('Company links must reference company profiles.');
    $catalog['documents'] = $documents;
    $json = json_encode($catalog, JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    if (PHP_SAPI === 'cli') fwrite(STDERR, $error->getMessage() . "\n");
    else { http_response_code(500); echo htmlspecialchars($error->getMessage()); }
    exit(1);
}
?>
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Turn individual experiences into shared, checkable records. Explore Commons arguments, source-preservation workflows, and connected reading across subjects.">
<title>Commons — Portal</title><style><?php readfile($root . '/portal.css'); ?></style></head><body>
<?php foreach (glob($root . '/portal/1_*.html') as $part) include $part; ?>
<script id="portal-data" type="application/json"><?= $json ?></script>
<?php foreach (['verify.js', 'portal-core.js', 'portal-urls.js', 'portal-reader.js', 'portal.js'] as $script) { ?>
<script><?= str_ireplace('</script', '<\/script', file_get_contents($root . '/' . $script)) ?></script>
<?php } ?>
</body></html>
