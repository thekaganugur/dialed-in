"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Coffee } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { createBrewFormSchema } from "./schemas";

export default function CreateBrewPage() {
  const form = useForm<z.infer<typeof createBrewFormSchema>>({
    resolver: zodResolver(createBrewFormSchema),
    defaultValues: {
      beanId: "",
      method: "",
      doseGrams: "",
      yieldGrams: "",
      brewTimeSeconds: "",
      waterTempCelsius: "",
      grindSetting: "",
      rating: "",
      notes: "",
      flavorNotes: "",
    },
  });

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

  function onSubmit(values: z.infer<typeof createBrewFormSchema>) {
    console.log(values);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coffee className="h-5 w-5" />
            Create Brew Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="beanId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Coffee Bean *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a coffee bean" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sample">
                          Sample Bean - Ethiopian Yirgacheffe
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brew Method *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select brew method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {brewMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method.replace(/_/g, " ").toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="doseGrams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dose (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="18.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="yieldGrams"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yield (g)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.1"
                          placeholder="36.0"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brewTimeSeconds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time (s)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="30" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="waterTempCelsius"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temp (°C)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="93" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="grindSetting"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grind Setting</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rate your brew (1-5)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} {rating === 1 ? "Star" : "Stars"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <textarea
                        className="border-input bg-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Brewing notes..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="flavorNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Flavor Notes</FormLabel>
                    <FormControl>
                      <textarea
                        className="border-input bg-background flex min-h-[80px] w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Flavor profile..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Save Brew Log
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/brews">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
