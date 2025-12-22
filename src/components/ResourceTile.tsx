import ResourceImage from "@/components/ui/image/ResourceImage";

interface ResourceTileProps {
  resource: GameResource;
  onClick?: () => void;
}

function ResourceTile({ resource, onClick }: ResourceTileProps) {
  return (
    <div onClick={onClick}>
      <ResourceImage
        type={resource.type}
        value={resource.value}
        className="mining-tile"
        size={100}
      />
    </div>
  );
}

export default ResourceTile;
