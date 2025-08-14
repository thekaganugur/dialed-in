import { Label } from "@/components/ui/label";

interface QuickRatingProps {
  name?: string;
  defaultValue?: number | null;
  helpText?: string;
}

export function QuickRating({
  name = "rating",
  defaultValue,
  helpText = "How was this brew?",
}: QuickRatingProps) {
  return (
    <div className="space-y-2">
      <Label>Quick Rating</Label>
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <label
            key={rating}
            className="flex cursor-pointer items-center space-x-2"
          >
            <input
              type="radio"
              name={name}
              value={rating.toString()}
              defaultChecked={defaultValue === rating}
              className="peer sr-only"
            />
            <div
              className={`rounded-md border-2 px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-50 ${
                rating === 1
                  ? "peer-checked:border-red-300 peer-checked:bg-red-100 peer-checked:text-red-600"
                  : rating === 2
                    ? "peer-checked:border-orange-300 peer-checked:bg-orange-100 peer-checked:text-orange-600"
                    : rating === 3
                      ? "peer-checked:border-yellow-300 peer-checked:bg-yellow-100 peer-checked:text-yellow-600"
                      : rating === 4
                        ? "peer-checked:border-blue-300 peer-checked:bg-blue-100 peer-checked:text-blue-600"
                        : "peer-checked:border-green-300 peer-checked:bg-green-100 peer-checked:text-green-600"
              }`}
            >
              {rating}P
            </div>
          </label>
        ))}
      </div>
      <p className="text-muted-foreground text-xs">{helpText}</p>
    </div>
  );
}

