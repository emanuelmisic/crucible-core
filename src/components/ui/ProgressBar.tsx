import "@/styles/ProgressBar.scss";

interface ProgressBarProps {
  currentProgress: number;
  maxProgress: number;
  type?: string;
}

function ProgressBar({ currentProgress, maxProgress, type }: ProgressBarProps) {
  const modifier = type ? `--${type}` : "";
  function calculateProgress() {
    const result = (100 / maxProgress) * currentProgress;
    return `${result}%`;
  }

  return (
    <div className="progress-bar-container">
      <span
        className={`progress-bar${modifier}`}
        style={{ width: calculateProgress() }}
      ></span>
    </div>
  );
}

export default ProgressBar;
