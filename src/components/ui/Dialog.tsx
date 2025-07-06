import { useEffect, useState } from "react";

interface DialogProps {
  title: string;
  width?: string;
  children?: React.ReactNode;
  isOpen: boolean;
  closeDialog: () => void;
}

function Dialog({
  title,
  width = "26rem",
  children,
  isOpen,
  closeDialog,
}: DialogProps) {
  const [visibility, setVisibility] = useState<"hidden" | "visible">("hidden");

  function handleOverlayClick(e: React.MouseEvent<HTMLElement>) {
    const targetElement = e.target as HTMLElement;
    const allowedClasses = ["dialog-overlay", "close-btn"];
    if (!allowedClasses.includes(targetElement.className)) return;
    closeDialog();
  }

  useEffect(() => {
    if (isOpen) setVisibility("visible");
    else setVisibility("hidden");
  }, [isOpen]);
  return (
    <div
      style={{ visibility: visibility }}
      className="dialog-overlay"
      onClick={(e) => handleOverlayClick(e)}
    >
      <div className="dialog" style={{ width: width }}>
        <div className="dialog__header">
          <span className="title">{title}</span>
          <button className="close-btn">X</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Dialog;
