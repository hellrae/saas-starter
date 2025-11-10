import { appSeo } from "@/lib/utils/seo";
import Image from "next/image";
import Link from "next/link";

const NavbarLogo = ({ logoSrc }: { logoSrc?: string }) => {
  return (
    <div className="flex items-center gap-3">
      <Link href="/" className="flex items-center gap-3 focus:outline-none">
        {logoSrc ? (
          <Image
            src={logoSrc || ""}
            // TODO: fix alt prop
            alt="profile"
            width={36}
            height={36}
            className="rounded"
          />
        ) : (
          <div className="h-9 w-9 rounded bg-neutral-800 dark:bg-white text-white dark:text-neutral-800 text-2xl flex items-center justify-center leading-none font-semibold">
            {appSeo.name[0]}
          </div>
        )}

        <div className="hidden sm:flex flex-col leading-tight">
          <span className="font-semibold">{appSeo.name}</span>
          <span className="text-xs text-muted-foreground">
            Build something beautiful
          </span>
        </div>
      </Link>
    </div>
  );
};

export default NavbarLogo;
