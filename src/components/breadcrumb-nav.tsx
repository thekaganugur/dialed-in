"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  brews: "Brews",
  create: "Create",
  beans: "Beans",
};

// UUID pattern to detect dynamic IDs
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function BreadcrumbNav() {
  const pathname = usePathname();

  if (pathname === "/") {
    return <h1 className="text-base font-medium">BrewLog</h1>;
  }

  const segments = pathname.split("/").filter(Boolean);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/" + segments.slice(0, index + 1).join("/");
          const title = titles[segment] || (UUID_PATTERN.test(segment) ? "Detail" : segment);
          const isLast = index === segments.length - 1;
          const isFirst = index === 0;

          return (
            <div key={href} className="flex items-center">
              {!isFirst && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link href={href}>{title}</Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </div>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

