function TabBtn({
  textDark = false,
  isSelected,
  children,
  onClick,
}: {
  textDark?: boolean;
  isSelected: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      className={isSelected ? "tab-btn tab-btn--selected" : "tab-btn"}
      style={{ color: `${textDark ? "#000000" : "#ffffff"}` }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default TabBtn;
