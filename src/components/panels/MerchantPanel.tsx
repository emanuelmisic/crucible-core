import Image from "@/components/ui/Image";

interface MerchantPanelProps {
  ores: GameResourceOre[];
}

function MerchantPanel({ ores }: MerchantPanelProps) {
  return (
    <div className="merchant-panel">
      <div className="merchant-panel__item-container">
        {ores.map((ore) => (
          <div key={ore.name} className="item">
            <Image resource={ore} />
            <span>{ore.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MerchantPanel;
