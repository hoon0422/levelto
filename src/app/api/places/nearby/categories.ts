import { z } from "zod";

/** Google Places API (New) Table A primary types searched for each UI category. */
export const CATEGORY_TYPES = {
  restaurant: ["restaurant"],
  cafe: ["cafe", "coffee_shop"],
  public: ["library", "community_center", "city_hall", "post_office", "pharmacy", "park"],
  grocery: ["supermarket", "grocery_store", "convenience_store"],
} as const;

export const categorySchema = z.enum(["restaurant", "cafe", "public", "grocery"]);
export type PlaceCategory = z.infer<typeof categorySchema>;

export const CATEGORY_LABEL: Record<PlaceCategory, string> = {
  restaurant: "Restaurants",
  cafe: "Cafes",
  public: "Public places",
  grocery: "Groceries",
};
