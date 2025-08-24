import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { calculateBrewRatio, formatBrewDuration } from "@/lib/utils";
import { Settings } from "lucide-react";

interface BrewLog {
  doseGrams: string | null;
  yieldGrams: string | null;
  brewTimeSeconds: number | null;
  waterTempCelsius: number | null;
  grindSetting: string | null;
}

interface BrewMetricsProps {
  brewLog: BrewLog;
}

export function BrewMetrics({ brewLog }: BrewMetricsProps) {
  const brewRatio = calculateBrewRatio(brewLog.doseGrams, brewLog.yieldGrams);

  const hasPrimaryMetrics =
    Boolean(brewLog.doseGrams) ||
    Boolean(brewLog.yieldGrams) ||
    Boolean(brewRatio);
  const hasSecondaryMetrics =
    Boolean(brewLog.brewTimeSeconds) ||
    Boolean(brewLog.waterTempCelsius) ||
    Boolean(brewLog.grindSetting);

  if (!hasPrimaryMetrics && !hasSecondaryMetrics) {
    return null;
  }
  console.log(brewLog, hasPrimaryMetrics, hasSecondaryMetrics);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Key Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <section aria-labelledby="key-metrics-title">
          <h3 id="key-metrics-title" className="sr-only">
            Key Brewing Metrics
          </h3>

          <div className="space-y-6 sm:space-y-8">
            {hasPrimaryMetrics && (
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
                role="group"
                aria-label="Primary brewing measurements"
              >
                {brewLog.doseGrams && (
                  <div className="text-center">
                    <div className="text-foreground text-xl font-bold sm:text-2xl">
                      {brewLog.doseGrams}g
                    </div>
                    <div
                      className="text-muted-foreground font-medium tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Dose
                    </div>
                  </div>
                )}
                {brewLog.yieldGrams && (
                  <div className="text-center">
                    <div className="text-foreground text-xl font-bold sm:text-2xl">
                      {brewLog.yieldGrams}g
                    </div>
                    <div
                      className="text-muted-foreground font-medium tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Yield
                    </div>
                  </div>
                )}
                {brewRatio && (
                  <div className="col-span-2 text-center sm:col-span-1">
                    <div className="text-foreground text-xl font-bold sm:text-2xl">
                      {brewRatio}
                    </div>
                    <div
                      className="text-muted-foreground font-medium tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Ratio
                    </div>
                  </div>
                )}
              </div>
            )}
            {hasPrimaryMetrics && hasSecondaryMetrics && (
              <div className="border-border/40 border-t" />
            )}
            {hasSecondaryMetrics && (
              <div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
                role="group"
                aria-label="Brewing parameters"
              >
                {brewLog.brewTimeSeconds && (
                  <div className="text-center">
                    <div className="text-foreground text-lg font-medium">
                      {formatBrewDuration(brewLog.brewTimeSeconds)}
                    </div>
                    <div
                      className="text-muted-foreground tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Time
                    </div>
                  </div>
                )}
                {brewLog.waterTempCelsius && (
                  <div className="text-center">
                    <div className="text-foreground text-lg font-medium">
                      {brewLog.waterTempCelsius}°C
                    </div>
                    <div
                      className="text-muted-foreground tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Temp
                    </div>
                  </div>
                )}
                {brewLog.grindSetting && (
                  <div className="col-span-2 text-center sm:col-span-1">
                    <div className="text-foreground text-lg font-medium">
                      {brewLog.grindSetting}
                    </div>
                    <div
                      className="text-muted-foreground tracking-wide uppercase"
                      style={{ fontSize: "max(0.75rem, 14px)" }}
                    >
                      Grind
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
