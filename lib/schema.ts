import { z } from "zod";

export const chainEnum = z.enum([
  "McDonald's",
  "Burger King",
  "KFC",
  "Lotteria",
  "Mom's Touch",
  "No Brand Burger",
]);

export const categoryEnum = z.enum([
  "hamburger_single",
  "hamburger_set",
  "side",
  "drink",
  "combo_other",
]);

export const dealSchema = z
  .object({
    chain: chainEnum,
    deal_name: z.string().min(1),
    original_price: z.number().int().positive().optional(),
    deal_price: z.number().int().nonnegative(),
    discount_pct: z.number().int().min(0).max(100),
    category: categoryEnum,
    launch_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    is_relaunched: z.boolean().optional(),
    valid_through: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    in_store_only: z.boolean().optional(),
    notes: z.string().min(1).optional(),
  })
  .superRefine((deal, context) => {
    if (deal.original_price === undefined) {
      return;
    }

    const computed = Math.round(
      ((deal.original_price - deal.deal_price) / deal.original_price) * 100,
    );

    if (Math.abs(computed - deal.discount_pct) > 1) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: `discount_pct ${deal.discount_pct} doesn't match computed ${computed} for ${deal.deal_name}`,
        path: ["discount_pct"],
      });
    }
  });

export const dealsFileSchema = z.object({
  updated_at: z.iso.datetime({ offset: true }),
  deals: z.array(dealSchema),
  unavailable_chains: z.array(chainEnum),
});

export type Chain = z.infer<typeof chainEnum>;
export type Category = z.infer<typeof categoryEnum>;
export type Deal = z.infer<typeof dealSchema>;
export type DealsFile = z.infer<typeof dealsFileSchema>;
