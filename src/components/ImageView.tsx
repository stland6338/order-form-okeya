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

// セットA/B: メンバー名右端(x=494)〜次の列(x=959)を均等2分割
// 画像の48pxチェックボックスセルは画面上10pxで小さすぎるため拡大
const COL_SET_A = { x: 497, w: 228 };
const COL_SET_B = { x: 729, w: 228 };

const P = 4;
const COL_PRODUCTS = [
  { x: 959 + P, w: 1426 - 959 - P * 2 },
  { x: 1426 + P, w: 1892 - 1426 - P * 2 },
  { x: 1892 + P, w: 2359 - 1892 - P * 2 },
  { x: 2359 + P, w: 2826 - 2359 - P * 2 },
  { x: 2929 + P, w: 3395 - 2929 - P * 2 },
  { x: 3395 + P, w: 3862 - 3395 - P * 2 },
];

// 各メンバーの入力行 (A/Bセル上端 → セクション下端)
const MEMBERS_ROW = [
  { y: 825, h: 176 },  // りこ  823→1003
  { y: 1177, h: 172 }, // ナナ  1175→1351
  { y: 1524, h: 176 }, // 綺沙良 1522→1702
  { y: 1876, h: 176 }, // 桃音  1874→2054
  { y: 2230, h: 172 }, // ルンルン 2228→2404
];

// 共通商品: フレークシール / アクリルパーツ
// 入力セル行(y=2643)〜ボックス下端(y=2819)
const COMMON_Y = 2645;
const COMMON_H = 172;
const COMMON_COLS = [
  { x: 530, w: 430 },  // フレークシール（商品名テキスト直下に合わせる）
  { x: 1030, w: 430 }, // アクリルパーツ（商品名テキスト直下に合わせる）
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
