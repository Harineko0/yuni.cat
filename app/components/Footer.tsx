export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer font-jp">
      harineko @ {year}
    </footer>
  );
}
