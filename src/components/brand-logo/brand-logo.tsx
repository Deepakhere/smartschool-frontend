import { useTheme } from "@/context/theme-context";

interface BrandLogoProps {
  className?: string;
}

// schoolyn.png's wordmark text is navy — reads fine on a light background.
// schoolyn-light.png is the same mark with the wordmark rendered near-white,
// for use on a dark background instead. One place to pick the right asset.
const BrandLogo = ({ className }: BrandLogoProps) => {
  const { theme } = useTheme();
  const src = theme === "dark" ? "/schoolyn-light.png" : "/schoolyn.png";

  return <img src={src} alt="Schoolyn" className={className} />;
};

export default BrandLogo;
