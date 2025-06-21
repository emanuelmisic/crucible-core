import Image from "@/components/ui/Image";

interface ResourceTileProps {
  resource: GameResource;
  onClick?: () => void;
}

function ResourceTile({ resource, onClick }: ResourceTileProps) {
  return <div onClick={onClick}>
	<Image className="mining-tile" resource={resource} />
  </div>;
}

export default ResourceTile;
