"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const isOverviewPage = pathname === "/overview" || pathname === "/overview/";

  return (
    <header className="sticky top-0 z-30 h-20 bg-transparent backdrop-blur-sm">
      <div className="h-full px-8 flex items-center justify-between">
        <div className="flex gap-2">
          {!isOverviewPage && (
            <button
              onClick={() => router.back()}
              className="w-12 h-12 flex items-center justify-center bg-[#21265E] rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          )}
          {!isOverviewPage && (
            <Link
              href="/"
              className="w-12 h-12 flex items-center justify-center bg-[#21265E] rounded-lg hover:bg-opacity-80 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          )}
        </div>
        <Link
          href="/overview"
          className="w-52 h-16 relative hover:opacity-80 transition-opacity"
        >
          <Image
            src="/logo/nlo logo-Photoroom.png"
            alt="NLO Logo"
            fill
            className="object-contain brightness-0 invert"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
