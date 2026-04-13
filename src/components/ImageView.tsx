import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface ImageViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

// 画像サイズ: 4093 x 2894
const W = 4093;
const H = 2894;

function pct(x: number, y: number, w: number, h: number) {
  return {
    left: `${(x / W) * 100}%`,
    top: `${(y / H) * 100}%`,
    width: `${(w / W) * 100}%`,
    height: `${(h / H) * 100}%`,
  };
}

// 列の境界（vertical black lines at y=760）
// x: 493, 959, 1426, 1892, 2359, 2826, [gap], 2929, 3395, 3862
// 左端（メンバー名の左）≈ 240, セットA/B分割点 ≈ 493の中間

// セットA: メンバー名右端(~330) → 493の中間(~490)
// セットB: 493中間 → 493
// アクスタ: 493 → 959
// アクキー: 959 → 1426
// チェキ: 1426 → 1892
// キラステッカー: 1892 → 2359 (実は2826まで広い? いや...)

// Wait - 画像を見直す。実際のカラム:
// セット(A+B): 左端 → 959  (2カラム分)
// アクスタ: 959 → 1426
// アクキー: 1426 → 1892
// チェキ: 1892 → 2359
// キラステッカー: 2359 → 2826
// [gap 2826-2929]
// 旧アクキー: 2929 → 3395
// 旧ステッカー: 3395 → 3862

const PADDING = 8;

const COL_SET_A = { x: 260 + PADDING, w: (959 - 260) / 2 - PADDING * 2 };
const COL_SET_B = { x: 260 + (959 - 260) / 2 + PADDING, w: (959 - 260) / 2 - PADDING * 2 };
const COL_PRODUCTS = [
  { x: 959 + PADDING, w: 1426 - 959 - PADDING * 2 },   // アクスタ
  { x: 1426 + PADDING, w: 1892 - 1426 - PADDING * 2 },  // アクキー
  { x: 1892 + PADDING, w: 2359 - 1892 - PADDING * 2 },  // チェキ
  { x: 2359 + PADDING, w: 2826 - 2359 - PADDING * 2 },  // キラステッカー
  { x: 2929 + PADDING, w: 3395 - 2929 - PADDING * 2 },  // 旧アクキー
  { x: 3395 + PADDING, w: 3862 - 3395 - PADDING * 2 },  // 旧ステッカー
];

// メンバーごとの入力エリアY座標（★行の下の空白部分）
const MEMBERS_INPUT = [
  { y: 835, h: 165 },  // りこ
  { y: 1180, h: 165 }, // ナナ
  { y: 1530, h: 165 }, // 綺沙良
  { y: 1880, h: 165 }, // 桃音
  { y: 2230, h: 165 }, // ルンルン
];

// 共通商品（フレークシール、アクリルパーツ）
const COMMON_Y = 2565;
const COMMON_H = 245;
const COMMON_COLS = [
  { x: 260 + PADDING, w: (959 - 260) / 2 - PADDING * 2 },
  { x: 260 + (959 - 260) / 2 + PADDING, w: (959 - 260) / 2 - PADDING * 2 },
];

function OverlayInput({
  value,
  onChange,
  style,
}: {
  value: number;
  onChange: (v: number) => void;
  style: React.CSSProperties;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      value={value || ""}
      onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
      className={`absolute text-center font-bold rounded ${
        value > 0
          ? "bg-yellow-200/80 border-2 border-yellow-500 text-gray-900"
          : "bg-white/50 border border-gray-300/40 text-gray-500"
      }`}
      style={{ ...style, fontSize: "clamp(10px, 2vw, 20px)" }}
    />
  );
}

function SetOverlay({
  value,
  canAdd,
  onChange,
  style,
}: {
  value: number;
  canAdd: boolean;
  onChange: (v: number) => void;
  style: React.CSSProperties;
}) {
  return (
    <input
      type="number"
      inputMode="numeric"
      min={0}
      max={canAdd ? 99 : value}
      value={value || ""}
      onChange={(e) => {
        const v = parseInt(e.target.value) || 0;
        onChange(Math.max(0, v));
      }}
      className={`absolute text-center font-bold rounded ${
        value > 0
          ? "bg-yellow-200/80 border-2 border-yellow-500 text-gray-900"
          : "bg-white/50 border border-gray-300/40 text-gray-500"
      }`}
      style={{ ...style, fontSize: "clamp(10px, 2vw, 20px)" }}
    />
  );
}

export function ImageView({
  getQuantity,
  setQuantity,
  getCommonQuantity,
  setCommonQuantity,
  totalSets,
}: ImageViewProps) {
  const canAddSet = totalSets < MAX_SETS_PER_ORDER;

  return (
    <div className="relative w-full select-none">
      <img
        src="/order-sheet.jpg"
        alt="注文票"
        className="w-full h-auto block"
        draggable={false}
      />

      {MEMBERS.map((member, mi) => {
        const { y, h } = MEMBERS_INPUT[mi];
        const setAKey = `${member.set.id}-A`;
        const setBKey = `${member.set.id}-B`;

        return (
          <div key={member.id}>
            <SetOverlay
              value={getQuantity(member.id, setAKey)}
              canAdd={canAddSet}
              onChange={(v) => setQuantity(member.id, setAKey, v)}
              style={pct(COL_SET_A.x, y, COL_SET_A.w, h)}
            />
            <SetOverlay
              value={getQuantity(member.id, setBKey)}
              canAdd={canAddSet}
              onChange={(v) => setQuantity(member.id, setBKey, v)}
              style={pct(COL_SET_B.x, y, COL_SET_B.w, h)}
            />
            {member.products.map((p, pi) => (
              <OverlayInput
                key={p.id}
                value={getQuantity(member.id, p.id)}
                onChange={(v) => setQuantity(member.id, p.id, v)}
                style={pct(COL_PRODUCTS[pi].x, y, COL_PRODUCTS[pi].w, h)}
              />
            ))}
          </div>
        );
      })}

      {COMMON_PRODUCTS.map((product, i) => (
        <OverlayInput
          key={product.id}
          value={getCommonQuantity(product.id)}
          onChange={(v) => setCommonQuantity(product.id, v)}
          style={pct(COMMON_COLS[i].x, COMMON_Y, COMMON_COLS[i].w, COMMON_H)}
        />
      ))}
    </div>
  );
}
