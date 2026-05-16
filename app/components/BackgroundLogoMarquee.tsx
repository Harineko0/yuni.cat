type Props = {
  label: string;
  repeat?: number;
};

export function BackgroundLogoMarquee({ label, repeat = 6 }: Props) {
  return (
    <div className="logo-marquee" aria-hidden="true">
      <div className="logo-marquee-track">
        {Array.from({ length: repeat * 2 }).map((_, i) => (
          <span key={i} className="logo-marquee-text font-compressed">
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
