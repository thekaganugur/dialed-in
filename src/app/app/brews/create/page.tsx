import { QuickRating } from "@/components/quick-rating";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { fetchBrewById, fetchCoffeeBeans } from "@/lib/db/data";
import { formatBrewDateTime } from "@/lib/utils";
import { ChevronDown, Info, Settings2 } from "lucide-react";
import { createBrew } from "./actions";
import { FormActions } from "./form-actions";
import { transformBrewForDuplication } from "./utils";

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

interface CreateBrewPageProps {
  searchParams: Promise<{ duplicate?: string }>;
}

export default async function CreateBrewPage({
  searchParams,
}: CreateBrewPageProps) {
  const { duplicate } = await searchParams;
  const coffeeBeans = await fetchCoffeeBeans();

  // Handle duplication using pure function
  const duplicateData = duplicate
    ? await fetchBrewById(duplicate).then((brew) =>
        brew ? transformBrewForDuplication(brew) : null,
      )
    : null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {duplicateData ? "Duplicate Brew" : "Create Brew"}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {duplicateData
            ? "Creating a new brew based on your previous session"
            : "Log your coffee brewing session quickly and easily"}
        </p>
      </div>

      {duplicateData && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <span>
              Creating new brew based on{" "}
              <strong className="inline">
                {duplicateData.originalBrewName}
              </strong>{" "}
              from {formatBrewDateTime(duplicateData.originalBrewDate)}
            </span>
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-2xl">
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg">Brew Details</CardTitle>
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
                  <Select
                    name="beanId"
                    required
                    defaultValue={duplicateData?.beanId}
                  >
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
                  <Select
                    name="method"
                    required
                    defaultValue={duplicateData?.method}
                  >
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
                  <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="doseGrams"
                        className="text-sm font-medium"
                      >
                        Dose (g)
                      </Label>
                      <Input
                        id="doseGrams"
                        name="doseGrams"
                        type="number"
                        step="0.1"
                        placeholder="18.0"
                        defaultValue={duplicateData?.doseGrams}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="yieldGrams"
                        className="text-sm font-medium"
                      >
                        Yield (g)
                      </Label>
                      <Input
                        id="yieldGrams"
                        name="yieldGrams"
                        type="number"
                        step="0.1"
                        placeholder="36.0"
                        defaultValue={duplicateData?.yieldGrams}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="brewTimeSeconds"
                        className="text-sm font-medium"
                      >
                        Time (s)
                      </Label>
                      <Input
                        id="brewTimeSeconds"
                        name="brewTimeSeconds"
                        type="number"
                        placeholder="30"
                        defaultValue={duplicateData?.brewTimeSeconds}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="waterTempCelsius"
                        className="text-sm font-medium"
                      >
                        Temp (°C)
                      </Label>
                      <Input
                        id="waterTempCelsius"
                        name="waterTempCelsius"
                        type="number"
                        placeholder="93"
                        defaultValue={duplicateData?.waterTempCelsius}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="grindSetting"
                      className="text-sm font-medium"
                    >
                      Grind Setting
                    </Label>
                    <Input
                      id="grindSetting"
                      name="grindSetting"
                      placeholder="e.g., 15 (Comandante), Medium-fine"
                      defaultValue={duplicateData?.grindSetting}
                    />
                  </div>

                  {/* Combined Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Notes & Flavors
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      placeholder="Any brewing notes, flavor observations, or thoughts about this brew..."
                      className="min-h-[80px]"
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
