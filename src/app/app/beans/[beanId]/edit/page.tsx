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
import { fetchBeanById } from "@/lib/db/data";
import { processEnum, roastLevelEnum } from "@/lib/db/schema";
import { capitalize, formatRoastLevel } from "@/lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { updateBean } from "./actions";
import { FormActions } from "./form-actions";

export const metadata: Metadata = {
  title: "Edit Bean",
};

interface EditBeanPageProps {
  params: Promise<{ beanId: string }>;
}

export default async function EditBeanPage({ params }: EditBeanPageProps) {
  const { beanId } = await params;
  const bean = await fetchBeanById(beanId);

  if (!bean) {
    notFound();
  }

  const updateBeanAction = updateBean.bind(null, beanId);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Bean</h1>
        <p className="text-muted-foreground mt-2">
          Update the details for {bean.name}
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Bean Details</CardTitle>
          <p className="text-muted-foreground text-sm">
            Modify the information for this coffee bean.
          </p>
        </CardHeader>

        <CardContent>
          <form action={updateBeanAction} className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Bean Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Ethiopian Yirgacheffe"
                  defaultValue={bean.name}
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
                    defaultValue={bean.roaster || ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="origin">Origin</Label>
                  <Input
                    id="origin"
                    name="origin"
                    placeholder="e.g., Ethiopia"
                    defaultValue={bean.origin || ""}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="roastLevel">Roast Level</Label>
                  <Select name="roastLevel" defaultValue={bean.roastLevel || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select roast level" />
                    </SelectTrigger>
                    <SelectContent>
                      {roastLevelEnum.enumValues.map((level) => (
                        <SelectItem key={level} value={level}>
                          {formatRoastLevel(level)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="process">Process</Label>
                  <Select name="process" defaultValue={bean.process || ""}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select process" />
                    </SelectTrigger>
                    <SelectContent>
                      {processEnum.enumValues.map((process) => (
                        <SelectItem key={process} value={process}>
                          {capitalize(process)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roastDate">Roast Date</Label>
                <Input
                  id="roastDate"
                  name="roastDate"
                  type="date"
                  defaultValue={
                    bean.roastDate
                      ? new Date(bean.roastDate).toISOString().split("T")[0]
                      : ""
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Additional notes about this bean..."
                  defaultValue={bean.notes || ""}
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