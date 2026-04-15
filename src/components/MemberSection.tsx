import type { Member } from "../types";
import { MAX_SETS_PER_ORDER } from "../data";
import { ProductRow } from "./ProductRow";

interface MemberSectionProps {
  member: Member;
  getQuantity: (memberId: string, productId: string) => number;
  adjustQuantity: (memberId: string, productId: string, delta: number) => void;
  totalSets: number;
}

export function MemberSection({
  member,
  getQuantity,
  adjustQuantity,
  totalSets,
}: MemberSectionProps) {
  return (
    <div
      className="border-2 rounded-lg overflow-hidden"
      style={{ borderColor: member.colors.border }}
    >
      {/* メンバー名ヘッダー */}
      <div
        className="px-3 py-2 font-bold text-lg"
        style={{ backgroundColor: member.colors.bg, color: member.colors.text }}
      >
        {member.name}
      </div>

      {/* セット */}
      {member.set.variants.map((variant) => {
        const key = `${member.set.id}-${variant}`;
        const qty = getQuantity(member.id, key);
        const canAdd = totalSets < MAX_SETS_PER_ORDER;
        const isFirst = variant === "A";
        return (
          <div
            key={variant}
            className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-white ${
              qty > 0 ? "bg-yellow-50" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              {isFirst && (
                <>
                  <span className="text-sm font-medium">{member.set.name}</span>
                  <span className="block text-xs text-gray-500">¥{member.set.price.toLocaleString()}</span>
                </>
              )}
              {!isFirst && <span className="text-sm font-medium">&nbsp;</span>}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold w-4">{variant}</span>
              <button
                onClick={() => adjustQuantity(member.id, key, -1)}
                disabled={qty <= 0}
                className="w-9 h-9 rounded-full bg-gray-300 text-gray-800 font-bold text-xl flex items-center justify-center disabled:opacity-25 active:bg-gray-400"
              >
                -
              </button>
              <span className={`w-8 text-center font-mono text-xl font-bold ${qty > 0 ? "text-gray-900" : "text-gray-400"}`}>{qty}</span>
              <button
                onClick={() => adjustQuantity(member.id, key, +1)}
                disabled={!canAdd}
                className="w-9 h-9 rounded-full bg-gray-800 text-white font-bold text-xl flex items-center justify-center disabled:opacity-25 active:bg-gray-900"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
      {totalSets >= MAX_SETS_PER_ORDER && (
        <div className="px-3 py-1 bg-red-50 border-b border-gray-100">
          <p className="text-xs text-red-500 font-bold">※セットは1会計2点までです</p>
        </div>
      )}

      {/* 通常商品 */}
      <div className="bg-white">
        {member.products.map((product) => (
          <ProductRow
            key={product.id}
            name={product.name}
            price={product.price}
            inSet={product.inSet}
            quantity={getQuantity(member.id, product.id)}
            onAdjust={(delta) => adjustQuantity(member.id, product.id, delta)}
          />
        ))}
      </div>
    </div>
  );
}
