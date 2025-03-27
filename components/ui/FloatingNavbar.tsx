"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from 'next/navigation';

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element;
  }[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Memoize handlers for better performance
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY > 0;
    if (isScrolled !== scrolled) {
      setIsScrolled(scrolled);
    }
  }, [isScrolled]);

  const handleResize = useCallback(() => {
    if (window.innerWidth >= 768 && isOpen) {
      setIsOpen(false);
    }
  }, [isOpen]);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      const direction = current! - scrollYProgress.getPrevious()!;
      setVisible(scrollYProgress.get() < 0.05 || direction < 0);
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.nav
        initial={{ opacity: 1, y: -100 }}
        animate={{ 
          opacity: visible ? 1 : 0,
          y: visible ? 0 : -100,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex max-w-fit fixed z-[5000] top-0 right-4 mx-auto px-4 py-4 items-center justify-between",
          "backdrop-blur-md bg-[rgba(17,25,40,0.65)] rounded-2xl border border-white/10",
          "hover:scale-[1.01] transition-all duration-300 ease-in-out will-change-transform",
          "sm:right-6 md:right-auto md:inset-x-0 md:px-8 lg:px-12 md:py-5 md:justify-center md:gap-x-12",
          isScrolled ? "mt-2 shadow-lg" : "mt-0",
          className
        )}
        aria-label="Main navigation"
      >
        {/* Mobile Menu Button */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Link 
            href="/" 
            className="text-[#64FFDA] text-xl font-mono font-black mr-8 hover:text-[#7EFFF4] transition-colors tracking-tighter"
            aria-label="Home"
          >
            Ali._
          </Link>
          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            className="relative z-50 p-1.5 rounded-lg bg-[#64FFDA]/10 hover:bg-[#64FFDA]/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <div className="w-5 h-4 flex flex-col justify-between">
              <motion.span
                animate={{ rotateZ: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
                className="w-full h-0.5 bg-[#64FFDA] block transform origin-left"
              />
              <motion.span
                animate={{ opacity: isOpen ? 0 : 1 }}
                className="w-full h-0.5 bg-[#64FFDA] block"
              />
              <motion.span
                animate={{ rotateZ: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
                className="w-full h-0.5 bg-[#64FFDA] block transform origin-left"
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="fixed top-[4.5rem] right-0 w-48 py-2 rounded-xl bg-[#1a2333] border border-white/10 shadow-xl md:hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="mobile-menu-button"
            >
              {navItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group px-4 py-2 hover:bg-white/5"
                  role="none"
                >
                  <Link
                    href={item.link}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center text-sm text-gray-300 hover:text-[#64FFDA] transition-colors font-black tracking-[0.2em] uppercase font-sans"
                    role="menuitem"
                  >
                    <span className="text-[#64FFDA]/60 font-mono mr-2 text-xs font-bold">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-x-8" role="navigation">
          {navItems.map((navItem: any, idx: number) => (
            <motion.div
              key={`nav-item-${idx}`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group"
            >
              <span 
                className="absolute -top-3 -right-3 text-xs font-mono text-[#64FFDA] opacity-60 tracking-wider transform rotate-12 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-0"
                aria-hidden="true"
              >
                {String(idx + 1).padStart(2, '0')}
              </span>
              <Link
                href={navItem.link}
                className="relative group flex items-center gap-x-2 text-neutral-50 hover:text-white transition-all duration-300 px-4"
                aria-current={pathname === navItem.link ? 'page' : undefined}
              >
                {navItem.icon && (
                  <span className="text-lg transition-transform group-hover:scale-110" aria-hidden="true">
                    {navItem.icon}
                  </span>
                )}
                <span className="text-sm font-black tracking-[0.2em] uppercase whitespace-nowrap text-neutral-50 hover:text-[#64FFDA] font-sans">
                  {navItem.name}
                </span>
                <span 
                  className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300" 
                  aria-hidden="true"
                />
              </Link>
              <span 
                className="absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#8892B0] opacity-40 font-mono"
                aria-hidden="true"
              >
                //
              </span>
            </motion.div>
          ))}
        </div>
      </motion.nav>
    </AnimatePresence>
  );
};
