import ironOre from "@/assets/images/ores/iron.png";
import bronzeOre from "@/assets/images/ores/bronze.png";
import silverOre from "@/assets/images/ores/silver.png";
import goldOre from "@/assets/images/ores/gold.png";
import platinumOre from "@/assets/images/ores/platinum.png";
import diamondOre from "@/assets/images/ores/diamond.png";
import titaniumOre from "@/assets/images/ores/titanium.png";
import crystalOre from "@/assets/images/ores/crystal.png";
import etheriumOre from "@/assets/images/ores/etherium.png";
import oxidiumOre from "@/assets/images/ores/oxidium.png";
import baseteriumOre from "@/assets/images/ores/baseterium.png";

import ironAlloy from "@/assets/images/alloys/iron.png";
import bronzeAlloy from "@/assets/images/alloys/bronze.png";
import silverAlloy from "@/assets/images/alloys/silver.png";
import goldAlloy from "@/assets/images/alloys/gold.png";
import platinumAlloy from "@/assets/images/alloys/platinum.png";

interface ResourceImageProps {
  value: string;
  size?: number;
  className?: string;
}

function Image({value, size = 25, className }: ResourceImageProps) {
  function _getImage(value: string) {
    switch (value) {
      // ORES
      case "iron_ore":
        return ironOre;
      case "bronze_ore":
        return bronzeOre;
      case "silver_ore":
        return silverOre;
      case "gold_ore":
        return goldOre;
      case "platinum_ore":
        return platinumOre;
      case "diamond_ore":
        return diamondOre;
      case "titanium_ore":
        return titaniumOre;
      case "crystal_ore":
        return crystalOre;
      case "etherium_ore":
        return etheriumOre;
      case "oxidium_ore":
        return oxidiumOre;
      case "baseterium_ore":
        return baseteriumOre;

      // ALLOYS
      case "iron_alloy":
        return ironAlloy;
      case "bronze_alloy":
        return bronzeAlloy;
      case "silver_alloy":
        return silverAlloy;
      case "gold_alloy":
        return goldAlloy;
      case "platinum_alloy":
        return platinumAlloy;
      default:
        return undefined;
    }
  }

  return (
    <img
      className={className}
      src={_getImage(value)}
      alt={value}
      width={size}
      height={size}
    />
  );
}

export default Image;
