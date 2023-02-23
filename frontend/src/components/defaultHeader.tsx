export default function Example() {
  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              className="h-8 w-auto float-left"
              src="/images/fribyte-logo.png"
              alt=""
            />
            <span>friByte CTF</span>
          </a>
        </div>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm font-semibold leading-6 text-gray-900">
            Logg ut
          </a>
        </div>
      </nav>
    </header>
  );
}
