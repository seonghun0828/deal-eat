import type { Chain } from "@/lib/schema";

type UnavailableChainCardProps = {
  chain: Chain;
};

export function UnavailableChainCard({ chain }: UnavailableChainCardProps) {
  return (
    <article className="rounded-[28px] border border-dashed border-[color:var(--line)] bg-white/60 p-5 text-[color:var(--muted)]">
      <p className="text-xs uppercase tracking-[0.2em]">{chain}</p>
      <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
        데이터 없음 이번 주
      </h2>
      <p className="mt-2 text-sm">
        이번 주에는 이 브랜드의 할인 데이터를 아직 확보하지 못했어요.
      </p>
    </article>
  );
}

