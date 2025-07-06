import { useGame } from "@/contexts/GameContext";
import Dialog from "@/components/ui/Dialog";
import Image from "@/components/ui/Image";

function SelectResourcesDialog({
  showDialog,
  closeDialog,
  resources,
}: DialogProps & { resources: GameResource[] }) {
  const game = useGame();

  function getDialogResourceClass(res: GameResource) {
    return `dialog__resource ${
      res.isDisplayed ? "dialog__resource--selected" : ""
    }`;
  }

  function toggleVisibleResource(res: GameResource) {
    if (res.isDisplayed) {
      game.setResourceIsDisplayedState(res, false);
    } else {
      const displayedResources = resources.filter((o) => o.isDisplayed);
      if (displayedResources.length === 4) return;
      game.setResourceIsDisplayedState(res, true);
    }
  }

  return (
    <Dialog
      title="Choose resources to see on the panel"
      isOpen={showDialog}
      closeDialog={closeDialog}
    >
      <div className="dialog__content">
        {resources
          .filter((r) => r.unlocked)
          .map((resource) => (
            <div
              className={getDialogResourceClass(resource)}
              key={resource.name}
              onClick={() => toggleVisibleResource(resource)}
            >
              <Image key={resource.name} resource={resource} size={75} />
            </div>
          ))}
      </div>
    </Dialog>
  );
}

export default SelectResourcesDialog;
