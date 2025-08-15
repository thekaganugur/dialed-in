import { QuickRating } from "@/components/quick-rating";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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
import { fetchCoffeeBeans } from "@/lib/db/data";
import { ChevronDown, Settings2 } from "lucide-react";
import { createBrew } from "./actions";
import { FormActions } from "./form-actions";

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

export default async function CreateBrewPage() {
  const coffeeBeans = await fetchCoffeeBeans();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Brew</h1>
        <p className="text-muted-foreground mt-2">
          Log your coffee brewing session quickly and easily
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Brew Details</CardTitle>
          <p className="text-muted-foreground text-sm">
            Only bean and method required to get started
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
                      {coffeeBeans.map((bean) => (
                        <SelectItem key={bean.id} value={bean.id}>
                          {bean.name} - {bean.roaster} ({bean.origin})
                        </SelectItem>
                      ))}
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

              <QuickRating helpText="Optional: How was this brew?" />
            </div>

            {/* Optional Fields - Collapsible */}
            <Collapsible>
              <CollapsibleTrigger className="bg-muted/30 hover:bg-muted/50 flex w-full cursor-pointer items-center justify-between rounded-lg border p-4 text-sm font-medium data-[state=open]:rounded-b-none">
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

            <FormActions />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
