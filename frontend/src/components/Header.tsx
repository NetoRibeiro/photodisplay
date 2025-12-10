import { Link } from 'preact-router';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => (
  <header class="sticky top-0 z-20 bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-gray-950/70">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      {/* @ts-ignore */}
      <Link href="/" className="text-xl font-semibold tracking-tight text-white">
        Photo Display
      </Link>
      <nav class="flex gap-4 text-sm uppercase tracking-wide">
        {/* @ts-ignore */}
        <Link activeClassName="text-accent" href="/">
          Gallery
        </Link>
        {/* @ts-ignore */}
        <Link activeClassName="text-accent" href="/settings">
          Settings
        </Link>
        {/* @ts-ignore */}
        <Link activeClassName="text-accent" href="/slideshow" data-testid="btn-slideshow">
          Slideshow
        </Link>
        {onLogout && (
          <button
            onClick={onLogout}
            class="text-gray-400 hover:text-white transition-colors"
            type="button"
          >
            Logout
          </button>
        )}
      </nav>
    </div>
  </header>
);
