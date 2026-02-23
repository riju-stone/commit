import { Button } from "@/components/ui/button";
import AppLogo from "../assets/images/commit.png";
import useAppStore from "@/store/appStore";
import { open } from "@tauri-apps/plugin-dialog";
import { Trash } from "lucide-react";
import type { VaultConfig } from "@/types/config";

function OnboardingView() {
  const { vaults, addVault, setActiveVault, setOnboardingCompleted, removeVault } = useAppStore();

  const handleVaultCreation = async () => {
    const dirPath = await open({
      multiple: false,
      directory: true,
      title: "Select or Create a Vault Directory",
    });

    if (!dirPath) return;

    const dirName = dirPath.split("/").pop() || "New Vault";
    const vaultId = crypto.randomUUID();
    const newVault: VaultConfig = {
      id: vaultId,
      name: dirName,
      path: dirPath,
      createdAt: new Date().toISOString(),
    };

    addVault(newVault);
    setActiveVault(newVault);
    setOnboardingCompleted(true);
  };

  const handleOpenVault = (vault: VaultConfig) => {
    setActiveVault(vault);
    setOnboardingCompleted(true);
  };

  const handleRemoveVault = (vaultId: string) => {
    removeVault(vaultId);
  };

  return (
    <div className="h-full w-full flex flex-col justify-center items-center overflow-hidden bg-black/80">
      <img src={AppLogo} alt="Commit Vault Logo" className="w-32 h-32 mb-6" />
      <h1 className="text-4xl font-bold mb-2 text-white">Commit</h1>
      <p className="w-3/4 text-lg text-gray-300 mb-5 text-center">Reflect & Commit to your Life.</p>
      <Button className="dark text-white text-md" size="lg" variant="outline" onClick={handleVaultCreation}>
        Create a vault
      </Button>
      <p className="text-sm text-white/60 my-4">or open an existing vault</p>

      <div className="w-1/2 flex flex-col justify-center items-center bg-white/10 rounded-md py-2 px-4">
        {vaults.length > 0 ? (
          <div className="w-full">
            {vaults.map((vault) => (
              <div
                key={vault.id}
                className="flex justify-between items-center w-full text-white text-md bg-transparent"
              >
                <div className="flex flex-col">
                  <span className="font-medium">{vault.name}</span>
                  <span className="text-sm text-gray-400">{vault.path}</span>
                </div>
                <div className="flex justify-end items-center gap-2">
                  <Button className="dark text-white text-sm" variant="outline" onClick={() => handleOpenVault(vault)}>
                    Open
                  </Button>
                  <Button
                    className="dark text-white text-sm"
                    size="icon"
                    variant="destructive"
                    onClick={() => handleRemoveVault(vault.id)}
                  >
                    <Trash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-md text-white">No vaults available</p>
        )}
      </div>
    </div>
  );
}

export default OnboardingView;
