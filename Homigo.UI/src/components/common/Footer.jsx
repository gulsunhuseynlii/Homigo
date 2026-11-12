function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-4">

          {/* Homigo */}
          <div>
            <h2 className="text-2xl font-bold">
              Homigo
            </h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
              Find trusted professionals for your everyday
              needs and get quality services at your doorstep.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold">
              Quick Links
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a
                href="/"
                className="block transition hover:text-white"
              >
                Home
              </a>

              <a
                href="/categories"
                className="block transition hover:text-white"
              >
                Categories
              </a>

              <a
                href="/services"
                className="block transition hover:text-white"
              >
                Services
              </a>
            </div>
          </div>

          {/* For Users */}
          <div>
            <h3 className="font-semibold">
              For Users
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <a
                href="/login"
                className="block transition hover:text-white"
              >
                Login
              </a>

              <a
                href="/register"
                className="block transition hover:text-white"
              >
                Register
              </a>

              <a
                href="/become-provider"
                className="block transition hover:text-white"
              >
                Become a Provider
              </a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-400">
              <p>📧 support@homigo.com</p>
              <p>📞 +994 50 000 00 00</p>
              <p>📍 Baku, Azerbaijan</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-slate-800 pt-6">
          <div className="flex flex-col gap-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

            <p>
              © 2026 Homigo. All rights reserved.
            </p>

            <div className="flex gap-5">
              <a
                href="#"
                className="transition hover:text-white"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="transition hover:text-white"
              >
                Terms of Service
              </a>
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;