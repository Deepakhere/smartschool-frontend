const Logo = () => {
  return (
    <svg
      width="100"
      height="80"
      viewBox="0 0 300 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g transform="translate(100, 100)">
        <circle cx="-40" cy="-30" r="15" fill="#4CAF50" />
        <rect x="-47" y="-15" width="14" height="30" fill="#4CAF50" rx="2" />

        <circle cx="0" cy="-35" r="18" fill="#2196F3" />
        <rect x="-9" y="-17" width="18" height="35" fill="#2196F3" rx="2" />

        <circle cx="40" cy="-30" r="15" fill="#FF9800" />
        <rect x="33" y="-15" width="14" height="30" fill="#FF9800" rx="2" />
      </g>
    </svg>
  );
};

export default Logo;
