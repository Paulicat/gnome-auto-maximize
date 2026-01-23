import Meta from 'gi://Meta';
import GLib from 'gi://GLib';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class AutoMaximizeExtension extends Extension {
    enable() {
        this._maximizedWindows = new Set();
        this._workspaceSignals = [];

        // Maximize all currently open normal windows
        global.display.list_all_windows().forEach(win => {
            if (win.window_type === Meta.WindowType.NORMAL) {
                win.maximize(Meta.MaximizeFlags.BOTH);
                this._maximizedWindows.add(win);
            }
        });

        // Attach to window-added on each workspace
        let wm = global.workspace_manager;
        for (let i = 0; i < wm.get_n_workspaces(); i++) {
            let ws = wm.get_workspace_by_index(i);
            let id = ws.connect('window-added', (ws, win) => {
                GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
                    if (win.window_type === Meta.WindowType.NORMAL) {
                        win.maximize(Meta.MaximizeFlags.BOTH);
                        this._maximizedWindows.add(win);
                    }
                    return GLib.SOURCE_REMOVE;
                });
            });
            this._workspaceSignals.push([ws, id]);
        }
    }

    disable() {
        // Unmaximize all windows we touched
        if (this._maximizedWindows) {
            this._maximizedWindows.forEach(win => {
                try {
                    if (!win.minimized) {
                        win.unmaximize(Meta.MaximizeFlags.BOTH);
                    }
                } catch (e) {
                    // Window may already be closed
                }
            });
            this._maximizedWindows.clear();
            this._maximizedWindows = null;
        }

        // Disconnect workspace signals
        if (this._workspaceSignals) {
            this._workspaceSignals.forEach(([ws, id]) => {
                try {
                    ws.disconnect(id);
                } catch (e) {}
            });
            this._workspaceSignals = null;
        }
    }
}
