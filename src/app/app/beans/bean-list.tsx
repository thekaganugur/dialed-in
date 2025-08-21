import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopBeans } from "@/lib/db/data";
import { formatRoastLevel } from "@/lib/utils";
import Link from "next/link";

export async function BeanList() {
  const beans = await fetchTopBeans(50);

  if (beans.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">No beans found.</p>
          <p className="text-muted-foreground mt-2 text-sm">
            Add your first coffee beans to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {beans.map(({ bean, brewCount }) => (
        <Card
          key={bean.id}
          className="hover:border-border/60 hover:bg-muted/25 active:bg-muted/40 transition-colors"
        >
          <CardHeader className="flex items-start justify-between">
            <div className="space-y-1">
              <Link href={`/app/beans/${bean.id}`}>
                <CardTitle className="truncate text-base font-medium transition-colors hover:text-blue-600">
                  {bean.name}
                </CardTitle>
              </Link>
              {bean.roaster && (
                <p className="text-muted-foreground text-sm">{bean.roaster}</p>
              )}
            </div>
            <Badge variant="secondary">{brewCount} brews</Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex gap-2 text-xs">
              {bean.origin && <Badge variant="outline">{bean.origin}</Badge>}
              {bean.roastLevel && (
                <Badge variant="outline">
                  {formatRoastLevel(bean.roastLevel)}
                </Badge>
              )}
            </div>

            {bean.roastDate && (
              <p className="text-muted-foreground text-xs">
                Roasted: {new Date(bean.roastDate).toLocaleDateString()}
              </p>
            )}

            {bean.notes && (
              <p className="text-muted-foreground line-clamp-2 text-sm">
                {bean.notes}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
