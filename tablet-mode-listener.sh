#!/bin/bash
DEVICE="$1"

echo "[listener] Watching $DEVICE" >&2

enable_extension() {
    echo "[listener] -> Enabling extension" >&2
    gnome-extensions enable auto-maximize@surface
}

disable_extension() {
    echo "[listener] -> Disabling extension" >&2
    gnome-extensions disable auto-maximize@surface
}

exec stdbuf -oL libinput debug-events --device "$DEVICE" | \
while read -r line; do
    echo "[listener] $line" >&2
    if [[ "$line" == *"switch tablet-mode state 1"* ]]; then
        enable_extension
    elif [[ "$line" == *"switch tablet-mode state 0"* ]]; then
        disable_extension
    fi
done
