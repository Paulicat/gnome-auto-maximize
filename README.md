# Tablet Mode Auto‑Maximize (GNOME)

Automatically maximize GNOME windows when your device enters **tablet mode** (Surface / 2‑in‑1 friendly). This setup installs a GNOME Shell extension and a small user systemd service that watches libinput tablet‑mode events and reacts instantly.

---

## Features

* 🪟 Auto‑maximize windows in tablet mode
* 🔁 Works with libinput tablet‑mode switch
* 👤 Runs as a **user** systemd service (no root daemon needed)
* 💻 Designed with Microsoft Surface & similar devices in mind

---

## Requirements

* GNOME Shell
* `gnome-extensions` CLI available
* `libinput` tools installed (`/usr/bin/libinput` must exist)
* User must be in the `input` group

### Install libinput tools (if missing)

```bash
sudo apt install libinput-tools
```

---

## Installation

### 1. Install the GNOME Extension

```bash
gnome-extensions install --force auto-maximize@surface.zip
```

After installing, you may need to **log out and back in** (or restart GNOME Shell) for the extension to appear.

---

### 2. Ensure `libinput` is Available

Verify that libinput exists:

```bash
ls -l /usr/bin/libinput
```

If it does not exist, install `libinput-tools` using your distro’s package manager.

---

### 3. Add Your User to the `input` Group

```bash
sudo usermod -aG input $USER
```

⚠️ **Reboot required** for group changes to take effect.

After reboot, confirm:

```bash
groups
```

You should see `input` listed.

---

### 4. Install the Tablet Mode Script

Copy the provided script to a location in your PATH:

```bash
sudo cp tablet-mode.sh /usr/local/bin/
sudo chmod +x /usr/local/bin/tablet-mode.sh
```

---

### 5. Install the User systemd Service

Copy the service file to your user systemd directory:

```bash
mkdir -p ~/.config/systemd/user
cp tablet-mode.service ~/.config/systemd/user/
```

Reload systemd and enable the service:

```bash
systemctl --user daemon-reload
systemctl --user enable --now tablet-mode.service
```

---

## Verifying It Works

Check service status:

```bash
systemctl --user status tablet-mode.service
```

Rotate, fold, or detach your device to trigger tablet mode. New windows should now auto‑maximize.

---

## Troubleshooting

**Service running but nothing happens?**

* Confirm `/usr/bin/libinput` exists
* Confirm you rebooted after joining the `input` group
* Check logs:

  ```bash
  journalctl --user -u tablet-mode.service
  ```

**Extension not doing anything?**

* Ensure it is auto enabled by the script after you detach the clipboard:

  ```bash
  gnome-extensions list
  ```

gnome-extensions enable auto-maximize@surface

```

---

## Notes

- This runs entirely in user space
- No system‑wide daemons or udev rules required
- Tested primarily on GNOME with Surface hardware, but should work on any libinput‑compatible tablet‑mode device but you may have to adjust the device path in the service file

---

## License

MIT (or specify your preferred license)

```
