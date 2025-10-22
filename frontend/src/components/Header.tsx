import { Link } from 'preact-router/match';

export const Header = () => (
  <header class="sticky top-0 z-20 bg-gray-950/90 backdrop-blur supports-[backdrop-filter]:bg-gray-950/70">
    <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
      <Link href="/" class="text-xl font-semibold tracking-tight text-white">
        Photo Display
      </Link>
      <nav class="flex gap-4 text-sm uppercase tracking-wide">
        <Link activeClassName="text-accent" href="/">
          Gallery
        </Link>
        <Link activeClassName="text-accent" href="/settings">
          Settings
        </Link>
        <Link activeClassName="text-accent" href="/slideshow" data-testid="btn-slideshow">
          Slideshow
        </Link>
      </nav>
    </div>
  </header>
);
