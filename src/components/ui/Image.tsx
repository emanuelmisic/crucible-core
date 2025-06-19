import ironOre from '@/assets/images/ores/iron.png'

interface ImageProps {
  type?: string;
}

function Image({ type }: ImageProps) {
	const size = type === 'icon' ? 25 : 100
  return <img src={ironOre} alt="image" width={size} height={size} />;
}

export default Image;
