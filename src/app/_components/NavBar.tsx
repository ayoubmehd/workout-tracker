"use client";
import React, { useState } from 'react';

import { Dumbbell, Home, FolderPlus, BarChart, Menu, X } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavBar: React.FC = () => {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const isActive = (path: string) => pathname === path;
  
  const links = [
    { to: '/', icon: <Home size={20} />, text: 'Home' },
    { to: '/library', icon: <Dumbbell size={20} />, text: 'Exercises' },
    { to: '/create', icon: <FolderPlus size={20} />, text: 'Create' },
    { to: '/stats', icon: <BarChart size={20} />, text: 'Stats' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-50 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Dumbbell className="h-8 w-8 text-emerald-500" />
          <span className="ml-2 text-xl font-bold text-gray-800">FitTrack</span>
        </Link>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 pt-16">
          <div className="bg-white h-auto w-full">
            <nav className="flex flex-col p-4">
              {links.map((link) => (
                <Link
                  key={link.to}
                  href={link.to}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3 my-1 rounded-md ${
                    isActive(link.to)
                      ? 'bg-emerald-500 text-white font-medium'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {link.icon}
                  <span className="ml-3">{link.text}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 w-64 bg-white shadow-md z-40">
        <div className="p-6 flex items-center">
          <Dumbbell className="h-8 w-8 text-emerald-500" />
          <span className="ml-2 text-xl font-bold text-gray-800">FitTrack</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          {links.map((link) => (
            <Link
              key={link.to}
              href={link.to}
              className={`flex items-center px-4 py-3 my-1 rounded-md transition-colors ${
                isActive(link.to)
                  ? 'bg-emerald-500 text-white font-medium'
                  : 'hover:bg-gray-100'
              }`}
            >
              {link.icon}
              <span className="ml-3">{link.text}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Content Padding for Mobile */}
      <div className="lg:hidden h-16"></div>
      
      {/* Content Padding for Desktop */}
      <div className="hidden lg:block lg:ml-64"></div>
    </>
  );
};

export default NavBar;