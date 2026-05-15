import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.98 3.23 9.2 7.71 10.69.56.1.77-.24.77-.54v-1.9c-3.14.68-3.8-1.34-3.8-1.34-.51-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.18 1.74 1.18 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.52-2.51-.29-5.15-1.26-5.15-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.44.11-3 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.56.23 2.71.11 3 .73.79 1.17 1.8 1.17 3.04 0 4.35-2.64 5.3-5.16 5.59.41.35.78 1.04.78 2.1v3.11c0 .3.21.65.78.54a11.27 11.27 0 0 0 7.71-10.69C23.25 5.48 18.27.5 12 .5Z"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M18.244 2H21.5l-7.51 8.58L23 22h-6.93l-5.43-7.1L4.4 22H1.13l8.04-9.18L1 2h7.07l4.91 6.49L18.244 2Zm-1.21 18h1.84L7.05 4H5.1l11.934 16Z"
      />
    </svg>
  );
}

export function QiitaIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 2.4a9.6 9.6 0 1 0 0 19.2 9.6 9.6 0 0 0 0-19.2Zm5.7 14.96a.6.6 0 0 1-.86.07c-1.1-.92-2.36-1.55-3.84-1.55-1.48 0-2.74.63-3.84 1.55a.6.6 0 0 1-.78-.92c1.32-1.13 2.93-1.93 4.62-1.93s3.3.8 4.62 1.93a.6.6 0 0 1 .08.85ZM9.04 11.36c-.92 0-1.56-.74-1.56-1.66s.64-1.66 1.56-1.66c.92 0 1.56.74 1.56 1.66s-.64 1.66-1.56 1.66Zm5.92 0c-.92 0-1.56-.74-1.56-1.66s.64-1.66 1.56-1.66c.92 0 1.56.74 1.56 1.66s-.64 1.66-1.56 1.66Z"
      />
    </svg>
  );
}

export function ZennIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M2.4 19.2 12.96 4.32a.48.48 0 0 1 .79 0L15.6 6.96 8.16 19.2H2.4Zm9.84 0 7.36-12L21.6 9.84 16.08 19.2h-3.84Z"
      />
    </svg>
  );
}

export function SizuIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="currentColor"
        d="M12 2C8 2 5.4 6.2 6.2 10.8 4.5 11.5 3 13.4 3 15.6c0 3 2.6 5.4 6 5.4 1.6 0 3-.5 4-1.4 1 .9 2.4 1.4 4 1.4 3.4 0 6-2.4 6-5.4 0-2.2-1.5-4.1-3.2-4.8C20.6 6.2 18 2 14 2c-.7 0-1.4.2-2 .4-.6-.2-1.3-.4-2-.4Zm0 6.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm5 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2Z"
      />
    </svg>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden focusable="false" {...props}>
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.5 6.5h17v11h-17z M3.5 6.8 12 13l8.5-6.2"
      />
    </svg>
  );
}

export const socialIconMap = {
  github: GitHubIcon,
  x: XIcon,
  qiita: QiitaIcon,
  zenn: ZennIcon,
  sizu: SizuIcon,
  email: MailIcon,
} as const;
