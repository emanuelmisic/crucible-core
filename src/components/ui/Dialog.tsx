import { DIALOG_ANIMATION_TIME } from "@/constants";
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
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  function handleOverlayClick(e: React.MouseEvent<HTMLElement>) {
    const targetElement = e.target as HTMLElement;
    const hasAllowedClass =
      targetElement.classList.contains("dialog-overlay") ||
      targetElement.classList.contains("close-btn");
    if (!hasAllowedClass) return;
    closeDialog();
  }

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setIsVisible(false), DIALOG_ANIMATION_TIME);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div
      className={`dialog-overlay ${isAnimating ? "dialog-overlay--open" : ""}`}
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
