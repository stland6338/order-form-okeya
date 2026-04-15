import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface MenuViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  getCommonQuantity: (productId: string) => number;
  adjustQuantity: (memberId: string, productId: string, delta: number) => void;
  adjustCommonQuantity: (productId: string, delta: number) => void;
  totalSets: number;
}

function Counter({
  value,
  onDec,
  onInc,
  disableInc,
}: {
  value: number;
  onDec: () => void;
  onInc: () => void;
  disableInc?: boolean;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={onDec}
        disabled={value <= 0}
        className="w-7 h-7 rounded-full bg-gray-300 text-gray-800 font-bold text-base flex items-center justify-center disabled:opacity-25 active:bg-gray-400"
      >
        -
      </button>
      <span className={`w-6 text-center font-mono text-base font-bold ${value > 0 ? "text-gray-900" : "text-gray-400"}`}>
        {value}
      </span>
      <button
        onClick={onInc}
        disabled={disableInc}
        className="w-7 h-7 rounded-full bg-gray-800 text-white font-bold text-base flex items-center justify-center disabled:opacity-25 active:bg-gray-900"
      >
        +
      </button>
    </div>
  );
}

export function MenuView({
  getQuantity,
  getCommonQuantity,
  adjustQuantity,
  adjustCommonQuantity,
  totalSets,
}: MenuViewProps) {
  const canAddSet = totalSets < MAX_SETS_PER_ORDER;

  return (
    <div className="w-full select-none pb-4">
      {/* お品書き画像 */}
      <img
        src="/menu1.jpg"
        alt="お品書き 1"
        className="block w-full h-auto"
        draggable={false}
      />
      <img
        src="/menu2.jpg"
        alt="お品書き 2"
        className="block w-full h-auto mt-2"
        draggable={false}
      />

      {/* クイック操作パネル */}
      <div className="px-2 mt-4 space-y-3">
        <h2 className="text-sm font-bold text-gray-700 px-1">クイック操作</h2>

        {MEMBERS.map((member) => (
          <div
            key={member.id}
            className="rounded-lg overflow-hidden border-2"
            style={{ borderColor: member.colors.border }}
          >
            <div
              className="px-3 py-1.5 font-bold text-sm"
              style={{
                backgroundColor: member.colors.bg,
                color: member.colors.text,
              }}
            >
              {member.name}
            </div>

            {/* セット A/B */}
            <div className="bg-white">
              {member.set.variants.map((variant) => {
                const key = `${member.set.id}-${variant}`;
                const qty = getQuantity(member.id, key);
                return (
                  <div
                    key={variant}
                    className={`flex items-center gap-2 px-3 py-1.5 border-b border-gray-100 ${
                      qty > 0 ? "bg-yellow-50" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-medium">{member.set.name}</span>
                      <span className="ml-2 font-bold">{variant}</span>
                      <span className="text-gray-500 ml-2">
                        ¥{member.set.price.toLocaleString()}
                      </span>
                    </div>
                    <Counter
                      value={qty}
                      onDec={() => adjustQuantity(member.id, key, -1)}
                      onInc={() => adjustQuantity(member.id, key, +1)}
                      disableInc={!canAddSet}
                    />
                  </div>
                );
              })}
              {totalSets >= MAX_SETS_PER_ORDER && (
                <div className="px-3 py-1 bg-red-50 border-b border-gray-100">
                  <p className="text-[10px] text-red-500 font-bold">
                    ※セットは1会計につき合計2個までです
                  </p>
                </div>
              )}

              {/* 通常商品 */}
              {member.products.map((product) => {
                const qty = getQuantity(member.id, product.id);
                return (
                  <div
                    key={product.id}
                    className={`flex items-center gap-2 px-3 py-1.5 border-b border-gray-100 ${
                      qty > 0 ? "bg-yellow-50" : ""
                    }`}
                  >
                    <div className="flex-1 min-w-0 text-xs">
                      <span className="font-medium truncate">{product.name}</span>
                      {product.inSet && (
                        <span className="text-amber-500 ml-1">★</span>
                      )}
                      <span className="text-gray-500 ml-2">
                        ¥{product.price.toLocaleString()}
                      </span>
                    </div>
                    <Counter
                      value={qty}
                      onDec={() => adjustQuantity(member.id, product.id, -1)}
                      onInc={() => adjustQuantity(member.id, product.id, +1)}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* 共通商品 */}
        <div
          className="rounded-lg overflow-hidden border-2"
          style={{ borderColor: "#afafaf" }}
        >
          <div
            className="px-3 py-1.5 font-bold text-sm"
            style={{ backgroundColor: "#afafaf", color: "#fff" }}
          >
            共通商品
          </div>
          <div className="bg-white">
            {COMMON_PRODUCTS.map((product) => {
              const qty = getCommonQuantity(product.id);
              return (
                <div
                  key={product.id}
                  className={`flex items-center gap-2 px-3 py-1.5 border-b border-gray-100 ${
                    qty > 0 ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="flex-1 min-w-0 text-xs">
                    <span className="font-medium truncate">{product.name}</span>
                    {product.inSet && (
                      <span className="text-amber-500 ml-1">★</span>
                    )}
                    <span className="text-gray-500 ml-2">
                      ¥{product.price.toLocaleString()}
                    </span>
                  </div>
                  <Counter
                    value={qty}
                    onDec={() => adjustCommonQuantity(product.id, -1)}
                    onInc={() => adjustCommonQuantity(product.id, +1)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
