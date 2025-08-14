import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { fetchTopBeans } from "@/lib/db/data";

export async function BeanList() {
  const beans = await fetchTopBeans(50);

  if (beans.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-muted-foreground">No beans found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Add your first coffee beans to get started.
        </p>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {beans.map(({ bean, brewCount }) => (
        <Card key={bean.id} className="p-4">
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold">{bean.name}</h3>
              <Badge variant="secondary">{brewCount} brews</Badge>
            </div>
            
            {bean.roaster && (
              <p className="text-sm text-muted-foreground">{bean.roaster}</p>
            )}
            
            <div className="flex gap-2 text-xs">
              {bean.origin && (
                <Badge variant="outline">{bean.origin}</Badge>
              )}
              {bean.roastLevel && (
                <Badge variant="outline">{bean.roastLevel}</Badge>
              )}
            </div>
            
            
            {bean.notes && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {bean.notes}
              </p>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}