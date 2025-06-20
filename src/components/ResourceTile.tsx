import Image from "@/components/ui/Image";

interface ResourceTileProps {
  resource: GameResource;
}

function ResourceTile({ resource }: ResourceTileProps) {
  return <Image className="mining-tile" resource={resource} />;
}

export default ResourceTile;
