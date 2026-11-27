"use client";

import { Building2, Coffee, ShoppingBasket, Utensils, type LucideIcon } from "lucide-react";
import { CATEGORY_LABEL, type PlaceCategory } from "@/app/api/places/nearby/categories";

const CHIPS: { id: PlaceCategory; Icon: LucideIcon }[] = [
  { id: "restaurant", Icon: Utensils },
  { id: "cafe", Icon: Coffee },
  { id: "public", Icon: Building2 },
  { id: "grocery", Icon: ShoppingBasket },
];

type Props = { value: PlaceCategory | null; onChange: (c: PlaceCategory | null) => void };

/** Google Maps style category chips. Pressing the selected chip clears it. */
export function CategoryChips({ value, onChange }: Props) {
  return (
    <div role="group" aria-label="Place category" className="flex gap-2 overflow-x-auto p-1">
      {CHIPS.map(({ id, Icon }) => {
        const pressed = value === id;
        return (
          <button
            key={id}
            type="button"
            aria-pressed={pressed}
            onClick={() => onChange(pressed ? null : id)}
            className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-4 text-sm font-semibold shadow focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${
              pressed
                ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
            }`}
          >
            <Icon aria-hidden className="size-4" />
            {CATEGORY_LABEL[id]}
          </button>
        );
      })}
    </div>
  );
}
