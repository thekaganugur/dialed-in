"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useCommandState } from "cmdk";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import * as React from "react";

export interface ComboboxItem {
  value: string;
  label: string;
}

const createCustomFilter = (suggestions: ComboboxItem[]) => {
  return (value: string, search: string) => {
    // Always show the create option
    if (value === "+create+") return 1;

    // Find the framework by value and search in its label
    const framework = suggestions.find((f) => f.value === value);
    if (framework?.label.toLowerCase().includes(search.toLowerCase())) return 1;

    return 0;
  };
};

interface ComboboxProps {
  items?: ComboboxItem[];
  onSelectionChange?: (value: string, item: ComboboxItem) => void;
  placeholder?: string;
  defaultValue?: string;
  onCreateNew?: (v: string) => Promise<ComboboxItem>;
}

export function Combobox({
  items = [],
  onSelectionChange,
  placeholder = "Select framework...",
  onCreateNew,
  defaultValue,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);
  const [suggestions, setSuggestions] = React.useState(items);
  const [isLoading, setIsLoading] = React.useState(false);

  console.log(defaultValue);

  const handleCreateNew = React.useCallback(
    async (searchValue: string) => {
      if (!onCreateNew) {
        return null;
      }

      setIsLoading(true);
      try {
        const newSuggestion = await onCreateNew(searchValue);

        setSuggestions((prev) => [...prev, newSuggestion]);
        setValue(newSuggestion.value);
        setOpen(false);
      } finally {
        setIsLoading(false);
      }
    },
    [onCreateNew],
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            !value && "text-muted-foreground",
            "w-[200px] justify-between",
          )}
        >
          {value
            ? suggestions.find((framework) => framework.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command filter={createCustomFilter(suggestions)}>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            {isLoading && (
              <CommandLoading className="text-muted-foreground py-2">
                {" "}
                Creating framework...{" "}
              </CommandLoading>
            )}
            {!isLoading && (
              <CommandEmpty className="text-muted-foreground py-2">
                No framework found.
              </CommandEmpty>
            )}
            <CommandGroup>
              {suggestions.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);

                    // Call callback with both value and item
                    if (newValue && onSelectionChange) {
                      const selectedItem = suggestions.find(
                        (f) => f.value === newValue,
                      );
                      if (selectedItem) {
                        onSelectionChange(newValue, selectedItem);
                      }
                    }
                  }}
                >
                  {framework.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === framework.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
            <CreateNewItem
              onCreateNew={async (v) => {
                await handleCreateNew(v);
              }}
              isCreating={isLoading}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function CreateNewItem({
  onCreateNew,
  isCreating = false,
}: {
  onCreateNew: (value: string) => Promise<void>;
  isCreating?: boolean;
}) {
  const search = useCommandState((state) => state.search);
  if (!search) return null;

  return (
    <CommandItem
      forceMount
      value="+create+"
      onSelect={() => onCreateNew(search)}
      className="text-muted-foreground"
      disabled={isCreating}
    >
      {isCreating ? (
        <>
          <div className="border-muted-foreground mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create new &quot;{search}&quot;
        </>
      )}
    </CommandItem>
  );
}
