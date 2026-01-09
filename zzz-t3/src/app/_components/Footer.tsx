import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-slate-900 text-white shadow-md border-t border-slate-800">
      <div className="w-full px-4 md:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">
              About
            </h3>
            <p className="text-sm text-slate-300">
              ZZZ Drive Disc Manager helps you track and manage your ZZZ Drive Discs efficiently, summarizing main stat and substats patterns as well as your luck in leveling up your drive discs.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/artifacts/recent_list"
                  className="text-sm text-slate-300 hover:text-yellow-500 transition-colors"
                >
                  Recent Drive Discs
                </Link>
              </li>
              <li>
                <Link
                  href="/artifacts/create"
                  className="text-sm text-slate-300 hover:text-yellow-500 transition-colors"
                >
                  Add Drive Discs
                </Link>
              </li>
              <li>
                <Link
                  href="/statistics"
                  className="text-sm text-slate-300 hover:text-yellow-500 transition-colors"
                >
                  Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div>
            <h3 className="text-lg font-semibold text-yellow-500 mb-3">
              Contact
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-slate-300">
                <a
                  href="mailto:buihuya4k49@gmail.com"
                  className="hover:text-yellow-500 transition-colors"
                >
                  buihuya4k49@gmail.com
                </a>
              </li>
              <li className="text-sm text-slate-300">
                <a
                  href="https://github.com/Fenny-Huy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 transition-colors"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-slate-800 text-center">
          <p className="text-xs md:text-sm text-slate-400">
            © {currentYear} ZZZ Drive Disc Manager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
