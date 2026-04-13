import type { Member } from "../types";
import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface TableViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

const PRICE_HEADERS = [
  { label: "¥3,000", colSpan: 2 },
  { label: "¥1,500", colSpan: 1 },
  { label: "¥800", colSpan: 1 },
  { label: "¥200", colSpan: 1 },
  { label: "¥300", colSpan: 1 },
  { label: "¥800", colSpan: 1 },
  { label: "¥200", colSpan: 1 },
];

function QuantityInput({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={min}
      value={value || ""}
      onChange={(e) => {
        const v = parseInt(e.target.value) || 0;
        onChange(Math.max(min, v));
      }}
      className={`w-full h-7 text-center text-sm font-bold border border-gray-300 rounded ${
        value > 0 ? "bg-yellow-100 border-yellow-400" : "bg-white"
      }`}
    />
  );
}

function MemberRow({
  member,
  getQuantity,
  setQuantity,
  totalSets,
}: {
  member: Member;
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  totalSets: number;
}) {
  const setAKey = `${member.set.id}-A`;
  const setBKey = `${member.set.id}-B`;
  const setA = getQuantity(member.id, setAKey);
  const setB = getQuantity(member.id, setBKey);
  const canAddSet = totalSets < MAX_SETS_PER_ORDER;
  const startNum = MEMBERS.indexOf(member) * 7 + 1;
  const { bg, text, border } = member.colors;

  return (
    <div
      className="border-2 rounded-lg overflow-hidden"
      style={{ borderColor: border }}
    >
      {/* 価格ヘッダー行 */}
      <div className="grid grid-cols-8 text-[10px] font-bold text-center">
        {PRICE_HEADERS.map((h, i) => (
          <div
            key={i}
            className={`py-0.5 border-r border-white/40 last:border-r-0 ${
              i === 0 ? "col-span-2" : ""
            }`}
            style={{ backgroundColor: bg, color: text }}
          >
            {h.label}
          </div>
        ))}
      </div>

      {/* 商品名行 */}
      <div className="grid grid-cols-8 text-[10px] text-center bg-white border-b border-gray-200">
        <div className="col-span-2 border-r border-gray-200 px-0.5 py-0.5 font-medium">
          {startNum}. セット
        </div>
        {member.products.map((p, i) => (
          <div
            key={p.id}
            className={`border-r border-gray-200 last:border-r-0 px-0.5 py-0.5 font-medium ${
              i >= 5 ? "bg-gray-50" : ""
            }`}
          >
            <span>{p.name.replace(/^\d+\.\s*/, "")}</span>
            {p.inSet && <span className="text-amber-500 ml-0.5">★</span>}
          </div>
        ))}
      </div>

      {/* メンバー名 + 入力行 */}
      <div className="grid grid-cols-[auto_1fr] bg-white">
        {/* メンバー名 */}
        <div
          className="font-bold text-base px-2 py-1 flex items-center justify-center min-w-[2rem]"
          style={{
            backgroundColor: bg,
            color: text,
            writingMode: "vertical-rl",
          }}
        >
          {member.name}
        </div>

        {/* 入力エリア */}
        <div className="grid grid-cols-8 items-center">
          {/* セット A */}
          <div className="p-1 border-r border-gray-200 text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">A</div>
            <label className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={setA > 0}
                disabled={!setA && !canAddSet}
                onChange={(e) =>
                  setQuantity(member.id, setAKey, e.target.checked ? 1 : 0)
                }
                className="w-5 h-5 accent-gray-700"
              />
            </label>
          </div>

          {/* セット B */}
          <div className="p-1 border-r border-gray-200 text-center">
            <div className="text-[10px] text-gray-500 mb-0.5">B</div>
            <label className="flex items-center justify-center">
              <input
                type="checkbox"
                checked={setB > 0}
                disabled={!setB && !canAddSet}
                onChange={(e) =>
                  setQuantity(member.id, setBKey, e.target.checked ? 1 : 0)
                }
                className="w-5 h-5 accent-gray-700"
              />
            </label>
          </div>

          {/* 通常商品 */}
          {member.products.map((p) => (
            <div key={p.id} className="p-1 border-r border-gray-200 last:border-r-0">
              <QuantityInput
                value={getQuantity(member.id, p.id)}
                onChange={(v) => setQuantity(member.id, p.id, v)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 共通商品ヘッダーの黄色（元画像に合わせた色）
const COMMON_BG = "#FFE033";
const COMMON_TEXT = "#5C4A00";

export function TableView({
  getQuantity,
  setQuantity,
  getCommonQuantity,
  setCommonQuantity,
  totalSets,
}: TableViewProps) {
  return (
    <div className="px-2 space-y-3 pb-4">
      {MEMBERS.map((member) => (
        <MemberRow
          key={member.id}
          member={member}
          getQuantity={getQuantity}
          setQuantity={setQuantity}
          totalSets={totalSets}
        />
      ))}

      {/* 共通商品 */}
      <div className="border-2 border-gray-400 rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 text-[10px] font-bold text-center">
          <div
            className="py-0.5 border-r border-white/40"
            style={{ backgroundColor: COMMON_BG, color: COMMON_TEXT }}
          >
            ¥500
          </div>
          <div
            className="py-0.5"
            style={{ backgroundColor: COMMON_BG, color: COMMON_TEXT }}
          >
            ¥2,000
          </div>
        </div>
        <div className="grid grid-cols-2 text-[10px] text-center bg-white border-b border-gray-200">
          {COMMON_PRODUCTS.map((p) => (
            <div key={p.id} className="px-1 py-0.5 font-medium border-r border-gray-200 last:border-r-0">
              {p.name.replace(/^\d+\.\s*/, "")}
              {p.inSet && <span className="text-amber-500 ml-0.5">★</span>}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 bg-white">
          {COMMON_PRODUCTS.map((p) => (
            <div key={p.id} className="p-2 border-r border-gray-200 last:border-r-0">
              <QuantityInput
                value={getCommonQuantity(p.id)}
                onChange={(v) => setCommonQuantity(p.id, v)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 注意事項 */}
      <div className="text-[10px] text-gray-500 space-y-0.5 px-1">
        <p>※セットは一回のお会計で2個までとさせていただきます。</p>
        <p>※★＝セットに入っているものです</p>
        <p>※待ち時間お時間ある方はぴったりの金額をご用意いただけると大変助かります！</p>
        <p>※混乱回避のためこちらの紙は会計後お返しさせていただきます。</p>
      </div>
    </div>
  );
}
