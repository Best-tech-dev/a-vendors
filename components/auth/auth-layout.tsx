"use client";

import { useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRightSideWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      const scrollable = scrollRef.current;
      if (!scrollable) return;

      // Only forward if the form area is actually scrollable
      const isScrollable = scrollable.scrollHeight > scrollable.clientHeight;
      if (!isScrollable) return;

      scrollable.scrollBy({ top: e.deltaY, behavior: "auto" });
    },
    [],
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Left side - dynamic content */}
      <div className="flex w-full flex-col lg:w-1/2 h-full">
        {/* Fixed header */}
        <div className="shrink-0 px-8 pt-12 md:px-25">
          <Image
            src="/a-vendors-logo.svg"
            alt="A-Vendors logo"
            width={40}
            height={40}
            priority
          />
        </div>

        {/* Scrollable form content */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-8 md:px-25">
          <div className="flex flex-1 flex-col justify-center max-w-115 py-10">
            {children}
          </div>
        </div>

        {/* Fixed footer */}
        <div className="shrink-0 px-8 pb-12 pt-4 md:px-25 text-sm">
          <span className="text-brand-primary/60">
            Experiencing any trouble?
          </span>{" "}
          <Link
            href="/contact-support"
            className="font-semibold text-foreground hover:underline"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Right side - fixed branding */}
      <div
        onWheel={handleRightSideWheel}
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-brand-primary px-16 text-white"
      >
        <div className="flex flex-col items-start max-w-lg">
          <Image
            src="/imgs/auth-3d.png"
            alt="3D metallic cubes"
            width={300}
            height={300}
            className="mb-10 self-center"
            priority
          />
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Gear Up for Better
            <br />
            Procurement
          </h2>
          <p className="mt-4 text-base leading-7 text-white/80">
            Welcome to the driver&apos;s seat of your warehouse operations. We
            built this platform to take the guesswork out of procurement, so you
            can spend less time on spreadsheets and more time moving inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
