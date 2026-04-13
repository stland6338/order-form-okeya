import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface ImageViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

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

// ピクセル単位の正確なセル境界（strongHLine/strongVLineで測定済み）
// 垂直線(x): 493, 544, 721, 772, 959, 1426, 1892, 2359, 2826, 2929, 3395, 3862

// セットA/B: メンバー名右端〜次の列を均等2分割
// 実機確認で上にかかっていたためY方向は下にオフセット
const COL_SET_A = { x: 570, w: 190 };
const COL_SET_B = { x: 770, w: 190 };

const P = 4;
const COL_PRODUCTS = [
  { x: 959 + P, w: 1426 - 959 - P * 2 },
  { x: 1426 + P, w: 1892 - 1426 - P * 2 },
  { x: 1892 + P, w: 2359 - 1892 - P * 2 },
  { x: 2359 + P, w: 2826 - 2359 - P * 2 },
  { x: 2929 + P, w: 3395 - 2929 - P * 2 },
  { x: 3395 + P, w: 3862 - 3395 - P * 2 },
];

// 各メンバーの入力行（実機で上にかかっていたため下にオフセット）
const MEMBERS_ROW = [
  { y: 870, h: 130 },  // りこ
  { y: 1220, h: 130 }, // ナナ
  { y: 1570, h: 130 }, // 綺沙良
  { y: 1920, h: 130 }, // 桃音
  { y: 2270, h: 130 }, // ルンルン
];

// 共通商品: フレークシール / アクリルパーツ
// 入力セル行(y=2643)〜ボックス下端(y=2819)
const COMMON_Y = 2645;
const COMMON_H = 172;
const COMMON_COLS = [
  { x: 580, w: 380 },  // フレークシール（少し右に微調整）
  { x: 1080, w: 380 }, // アクリルパーツ（少し右に微調整）
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
            <OverlayInput
              value={getQuantity(member.id, setAKey)}
              onChange={(v) => {
                if (!canAddSet && v > getQuantity(member.id, setAKey)) return;
                setQuantity(member.id, setAKey, v);
              }}
              style={pct(COL_SET_A.x, y, COL_SET_A.w, h)}
            />
            <OverlayInput
              value={getQuantity(member.id, setBKey)}
              onChange={(v) => {
                if (!canAddSet && v > getQuantity(member.id, setBKey)) return;
                setQuantity(member.id, setBKey, v);
              }}
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
