import Image from "@/components/ui/Image";

interface ResourcesPanelProps {
  ores: GameResourceOre[];
  alloys: GameResourceAlloy[];
}

function ResourcesPanel({ ores, alloys }: ResourcesPanelProps) {
  return (
    <div className="resources-panel">
		<div className="resources-panel__item">
		  {ores.map((ore) => (
			<p key={ore.name}>
			  <Image resource={ore} />
			  {ore.amount}
			</p>
		  ))}
		</div>
		<div className="resources-panel__item">
		  {alloys.map((alloy) => (
			<p key={alloy.name}>
			  <Image resource={alloy}/>
			  {alloy.amount}
			</p>
		  ))}
		</div>
	</div>
  );
}

export default ResourcesPanel;
