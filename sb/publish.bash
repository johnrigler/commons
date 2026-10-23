# Source this file using its absolute path. The function preserves your cwd.
sb.publish() (
    local sb_php="${SB_PHP:-php}"
    local sb_source="${1:-index.php}"
    local sb_entry="${2:-index.html}"
    local sb_cid_tool="${BASH_SOURCE[0]%/*}/cid.php"
    local sb_portal_source="${BASH_SOURCE[0]%/*}/portal.php"
    local sb_routes_tool="${BASH_SOURCE[0]%/*}/routes.php"
    local sb_temp sb_link sb_cid sb_snapshot
    command -v "$sb_php" >/dev/null || { echo 'Set SB_PHP to your PHP CLI binary.' >&2; return 1; }
    [ -f "$sb_source" ] && [ -f "$sb_cid_tool" ] || { echo 'Cannot find the PHP assembler or CID tool.' >&2; return 1; }
    case "$sb_entry" in index.html|about.html|publish.html) ;; *) echo 'Choose index.html, about.html or publish.html as the entry link.' >&2; return 1;; esac
    [ ! -d "$sb_entry" ] || { echo 'The entry link must not be a directory or a link to a directory.' >&2; return 1; }
    sb_temp=$(mktemp .commons-build.XXXXXX) || return 1
    sb_link=$(mktemp .commons-index.XXXXXX) || { rm -f "$sb_temp"; return 1; }
    trap 'rm -f "$sb_temp" "$sb_link"' EXIT
    "$sb_php" -d display_errors=stderr "$sb_source" > "$sb_temp" || return 1
    [ -s "$sb_temp" ] || { echo 'The assembler produced no HTML.' >&2; return 1; }
    sb_cid=$("$sb_php" "$sb_cid_tool" "$sb_temp") || return 1
    sb_snapshot="$sb_cid.html"
    if [ -e "$sb_snapshot" ] || [ -L "$sb_snapshot" ]; then
        [ ! -L "$sb_snapshot" ] && cmp -s "$sb_temp" "$sb_snapshot" || {
            echo 'An existing CID filename contains different bytes or is a symlink.' >&2; return 1;
        }
    else
        mv "$sb_temp" "$sb_snapshot" || return 1
        chmod 644 "$sb_snapshot" || return 1
    fi
    if [ "$sb_entry" = index.html ] && [ "$("$sb_php" -r 'echo realpath($argv[1]);' "$sb_source")" = "$sb_portal_source" ]; then
        "$sb_php" "$sb_routes_tool" || return 1
    fi
    rm -f "$sb_link"
    ln -s "$sb_snapshot" "$sb_link" || return 1
    mv -f "$sb_link" "$sb_entry" || return 1
    printf '%s\n' "$sb_snapshot"
)
