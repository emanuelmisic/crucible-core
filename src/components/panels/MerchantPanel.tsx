import Image from "@/components/ui/Image";

interface MerchantPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
  sellAll: (ore: GameResource) => void;
  sellHalf: (ore: GameResource) => void;
}

function MerchantPanel({
  ores,
  alloys,
  sellAll,
  sellHalf,
}: MerchantPanelProps) {
  return (
    <div className="merchant-panel">
      <div className="merchant-panel__header">
        <button>Ores</button>
        <button>Alloys</button>
      </div>
      <div className="merchant-panel__item-container">
        {ores.map((ore) => (
          <div key={ore.name} className="item">
            <Image size={75} resource={ore} />
            <span className="item__price">${ore.sellingPrice}</span>
            <button onClick={() => sellHalf(ore)}>SELL HALF</button>
            <button onClick={() => sellAll(ore)}>SELL ALL</button>
          </div>
        ))}
        {alloys.map((alloy) => (
          <div key={alloy.name} className="item">
            <Image size={75} resource={alloy} />
            <span className="item__price">${alloy.sellingPrice}</span>
            <button onClick={() => sellHalf(alloy)}>SELL HALF</button>
            <button onClick={() => sellAll(alloy)}>SELL ALL</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MerchantPanel;
