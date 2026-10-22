<?php
// Commons' SB Shell publication assembler. index.php points here.
$root = dirname(__DIR__);
require_once __DIR__ . '/cid.php';
try {
    $catalog = json_decode(file_get_contents($root . '/statements.json'), true, 512, JSON_THROW_ON_ERROR);
    foreach ($catalog['statements'] as &$record) {
        $record['text'] = file_get_contents($root . '/' . $record['path']);
        if ($record['text'] === false || basename($record['path']) !== $record['cid'] . '.md'
            || commons_cid($record['text']) !== $record['cid']) {
            throw new RuntimeException('Statement bytes do not match their filename: ' . $record['path']);
        }
    }
    unset($record);
    $json = json_encode($catalog, JSON_THROW_ON_ERROR | JSON_HEX_TAG | JSON_HEX_AMP | JSON_UNESCAPED_SLASHES);
} catch (Throwable $error) {
    if (PHP_SAPI === 'cli') fwrite(STDERR, $error->getMessage() . "\n");
    else { http_response_code(500); echo htmlspecialchars($error->getMessage()); }
    exit(1);
}
?>
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="description" content="Shared statements, individual cases, verifiable editions.">
<title>Commons</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='10' fill='%231f4443'/%3E%3Ctext x='32' y='46' text-anchor='middle' font-size='48' font-family='serif' fill='%23fff'%3EC%3C/text%3E%3C/svg%3E">
<style><?php readfile($root . '/style.css'); ?></style>
</head>
<body>
<?php foreach (glob($root . '/1_*.html') as $part) include $part; ?>
<script id="commons-data" type="application/json"><?= $json ?></script>
<?php foreach (['verify.js', 'pinata.js', 'thunderwords.js', 'portal-core.js', 'index.js'] as $script) { ?>
<script>
<?= str_ireplace('</script', '<\/script', file_get_contents($root . '/' . $script)) ?>
</script>
<?php } ?>
</body>
</html>
