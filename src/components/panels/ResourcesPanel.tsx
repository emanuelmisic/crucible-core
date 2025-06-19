import Image from "@/components/ui/Image";

interface ResourcesPanelProps {}

function ResourcesPanel({}: ResourcesPanelProps) {
  return (
    <div className="resources-panel">
      <p>
        <Image type="icon" />0
      </p>
      <p>
        <Image type="icon" />0
      </p>
    </div>
  );
}

export default ResourcesPanel;
