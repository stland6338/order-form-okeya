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

// === 列の境界（y=760で測定した垂直黒線） ===
// x: 493, 959, 1426, 1892, 2359, 2826, [gap 2826-2929], 3395, 3862
//
// メンバー名背景(黄色等): 左端 → x≈494
// セットA cell: x≈494 → x≈544 (小さなチェックボックス)
// セットB cell: x≈544 → x≈772
// ★エリア: x≈772 → x≈959
// 以降は各商品列

const P = 4; // padding

// セットA/B: チェックボックスの位置に合わせる
// A: x=494内側からx=544手前  B: x=544内側からx=772手前
const COL_SET_A = { x: 497, w: 44 };
const COL_SET_B = { x: 547, w: 220 };

// 通常商品列
const COL_PRODUCTS = [
  { x: 959 + P, w: 1426 - 959 - P * 2 },   // アクスタ
  { x: 1426 + P, w: 1892 - 1426 - P * 2 },  // アクキー
  { x: 1892 + P, w: 2359 - 1892 - P * 2 },  // チェキ
  { x: 2359 + P, w: 2826 - 2359 - P * 2 },  // キラステッカー
  { x: 2929 + P, w: 3395 - 2929 - P * 2 },  // 旧アクキー
  { x: 3395 + P, w: 3862 - 3395 - P * 2 },  // 旧ステッカー
];

// === 行の境界（y方向） ===
// 各メンバーのメンバー行全体（A/Bラベル + ★ + 空白）
// セル全体に入力を重ねて、値がないときは透明にする
const MEMBERS_ROW = [
  { y: 780, h: 220 },  // りこ  (y=780 → y=1000)
  { y: 1128, h: 220 }, // ナナ
  { y: 1478, h: 220 }, // 綺沙良
  { y: 1828, h: 220 }, // 桃音
  { y: 2178, h: 220 }, // ルンルン
];

// === 共通商品 ===
// 画像の共通商品ボックス内の入力エリア
// 商品名行の下: y≈2560, ボックス下端: y≈2820
// フレークシール: 左半分(x≈155-492), アクリルパーツ: 右半分(x≈496-958)
const COMMON_Y = 2560;
const COMMON_H = 255;
const COMMON_COLS = [
  { x: 158, w: 330 },  // フレークシール
  { x: 496, w: 458 },  // アクリルパーツ
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
          : "bg-transparent"
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
        const { y, h } = MEMBERS_ROW[mi];
        const setAKey = `${member.set.id}-A`;
        const setBKey = `${member.set.id}-B`;

        return (
          <div key={member.id}>
            {/* セットA */}
            <OverlayInput
              value={getQuantity(member.id, setAKey)}
              onChange={(v) => {
                if (!canAddSet && v > getQuantity(member.id, setAKey)) return;
                setQuantity(member.id, setAKey, v);
              }}
              style={pct(COL_SET_A.x, y, COL_SET_A.w, h)}
            />
            {/* セットB */}
            <OverlayInput
              value={getQuantity(member.id, setBKey)}
              onChange={(v) => {
                if (!canAddSet && v > getQuantity(member.id, setBKey)) return;
                setQuantity(member.id, setBKey, v);
              }}
              style={pct(COL_SET_B.x, y, COL_SET_B.w, h)}
            />
            {/* 通常商品 */}
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

      {/* 共通商品 */}
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
