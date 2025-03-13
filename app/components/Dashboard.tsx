'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import ActivityFeed from './ActivityFeed';

const DashboardSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav
      ref={sidebarRef}
      className={`relative bg-teal h-screen flex flex-col transition-all ease-in-out duration-300 ${
        isExpanded ? 'md:w-64' : 'md:w-20'
      }`}
      onMouseEnter={() => !isMobile && setIsExpanded(true)}
      onMouseLeave={() => !isMobile && setIsExpanded(false)}
      role="navigation"
      aria-label="Sidebar Navigation"
      aria-expanded={isExpanded}
    >
      {/* Navigation Links */}
      <div className="flex flex-col space-y-6 px-5 pt-5">
        <Link href="/" className="flex items-center focus:ring-2 focus:ring-blue-300" tabIndex={0} aria-label="Go to Home">
          <img src="/assets/folder-solid.svg" alt="" className="h-6 w-6" />
          {(isExpanded || isMobile) && <span className="ml-3 text-white">Home</span>}
        </Link>

        <Link href="/favorites" className="flex items-center focus:ring-2 focus:ring-blue-300" tabIndex={0} aria-label="Go to Favorites">
          <img src="/assets/star-solid.svg" alt="" className="h-6 w-6" />
          {(isExpanded || isMobile) && <span className="ml-3 text-white">Favorites</span>}
        </Link>

        <Link href="/watch-later" className="flex items-center focus:ring-2 focus:ring-blue-300" tabIndex={0} aria-label="Go to Watch Later">
          <img src="/assets/clock-solid.svg" alt="" className="h-6 w-6" />
          {(isExpanded || isMobile) && <span className="ml-3 text-white">Watch Later</span>}
        </Link>
      </div>

      {/* Activity Feed */}
      <div className="flex-grow overflow-y-auto px-4">
        {isExpanded && <ActivityFeed />}
      </div>
    </nav>
  );
};

export default DashboardSidebar;
