import { useGame } from "@/contexts/GameContext";
import { formatNumber } from "@/helpers/helperFunctions";

import Image from "@/components/ui/Image";
import ResourceTile from "@/components/ResourceTile";
import ProgressBar from "@/components/ui/ProgressBar";

function SmeltingItemTile({
  ores,
  selectedAlloy,
}: {
  ores: GameResourceOre[];
  selectedAlloy: GameResourceAlloy;
}) {
  const game = useGame();
  return (
    <>
      <div className="alloy-recipe">
        {Object.entries(selectedAlloy.smeltingRecipe).map(([key, value]) => (
          <span key={key}>
            <Image resource={ores.filter((ore) => ore.value === key)[0]} />{" "}
            {formatNumber(ores.filter((ore) => ore.value === key)[0].amount)}/
            {formatNumber(value)}
          </span>
        ))}
      </div>
      <div key={selectedAlloy.name} className="alloy">
        <ResourceTile
          resource={selectedAlloy}
          onClick={() => game.smeltAlloy(selectedAlloy)}
        />
        <ProgressBar
          type="smelting"
          currentProgress={game.smeltingProgress[selectedAlloy.value]}
          maxProgress={selectedAlloy.smeltingDifficulty}
        />
      </div>
    </>
  );
}

export default SmeltingItemTile;
