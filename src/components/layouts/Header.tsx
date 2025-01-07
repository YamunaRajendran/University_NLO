"use client";

import Image from 'next/image';
import Link from 'next/link';

export function Header() {
  return (
    <header className="sticky top-0 z-30 h-20 border-b border-[#2E6BB2]/30 bg-[#21265E] backdrop-blur-sm">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/overview" className="w-52 h-16 relative hover:opacity-80 transition-opacity">
            <Image
              src="/logo/nlo logo-Photoroom.png"
              alt="NLO Logo"
              fill
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
