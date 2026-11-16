export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h3>StorePilot</h3>
        <p>Your destination for quality products.</p>
        <p>© {new Date().getFullYear()} StorePilot. All rights reserved.</p>
      </div>
    </footer>
  );
}
