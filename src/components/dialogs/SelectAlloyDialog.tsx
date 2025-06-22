import { useGame } from "@/contexts/GameContext";
import Dialog from "@/components/ui/Dialog";
import Image from "@/components/ui/Image";

function SelectAlloyDialog({
  showDialog,
  closeDialog,
  alloys,
}: DialogProps & { alloys: GameResourceAlloy[] }) {
  const game = useGame();

  function getDialogAlloyClass(alloy: GameResourceAlloy) {
    return `dialog__alloy ${alloy.active ? "dialog__alloy--selected" : ""}`;
  }

  function toggleActiveAlloy(alloy: GameResourceAlloy) {
    if (alloy.active) {
      game.setResourceActiveState(alloy, false);
    } else {
      const activeAlloys = alloys.filter((a) => a.active);
      if (activeAlloys) return;
      game.setResourceActiveState(alloy, true);
    }
  }

  return (
    <Dialog
      title="Choose alloy to smelt"
      isOpen={showDialog}
      closeDialog={closeDialog}
    >
      <div className="dialog__content">
        {alloys
          .filter((a) => a.unlocked)
          .map((alloy) => (
            <div
              className={getDialogAlloyClass(alloy)}
              key={alloy.name}
              onClick={() => toggleActiveAlloy(alloy)}
            >
              <Image key={alloy.name} resource={alloy} size={70} />
            </div>
          ))}
      </div>
    </Dialog>
  );
}

export default SelectAlloyDialog;
