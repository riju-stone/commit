import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { get, STORE_KEYS, updateAppSettings, exportAppData, resetAppData } from "@/lib/persistent-store";
import type { AppSettings, VaultConfig } from "@/types/config";
import useAppStore from "@/store/appStore";
import { FolderOpen, Download, Trash2, Settings as SettingsIcon } from "lucide-react";

const SETTINGS_VIEW_ANIMATION = {
  initial: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  transition: {
    duration: 0.5,
    ease: "easeInOut",
  },
};

function SettingsView() {
  const { vaults, activeVault } = useAppStore();
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const appSettings = await get(STORE_KEYS.APP_SETTINGS, null);
      setSettings(appSettings);
    } catch (error) {
      console.error("Failed to load settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = async (key: keyof AppSettings, value: boolean | number | string) => {
    if (!settings) return;

    const updatedSettings = { ...settings, [key]: value };
    setSettings(updatedSettings);

    try {
      await updateAppSettings({ [key]: value });
    } catch (error) {
      console.error("Failed to update setting:", error);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await exportAppData();
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `commit-app-config-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  const handleResetData = async () => {
    if (confirm("Are you sure you want to reset all app data? This action cannot be undone.")) {
      try {
        await resetAppData();
        window.location.reload();
      } catch (error) {
        console.error("Failed to reset data:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
        <div>Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="grow w-full h-screen bg-black/80 flex items-center justify-center overflow-hidden text-white">
      <motion.div
        layout
        variants={SETTINGS_VIEW_ANIMATION}
        initial="initial"
        animate="visible"
        exit="initial"
        className="w-full max-w-4xl h-full overflow-y-auto p-8"
      >
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon className="w-8 h-8" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Vaults Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Vaults
          </h2>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="mb-3">
              <Label className="text-white/80">Active Vault</Label>
              <p className="text-lg">{activeVault ? activeVault.name : "None"}</p>
              {activeVault && <p className="text-sm text-white/60">{activeVault.path}</p>}
            </div>
            <Separator className="my-4 bg-white/10" />
            <div>
              <Label className="text-white/80">All Vaults ({vaults.length})</Label>
              <div className="mt-2 space-y-2">
                {vaults.map((vault: VaultConfig) => (
                  <div key={vault.id} className="flex justify-between items-center p-3 bg-white/5 rounded-md">
                    <div>
                      <p className="font-medium">{vault.name}</p>
                      <p className="text-sm text-white/60">{vault.path}</p>
                    </div>
                    {activeVault?.id === vault.id && (
                      <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded">Active</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* App Settings Section */}
        {settings && (
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">App Settings</h2>
            <div className="bg-white/5 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Auto Save</Label>
                  <p className="text-sm text-white/60">Automatically save changes</p>
                </div>
                <Switch
                  className="dark"
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                />
              </div>

              {settings.autoSave && (
                <div>
                  <Label className="text-white">Auto Save Interval (ms)</Label>
                  <Input
                    type="number"
                    value={settings.autoSaveInterval || 5000}
                    onChange={(e) => handleSettingChange("autoSaveInterval", parseInt(e.target.value))}
                    className="mt-2 bg-white/10 border-white/20 text-white"
                  />
                </div>
              )}

              <Separator className="bg-white/10" />

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Email Sync</Label>
                  <p className="text-sm text-white/60">Sync emails with your account</p>
                </div>
                <Switch
                  className="dark"
                  checked={settings.emailSyncEnabled}
                  onCheckedChange={(checked) => handleSettingChange("emailSyncEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Calendar Sync</Label>
                  <p className="text-sm text-white/60">Sync calendar events</p>
                </div>
                <Switch
                  className="dark"
                  checked={settings.calendarSyncEnabled}
                  onCheckedChange={(checked) => handleSettingChange("calendarSyncEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Notifications</Label>
                  <p className="text-sm text-white/60">Enable system notifications</p>
                </div>
                <Switch
                  className="dark"
                  checked={settings.notificationsEnabled}
                  onCheckedChange={(checked) => handleSettingChange("notificationsEnabled", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Spell Check</Label>
                  <p className="text-sm text-white/60">Check spelling while typing</p>
                </div>
                <Switch
                  className="dark"
                  checked={settings.spellCheckEnabled}
                  onCheckedChange={(checked) => handleSettingChange("spellCheckEnabled", checked)}
                />
              </div>
            </div>
          </section>
        )}

        {/* Data Management Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Data Management</h2>
          <div className="bg-white/5 rounded-lg p-4 space-y-3">
            <Button
              onClick={handleExportData}
              variant="outline"
              className="w-full justify-start text-white border-white/20 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export App Configuration
            </Button>

            <Button onClick={handleResetData} variant="destructive" className="w-full justify-start">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All App Data
            </Button>
          </div>
        </section>

        {/* About Section */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">About</h2>
          <div className="bg-white/5 rounded-lg p-4 text-sm text-white/60">
            <p>Version: 1.0.0</p>
            <p className="mt-2">Commit is your personal productivity workspace for notes, journals, and more.</p>
          </div>
        </section>
      </motion.div>
    </div>
  );
}

export default SettingsView;
