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
import { processEnum, roastLevelEnum } from "@/lib/db/schema";
import { createBean } from "../create/actions";
import { FormActions } from "./form-actions";

export default function CreateBeanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Bean</h1>
        <p className="text-muted-foreground mt-2">
          Add a new coffee bean to your collection
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Bean Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createBean} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Bean Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Ethiopian Yirgacheffe"
                  required
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roaster">Roaster</Label>
                  <Input
                    id="roaster"
                    name="roaster"
                    placeholder="e.g., Blue Bottle Coffee"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="e.g., Ethiopia"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roastLevel">Roast Level</Label>
                  <Select name="roastLevel">
                    <SelectTrigger>
                      <SelectValue placeholder="Select roast level" />
                    </SelectTrigger>
                    <SelectContent>
                      {roastLevelEnum.enumValues.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level.charAt(0).toUpperCase() +
                            level.slice(1).replace("-", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="process">Process</Label>
                  <Select name="process">
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processEnum.enumValues.map((process) => (
                        <SelectItem key={process} value={process}>
                          {process.charAt(0).toUpperCase() + process.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input id="purchaseDate" name="purchaseDate" type="date" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weightGrams">Weight (g)</Label>
                  <Input
                    id="weightGrams"
                    name="weightGrams"
                    type="number"
                    min="1"
                    placeholder="250"
                  />
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about this bean..."
                  rows={3}
                />
              </div>
            </div>

            <FormActions />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
