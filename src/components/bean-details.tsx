import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatRoastLevel } from "@/lib/utils";
import { Bean } from "lucide-react";

interface CoffeeBean {
  origin: string | null;
  roastLevel: string | null;
  process: string | null;
}

interface BeanDetailsProps {
  bean: CoffeeBean;
}

export function BeanDetails({ bean }: BeanDetailsProps) {
  const hasDetails = bean.origin || bean.roastLevel || bean.process;

  if (!hasDetails) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bean className="h-5 w-5" />
          Bean Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {bean.origin && (
            <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
              <span className="text-muted-foreground font-medium">Origin</span>
              <span className="font-semibold">{bean.origin}</span>
            </div>
          )}
          {bean.roastLevel && (
            <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
              <span className="text-muted-foreground font-medium">Roast</span>
              <span className="font-semibold capitalize">
                {formatRoastLevel(bean.roastLevel)}
              </span>
            </div>
          )}
          {bean.process && (
            <div className="grid grid-cols-[100px_1fr] gap-4 text-sm">
              <span className="text-muted-foreground font-medium">Process</span>
              <span className="font-semibold capitalize">{bean.process}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
