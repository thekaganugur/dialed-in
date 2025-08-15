"use client";

import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  onSearch,
  placeholder = "Search brews...",
}: SearchBarProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [isPending, startTransition] = useTransition();

  const queryParam = searchParams.get("query")?.toString();

  const debouncedSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("query", value);
    } else {
      params.delete("query");
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`);
    });
  }, 300);

  const handleClear = () => {
    onSearch?.("");
  };

  return (
    <div className="relative">
      {isPending ? (
        <Loader2 className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 animate-spin" />
      ) : (
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
      )}
      <Input
        defaultValue={queryParam}
        onChange={(e) => debouncedSearch(e.target.value)}
        placeholder={placeholder}
        className="pr-10 pl-10"
      />
      {queryParam && (
        <button
          onClick={handleClear}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
