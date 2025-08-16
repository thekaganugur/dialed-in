"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { UUID_PATTERN } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const titles: Record<string, string> = {
  dashboard: "Dashboard",
  brews: "Brews",
  beans: "Beans",
  create: "Create",
  edit: "Edit",
};

export function BreadcrumbNav() {
  const pathname = usePathname();

  const filteredSegments = pathname
    .split("/")
    .filter(Boolean)
    .filter((segment) => segment !== "app");

  const segments =
    filteredSegments.length === 0 ? ["dashboard"] : filteredSegments;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segments.map((segment, index) => {
          const href = "/app/" + segments.slice(0, index + 1).join("/");
          const title =
            titles[segment] ||
            (UUID_PATTERN.test(segment) ? "Detail" : segment);
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
