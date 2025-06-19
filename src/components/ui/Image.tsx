interface ImageProps {
  type?: string;
}

function Image({ type }: ImageProps) {
	const size = type === 'icon' ? 25 : 100
  return <img src="" alt="image" width={size} height={size} />;
}

export default Image;
