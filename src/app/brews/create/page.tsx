import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Coffee, Settings2 } from "lucide-react";
import Link from "next/link";
import { createBrew } from "./actions";

const brewMethods = [
  "espresso",
  "v60",
  "aeropress",
  "french_press",
  "moka",
  "chemex",
  "turkish",
  "cold_brew",
];

export default function CreateBrewPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Quick Brew Log
          </CardTitle>
          <p className="text-muted-foreground text-sm">
            Log your coffee in seconds. Only bean and method required.
          </p>
        </CardHeader>

        <CardContent>
          <form action={createBrew} className="space-y-6">
            {/* Essential Fields - Always Visible */}
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="beanId">Coffee Bean *</Label>
                  <Select name="beanId" required>
                    <SelectTrigger id="beanId" className="w-full">
                      <SelectValue placeholder="Select a coffee bean" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sample">
                        Sample Bean - Ethiopian Yirgacheffe
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1 space-y-2">
                  <Label htmlFor="method">Brew Method *</Label>
                  <Select name="method" required>
                    <SelectTrigger id="method" className="w-full">
                      <SelectValue placeholder="Select brew method" />
                    </SelectTrigger>
                    <SelectContent>
                      {brewMethods.map((method) => (
                        <SelectItem key={method} value={method}>
                          {method.replace(/_/g, " ").toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Quick Rating */}
              <div className="space-y-2">
                <Label>Quick Rating</Label>
                <div className="flex gap-2">
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value="1"
                      className="peer sr-only"
                    />
                    <div className="rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors peer-checked:border-red-300 peer-checked:bg-red-100 peer-checked:text-red-600 hover:bg-gray-50">
                      1⭐
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value="2"
                      className="peer sr-only"
                    />
                    <div className="rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors peer-checked:border-orange-300 peer-checked:bg-orange-100 peer-checked:text-orange-600 hover:bg-gray-50">
                      2⭐
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value="3"
                      className="peer sr-only"
                    />
                    <div className="rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors peer-checked:border-yellow-300 peer-checked:bg-yellow-100 peer-checked:text-yellow-600 hover:bg-gray-50">
                      3⭐
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value="4"
                      className="peer sr-only"
                    />
                    <div className="rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors peer-checked:border-blue-300 peer-checked:bg-blue-100 peer-checked:text-blue-600 hover:bg-gray-50">
                      4⭐
                    </div>
                  </label>
                  <label className="flex cursor-pointer items-center space-x-2">
                    <input
                      type="radio"
                      name="rating"
                      value="5"
                      className="peer sr-only"
                    />
                    <div className="rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors peer-checked:border-green-300 peer-checked:bg-green-100 peer-checked:text-green-600 hover:bg-gray-50">
                      5⭐
                    </div>
                  </label>
                </div>
                <p className="text-muted-foreground text-xs">
                  Optional: How was this brew?
                </p>
              </div>
            </div>

            {/* Optional Fields - Collapsible */}
            <Collapsible>
              <CollapsibleTrigger className="bg-muted/30 hover:bg-muted/50 w-full flex cursor-pointer items-center justify-between rounded-lg border p-4 text-sm font-medium data-[state=open]:rounded-b-none">
                <span className="flex items-center gap-2">
                  <Settings2 className="h-4 w-4" />
                  Add Brewing Details (optional)
                </span>
                <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="bg-muted/10 space-y-4 rounded-lg rounded-t-none border border-t-0 p-4">
                  {/* Quick Parameters */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="doseGrams" className="text-xs">
                        Dose (g)
                      </Label>
                      <Input
                        name="doseGrams"
                        type="number"
                        step="0.1"
                        placeholder="18.0"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yieldGrams" className="text-xs">
                        Yield (g)
                      </Label>
                      <Input
                        name="yieldGrams"
                        type="number"
                        step="0.1"
                        placeholder="36.0"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brewTimeSeconds" className="text-xs">
                        Time (s)
                      </Label>
                      <Input
                        name="brewTimeSeconds"
                        type="number"
                        placeholder="30"
                        className="text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="waterTempCelsius" className="text-xs">
                        Temp (°C)
                      </Label>
                      <Input
                        name="waterTempCelsius"
                        type="number"
                        placeholder="93"
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="grindSetting" className="text-sm">
                      Grind Setting
                    </Label>
                    <Input
                      name="grindSetting"
                      placeholder="e.g., 15 (Comandante), Medium-fine"
                      className="text-sm"
                    />
                  </div>

                  {/* Combined Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm">
                      Notes & Flavors
                    </Label>
                    <Textarea
                      name="notes"
                      placeholder="Any brewing notes, flavor observations, or thoughts about this brew..."
                      className="min-h-[80px] text-sm"
                    />
                  </div>

                  {/* Hidden field to maintain compatibility */}
                  <input type="hidden" name="flavorNotes" value="" />
                </div>
              </CollapsibleContent>
            </Collapsible>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <Button type="submit" className="flex-1">
                <Coffee className="mr-2 h-4 w-4" />
                Save Brew Log
              </Button>
              <Button
                type="button"
                variant="outline"
                asChild
                className="sm:w-auto"
              >
                <Link href="/brews">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
