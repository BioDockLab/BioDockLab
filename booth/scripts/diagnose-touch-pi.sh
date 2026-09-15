#!/usr/bin/env bash
set -u

echo "=== Raspberry Pi ==="
uname -a
if [[ -r /proc/device-tree/model ]]; then
  tr -d '\0' < /proc/device-tree/model
  echo
fi

echo
echo "=== USB devices ==="
if command -v lsusb >/dev/null 2>&1; then
  lsusb
else
  echo "lsusb unavailable (install usbutils)"
fi

echo
echo "=== Linux input devices ==="
if [[ -r /proc/bus/input/devices ]]; then
  sed -n '/^N: Name=/p;/^H: Handlers=/p' /proc/bus/input/devices
else
  echo "/proc/bus/input/devices unavailable"
fi

echo
echo "=== libinput devices ==="
if command -v libinput >/dev/null 2>&1; then
  libinput list-devices
else
  echo "libinput unavailable (install libinput-tools)"
fi

echo
echo "DECISION"
echo "- Touchscreen/HID device absent: HDMI is video only; software cannot recover touch."
echo "- Touchscreen/HID device present: run 'sudo libinput debug-events' and touch the panel."
echo "- StanbyME workaround: open the Pi URL in StanbyME's built-in browser."
