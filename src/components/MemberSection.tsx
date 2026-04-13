import type { Member } from "../types";
import { MAX_SETS_PER_ORDER } from "../data";
import { ProductRow } from "./ProductRow";

interface MemberSectionProps {
  member: Member;
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  totalSets: number;
}

export function MemberSection({
  member,
  getQuantity,
  setQuantity,
  totalSets,
}: MemberSectionProps) {
  const setA = getQuantity(member.id, `${member.set.id}-A`);
  const setB = getQuantity(member.id, `${member.set.id}-B`);

  const canAddSet = totalSets < MAX_SETS_PER_ORDER;

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
      <div className="px-3 py-2 border-b border-gray-100 bg-white">
        <div className="flex items-center justify-between mb-1">
          <div>
            <span className="text-sm font-medium">{member.set.name}</span>
            <span className="text-xs text-gray-500 ml-2">
              ¥{member.set.price.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex gap-4">
          {member.set.variants.map((variant) => {
            const key = `${member.set.id}-${variant}`;
            const checked = getQuantity(member.id, key) > 0;
            return (
              <label key={variant} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={!checked && !canAddSet}
                  onChange={(e) =>
                    setQuantity(member.id, key, e.target.checked ? 1 : 0)
                  }
                  className="w-5 h-5 accent-gray-700"
                />
                <span className={checked ? "font-bold" : "text-gray-500"}>
                  {variant}
                </span>
              </label>
            );
          })}
          {!canAddSet && setA === 0 && setB === 0 && (
            <span className="text-xs text-red-500">※セット上限(2個)に達しています</span>
          )}
        </div>
      </div>

      {/* 通常商品 */}
      <div className="bg-white">
        {member.products.map((product) => (
          <ProductRow
            key={product.id}
            name={product.name}
            price={product.price}
            inSet={product.inSet}
            quantity={getQuantity(member.id, product.id)}
            onChange={(q) => setQuantity(member.id, product.id, q)}
          />
        ))}
      </div>
    </div>
  );
}
