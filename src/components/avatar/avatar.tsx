interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

const Avatar = ({ name, src, size = 40 }: AvatarProps) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold overflow-hidden"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: src
          ? "transparent"
          : `hsl(${(name.length * 10) % 360}, 70%, 50%)`,
      }}
    >
      {src ? (
        <img
          src={src || "/placeholder.svg"}
          alt={name}
          className="w-full h-full object-cover"
        />
      ) : (
        <span style={{ fontSize: `${size / 2}px`, lineHeight: 1 }}>
          {initials}
        </span>
      )}
    </div>
  );
};

export default Avatar;
