import type { Member } from "../types";
import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface TableViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

function QuantityInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value || ""}
      onChange={(e) => {
        const v = parseInt(e.target.value) || 0;
        onChange(Math.max(0, v));
      }}
      className={`w-full h-7 text-center text-sm font-bold border border-gray-300 rounded ${
        value > 0 ? "bg-yellow-100 border-yellow-400" : "bg-white"
      }`}
    />
  );
}

// 旧商品の左ボーダー用スタイル（太い線 + 小さなマージン風）
const OLD_SEPARATOR = "3px solid #ccc";

function SetInput({
  label,
  value,
  canAdd,
  onChange,
}: {
  label: string;
  value: number;
  canAdd: boolean;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[11px] text-gray-500 font-bold">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={0}
        max={canAdd ? 99 : value}
        value={value || ""}
        onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
        className={`w-full h-7 text-center text-sm font-bold border border-gray-300 rounded ${
          value > 0 ? "bg-yellow-100 border-yellow-400" : "bg-white"
        }`}
      />
    </div>
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

  const mainProducts = member.products.slice(0, 4); // アクスタ, アクキー, チェキ, キラステッカー
  const oldProducts = member.products.slice(4);      // 旧アクキー, 旧ステッカー

  const hStyle = { backgroundColor: bg, color: text };
  const cellBorder = "1px solid #e5e7eb";

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{ border: `2px solid ${border}` }}
    >
      <table className="w-full border-collapse text-[10px]" style={{ tableLayout: "fixed" }}>
        <colgroup><col style={{ width: "6%" }} /><col style={{ width: "20%" }} /><col style={{ width: "12%" }} /><col style={{ width: "10%" }} /><col style={{ width: "9%" }} /><col style={{ width: "13%" }} /><col style={{ width: "15%" }} /><col style={{ width: "15%" }} /></colgroup>

        {/* 価格ヘッダー */}
        <thead>
          <tr>
            <td colSpan={2} className="text-center font-bold py-0.5" style={{ ...hStyle, borderRight: cellBorder }}>{"\u00A5"}3,000</td>
            <td className="text-center font-bold py-0.5" style={{ ...hStyle, borderRight: cellBorder }}>{"\u00A5"}1,500</td>
            <td className="text-center font-bold py-0.5" style={{ ...hStyle, borderRight: cellBorder }}>{"\u00A5"}800</td>
            <td className="text-center font-bold py-0.5" style={{ ...hStyle, borderRight: cellBorder }}>{"\u00A5"}200</td>
            <td className="text-center font-bold py-0.5" style={hStyle}>{"\u00A5"}300</td>
            <td className="text-center font-bold py-0.5" style={{ ...hStyle, borderLeft: OLD_SEPARATOR, borderRight: cellBorder }}>{"\u00A5"}800</td>
            <td className="text-center font-bold py-0.5" style={hStyle}>{"\u00A5"}200</td>
          </tr>
        </thead>

        <tbody>
          {/* 商品名行 */}
          <tr className="bg-white" style={{ borderBottom: cellBorder }}>
            <td colSpan={2} className="text-center px-0.5 py-0.5 font-medium" style={{ borderRight: cellBorder }}>
              {startNum}. セット
            </td>
            {mainProducts.map((p, i) => (
              <td
                key={p.id}
                className="text-center px-0.5 py-0.5 font-medium"
                style={{ borderRight: i < mainProducts.length - 1 ? cellBorder : undefined }}
              >
                {p.name.replace(/^\d+\.\s*/, "")}
                {p.inSet && <span className="text-amber-500 ml-0.5">★</span>}
              </td>
            ))}
            {oldProducts.map((p, i) => (
              <td
                key={p.id}
                className="text-center px-0.5 py-0.5 font-medium"
                style={{
                  borderLeft: i === 0 ? OLD_SEPARATOR : undefined,
                  borderRight: i < oldProducts.length - 1 ? cellBorder : undefined,
                }}
              >
                {p.name.replace(/^\d+\.\s*/, "")}
              </td>
            ))}
          </tr>

          {/* メンバー名 + 入力行 */}
          <tr className="bg-white">
            {/* メンバー名 */}
            <td
              className="font-bold text-sm text-center align-middle"
              style={{
                backgroundColor: bg,
                color: text,
                writingMode: "vertical-rl" as const,
                borderRight: cellBorder,
                padding: "4px 2px",
              }}
            >
              {member.name}
            </td>

            {/* セット A/B（縦並び） */}
            <td className="text-center align-middle p-1" style={{ borderRight: cellBorder }}>
              <div className="flex flex-col gap-1">
                <SetInput label="A" value={setA} canAdd={canAddSet} onChange={(v) => setQuantity(member.id, setAKey, v)} />
                <SetInput label="B" value={setB} canAdd={canAddSet} onChange={(v) => setQuantity(member.id, setBKey, v)} />
              </div>
            </td>

            {/* 通常商品 */}
            {mainProducts.map((p, i) => (
              <td
                key={p.id}
                className="align-middle p-1"
                style={{ borderRight: i < mainProducts.length - 1 ? cellBorder : undefined }}
              >
                <QuantityInput
                  value={getQuantity(member.id, p.id)}
                  onChange={(v) => setQuantity(member.id, p.id, v)}
                />
              </td>
            ))}

            {/* 旧商品 */}
            {oldProducts.map((p, i) => (
              <td
                key={p.id}
                className="align-middle p-1"
                style={{
                  borderLeft: i === 0 ? OLD_SEPARATOR : undefined,
                  borderRight: i < oldProducts.length - 1 ? cellBorder : undefined,
                }}
              >
                <QuantityInput
                  value={getQuantity(member.id, p.id)}
                  onChange={(v) => setQuantity(member.id, p.id, v)}
                />
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// 共通商品の色
const COMMON_BG = "#e5c735";
const COMMON_TEXT = "#4a3f00";
const COMMON_BORDER = "#afafaf";

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
      <div
        className="rounded-lg overflow-hidden"
        style={{ border: `2px solid ${COMMON_BORDER}` }}
      >
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <td
                className="text-center font-bold py-0.5"
                style={{ backgroundColor: COMMON_BG, color: COMMON_TEXT, borderRight: "1px solid rgba(255,255,255,0.4)" }}
              >
                ¥500
              </td>
              <td
                className="text-center font-bold py-0.5"
                style={{ backgroundColor: COMMON_BG, color: COMMON_TEXT }}
              >
                ¥2,000
              </td>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-white" style={{ borderBottom: "1px solid #e5e7eb" }}>
              {COMMON_PRODUCTS.map((p, i) => (
                <td
                  key={p.id}
                  className="text-center px-1 py-0.5 font-medium"
                  style={{ borderRight: i === 0 ? "1px solid #e5e7eb" : undefined }}
                >
                  {p.name.replace(/^\d+\.\s*/, "")}
                  {p.inSet && <span className="text-amber-500 ml-0.5">★</span>}
                </td>
              ))}
            </tr>
            <tr className="bg-white">
              {COMMON_PRODUCTS.map((p, i) => (
                <td
                  key={p.id}
                  className="p-2"
                  style={{ borderRight: i === 0 ? "1px solid #e5e7eb" : undefined }}
                >
                  <QuantityInput
                    value={getCommonQuantity(p.id)}
                    onChange={(v) => setCommonQuantity(p.id, v)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* 注意事項 */}
      <div className="text-[10px] text-gray-500 space-y-0.5 px-1">
        <p className="text-red-600 font-bold">※セットは一回のお会計で2個までとさせていただきます。</p>
        <p>※★＝セットに入っているものです</p>
        <p>※待ち時間お時間ある方はぴったりの金額をご用意いただけると大変助かります！</p>
      </div>
    </div>
  );
}
