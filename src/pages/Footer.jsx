export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-950 to-gray-950 border-t border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl p-6 text-center">
            <h4 className="font-bold text-lg mb-2 text-blue-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
              </svg>
              Police Emergency
            </h4>
            <p className="text-gray-400 mt-2">
              Toll-Free:{" "}
              <a
                href="tel:999"
                className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
              >
                999
              </a>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl p-6 text-center">
            <h4 className="font-bold text-lg mb-2 text-blue-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              
              Fire Department
            </h4>
            <p className="text-gray-400 mt-2">
              Call now:{" "}
              <a
                href="tel:0722111178"
                className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
              >
                0722 111 178
              </a>
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 shadow-xl p-6 text-center">
            <h4 className="font-bold text-lg mb-2 text-blue-300 flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              
              Ambulance Services
            </h4>
            <p className="text-gray-400 mt-2">
              Toll-Free:{" "}
              <a
                href="tel:444"
                className="text-blue-300 hover:text-blue-200 transition-colors font-medium"
              >
                444
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/10 text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Ajali! All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}