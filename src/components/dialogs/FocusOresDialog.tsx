import Dialog from "@/components/ui/Dialog";
import Image from "@/components/ui/Image";

interface FocusOresDialogProps {
  showDialog: boolean;
  closeDialog: () => void;
  ores: GameResourceOre[];
}

function FocusOresDialog({
  showDialog,
  closeDialog,
  ores,
}: FocusOresDialogProps) {
  function getDialogOreClass(ore: GameResourceOre) {
    return `dialog__ore ${ore.active ? "dialog__ore--selected" : ""}`;
  }

  function chooseOre() {
    // Handle the logic for choosing an ore (set active state to true)
  }

  return (
    <Dialog
      title="Choose ores to mine"
      isOpen={showDialog}
      closeDialog={closeDialog}
    >
      <div className="dialog__content">
        {ores.map((ore) => (
          <div
            className={getDialogOreClass(ore)}
            key={ore.name}
            onClick={() => chooseOre()}
          >
            <Image key={ore.name} resource={ore} />
          </div>
        ))}
      </div>
    </Dialog>
  );
}

export default FocusOresDialog;
