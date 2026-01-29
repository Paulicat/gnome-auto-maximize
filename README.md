Install the zip: gnome-extensions install --force auto-maximize@surface.zip
Make sure libinput-tools (/usr/bin/libinput) is installed
Add yourself to input group - reboot and check groups
copy the .sh to /usr/local/bin
copy the service file to ~/.config/systemd/user/
reload and enable the service: systemctl --user daemon-reload && systemctl --user enable --now tablet-mode.service
