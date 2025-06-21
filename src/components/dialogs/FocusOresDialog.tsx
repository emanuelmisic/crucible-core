import Dialog from "@/components/ui/Dialog";
import Image from "../ui/Image";

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
  return (
    <Dialog
      title="Choose ores to mine"
      isOpen={showDialog}
      closeDialog={closeDialog}
    >
      <div className="dialog__content">
        {ores.map((ore) => (
          <Image resource={ore} />
        ))}
      </div>
    </Dialog>
  );
}

export default FocusOresDialog;
