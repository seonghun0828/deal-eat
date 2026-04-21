import dealsJson from "@/deals.json";
import { DealsFeed } from "@/components/DealsFeed";
import { dealsFileSchema } from "@/lib/schema";

export default function Page() {
  const parsedDeals = dealsFileSchema.parse(dealsJson);
  return <DealsFeed data={parsedDeals} />;
}
