import ironOre from "@/assets/images/ores/iron.png";
import bronzeOre from "@/assets/images/ores/bronze.png";
import silverOre from "@/assets/images/ores/silver.png";
import goldOre from "@/assets/images/ores/gold.png";
import platinumOre from "@/assets/images/ores/platinum.png";
import diamondOre from "@/assets/images/ores/diamond.png";
import titaniumOre from "@/assets/images/ores/titanium.png";

import ironAlloy from "@/assets/images/alloys/iron.png";
import bronzeAlloy from "@/assets/images/alloys/bronze.png";
import silverAlloy from "@/assets/images/alloys/silver.png";
import goldAlloy from "@/assets/images/alloys/gold.png";
import platinumAlloy from "@/assets/images/alloys/platinum.png";

import ironPickaxe from "@/assets/images/upgrades/iron_pickaxe.png";
import goldPickaxe from "@/assets/images/upgrades/gold_pickaxe.png";

interface ImageProps {
  resource: GameResource | GameUpgrade;
  size?: number;
  className?: string;
}

function Image({ resource, size = 25, className }: ImageProps) {
  function getResourceImage(res: GameResource | GameUpgrade) {
    if (res.type === "ore") return _getOreImage(res.value);
    else if (res.type === "alloy") return _getAlloyImage(res.value);
    else return _getUpgradeImage(res.value);
  }

  function _getOreImage(value: string) {
    switch (value) {
      case "iron":
        return ironOre;
      case "bronze":
        return bronzeOre;
      case "silver":
        return silverOre;
      case "gold":
        return goldOre;
      case "platinum":
        return platinumOre;
      case "diamond":
        return diamondOre;
      case "titanium":
        return titaniumOre;
      default:
        return "";
    }
  }

  function _getAlloyImage(value: string) {
    switch (value) {
      case "iron":
        return ironAlloy;
      case "bronze":
        return bronzeAlloy;
      case "silver":
        return silverAlloy;
      case "gold":
        return goldAlloy;
      case "platinum":
        return platinumAlloy;
      default:
        return "";
    }
  }

  function _getUpgradeImage(value: string) {
    switch (value) {
      case "iron_pickaxe":
        return ironPickaxe;
      case "gold_pickaxe":
        return goldPickaxe;
      case "basic_fuel":
        return "";
      case "advanced_fuel":
        return "";
      case "small_container":
        return;
      case "medium_crate":
        return "";
      default:
        return "";
    }
  }

  return (
    <img
      className={className}
      src={getResourceImage(resource)}
      alt={resource.value}
      width={size}
      height={size}
    />
  );
}

export default Image;
