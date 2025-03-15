import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";
import Header from "./components/Header";
import DashboardSidebar from "./components/Dashboard";
import "./global.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full overflow-hidden" suppressHydrationWarning>
      <body className="h-full flex flex-col overflow-hidden">
        <SessionProvider>
          {/* Skip Link for Accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only absolute top-2 left-2 bg-white text-midnightBlue px-3 py-2 rounded-md"
          >
            Skip to main content
          </a>

          <Header />

          {/* Layout Wrapper */}
          <div className="flex flex-grow min-h-screen bg-midnightBlue">
            {/* Sidebar Navigation */}
            <aside className="h-screen flex-shrink-0">
              <DashboardSidebar />
            </aside>

            {/* Main Content */}
            <main
              id="main-content"
              className="flex-grow h-screen overflow-y-auto"
              role="main"
              aria-labelledby="page-title"
            >
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
