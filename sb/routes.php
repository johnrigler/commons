<?php
// Stable static entry paths select the current self-contained portal.
$root = dirname(__DIR__);
try {
    $catalog = json_decode(file_get_contents($root . '/portal.json'), true, 512, JSON_THROW_ON_ERROR);
    $folder = $root . '/entry';
    if (is_link($folder) || (file_exists($folder) && !is_dir($folder))) throw new RuntimeException('The entry path must be an ordinary directory.');
    $paths = [];
    foreach ($catalog['items'] as $item) {
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $item['id'])) throw new RuntimeException('Unsafe entry ID.');
        $path = $folder . '/' . $item['id'] . '.html';
        if ((file_exists($path) || is_link($path)) && (!is_link($path) || readlink($path) !== '../index.html')) throw new RuntimeException('An entry path contains an unexpected file.');
        $paths[] = $path;
    }
    if (!is_dir($folder) && !mkdir($folder, 0755)) throw new RuntimeException('Could not create entry paths.');
    foreach ($paths as $path) {
        if (!is_link($path) && !symlink('../index.html', $path)) throw new RuntimeException('Could not create an entry link.');
    }
} catch (Throwable $error) {
    fwrite(STDERR, $error->getMessage() . "\n");
    exit(1);
}
