import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { BreadcrumbNav } from "./breadcrumb-nav";

export function SiteHeader() {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b">
      <div className="flex flex-1 items-center gap-2 px-3">
        <SidebarTrigger className="-ml-1" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <BreadcrumbNav />
      </div>
    </header>
  );
}
