import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - dynamic content */}
      <div className="flex w-full flex-col justify-between px-[100px] py-12 lg:w-1/2">
        {/* Logo */}
        <div>
          <Image
            src="/a-vendors-logo.svg"
            alt="A-Vendors logo"
            width={40}
            height={40}
            priority
          />
        </div>

        {/* Dynamic form content */}
        <div className="flex flex-1 flex-col justify-center max-w-[460px]">
          {children}
        </div>

        {/* Footer */}
        <div className="text-sm">
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

      {/* Right side - static branding */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-brand-primary px-16 text-white">
        <div className="flex flex-col items-start max-w-lg">
          <Image
            src="/imgs/auth-3d.png"
            alt="3D metallic cubes"
            width={450}
            height={350}
            className="mb-10"
            priority
          />
          <h2 className="text-4xl font-bold leading-tight tracking-tight">
            Gear Up for Better
            <br />
            Procurement
          </h2>
          <p className="mt-4 text-base leading-7 text-white/80">
            Welcome to the driver's seat of your warehouse operations. We built
            this platform to take the guesswork out of procurement, so you can
            spend less time on spreadsheets and more time moving inventory.
          </p>
        </div>
      </div>
    </div>
  );
}
