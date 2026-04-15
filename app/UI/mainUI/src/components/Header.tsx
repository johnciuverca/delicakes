import { Link } from 'react-router-dom';

export function Header(): React.JSX.Element {
  return (
    <header className="header-flex">
      <h1>
        <Link to="/" className="home-link" style={{ color: 'inherit', textDecoration: 'none' }}>
          Delicakes
          <span className="tooltip">Home</span>
        </Link>
      </h1>
      <div className="social-icons">
        <a href="https://instagram.com" target="_blank" aria-label="Instagram" rel="noreferrer">
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg"
            alt="Instagram"
            width="32"
            height="32"
          />
        </a>
        <a href="https://facebook.com" target="_blank" aria-label="Facebook" rel="noreferrer">
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg"
            alt="Facebook"
            width="32"
            height="32"
          />
        </a>
        <a href="https://tiktok.com" target="_blank" aria-label="TikTok" rel="noreferrer">
          <img
            src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/tiktok.svg"
            alt="TikTok"
            width="32"
            height="32"
          />
        </a>
      </div>
    </header>
  );
}
