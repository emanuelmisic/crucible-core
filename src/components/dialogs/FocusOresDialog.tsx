import { useGame } from "@/contexts/GameContext";
import Dialog from "@/components/ui/Dialog";
import Image from "@/components/ui/Image";

function FocusOresDialog({
  showDialog,
  closeDialog,
  ores,
}: DialogProps & { ores: GameResourceOre[] }) {
  const game = useGame();

  function getDialogOreClass(ore: GameResourceOre) {
    return `dialog__ore ${ore.active ? "dialog__ore--selected" : ""}`;
  }

  function toggleActiveOre(ore: GameResourceOre) {
    if (ore.active) {
      game.setResourceActiveState(ore, false);
    } else {
      const activeOres = ores.filter((o) => o.active);
      if (activeOres.length === 3) return;
      game.setResourceActiveState(ore, true);
    }
  }

  return (
    <Dialog
      title="Choose ores to mine"
      isOpen={showDialog}
      closeDialog={closeDialog}
    >
      <div className="dialog__content">
        {ores
          .filter((o) => o.unlocked)
          .map((ore) => (
            <div
              className={getDialogOreClass(ore)}
              key={ore.name}
              onClick={() => toggleActiveOre(ore)}
            >
              <Image key={ore.name} resource={ore} size={70} />
            </div>
          ))}
      </div>
    </Dialog>
  );
}

export default FocusOresDialog;
