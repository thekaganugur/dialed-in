import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

export function BrewFilters() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
      <div className="flex items-center gap-2">
        <Filter className="text-muted-foreground h-4 w-4" />
        <span className="text-sm font-medium">Filters:</span>
      </div>
      
      <div className="flex gap-2">
        <Select>
          <SelectTrigger className="min-w-0 flex-1 sm:w-32">
            <SelectValue placeholder="Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="espresso">Espresso</SelectItem>
            <SelectItem value="v60">V60</SelectItem>
            <SelectItem value="aeropress">AeroPress</SelectItem>
            <SelectItem value="french_press">French Press</SelectItem>
            <SelectItem value="moka">Moka Pot</SelectItem>
          </SelectContent>
        </Select>
        
        <Select>
          <SelectTrigger className="min-w-0 flex-1 sm:w-28">
            <SelectValue placeholder="Rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any</SelectItem>
            <SelectItem value="5">5★</SelectItem>
            <SelectItem value="4">4★+</SelectItem>
            <SelectItem value="3">3★+</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
