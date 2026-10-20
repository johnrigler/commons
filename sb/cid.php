<?php
// Same one-block profile as verify.js. No IPFS daemon is needed to name bytes.
function commons_cid(string $bytes): string {
    if (strlen($bytes) > 1024 * 1024) throw new RuntimeException('This raw-block profile supports files up to 1 MiB.');
    $data = "\x01\x55\x12\x20" . hash('sha256', $bytes, true);
    $alphabet = 'abcdefghijklmnopqrstuvwxyz234567';
    $output = 'b'; $buffer = 0; $bits = 0;
    foreach (unpack('C*', $data) as $byte) {
        $buffer = ($buffer << 8) | $byte;
        $bits += 8;
        while ($bits >= 5) {
            $bits -= 5;
            $output .= $alphabet[($buffer >> $bits) & 31];
        }
        $buffer &= (1 << $bits) - 1;
    }
    if ($bits) $output .= $alphabet[($buffer << (5 - $bits)) & 31];
    return $output;
}

if (PHP_SAPI === 'cli' && realpath($_SERVER['SCRIPT_FILENAME']) === __FILE__) {
    try {
        if ($argc !== 2) throw new RuntimeException('Usage: php sb/cid.php FILE');
        $bytes = file_get_contents($argv[1]);
        if ($bytes === false) throw new RuntimeException('Cannot read the file.');
        echo commons_cid($bytes), "\n";
    } catch (Throwable $error) {
        fwrite(STDERR, $error->getMessage() . "\n");
        exit(1);
    }
}
