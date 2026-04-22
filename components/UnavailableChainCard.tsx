import type { Chain } from '@/lib/schema';

type UnavailableChainCardProps = {
  chain: Chain;
};

export function UnavailableChainCard({ chain }: UnavailableChainCardProps) {
  return (
    <article className="rounded-[28px] border border-dashed border-[color:var(--line)] bg-white/60 p-5 text-[color:var(--muted)]">
      <p className="text-xs uppercase tracking-[0.2em]">{chain}</p>
      <h2 className="mt-2 text-xl font-semibold text-[color:var(--foreground)]">
        추천 없음
      </h2>
      <p className="mt-2 text-sm">
        이번 주에는 이 브랜드의 할인 추천이 없습니다.
      </p>
    </article>
  );
}
