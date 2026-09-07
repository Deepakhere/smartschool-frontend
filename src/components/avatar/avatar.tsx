import * as AvatarPrimitive from "@radix-ui/react-avatar";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
}

// built on Radix's Avatar: the fallback (initials) shows immediately and stays
// up if the image is missing, still loading, or fails to load (a broken/expired
// URL) — a plain <img src> can't do that on its own, it just shows a broken-image
// icon forever once src is set, even if it 404s
const Avatar = ({ name, src, size = 40 }: AvatarProps) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <AvatarPrimitive.Root
      className="rounded-full flex items-center justify-center text-white font-semibold overflow-hidden shrink-0"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: `hsl(${(name.length * 10) % 360}, 70%, 50%)`,
      }}
    >
      {src && (
        <AvatarPrimitive.Image
          src={src}
          alt={name}
          className="w-full h-full object-cover"
        />
      )}
      <AvatarPrimitive.Fallback
        className="flex items-center justify-center w-full h-full"
        delayMs={src ? 300 : 0}
      >
        <span style={{ fontSize: `${size / 2}px`, lineHeight: 1 }}>{initials}</span>
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};

export default Avatar;
