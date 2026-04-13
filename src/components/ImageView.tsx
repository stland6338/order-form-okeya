import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface ImageViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

// 画像サイズ: 4093 x 2894
const IMG_W = 4093;
const IMG_H = 2894;
const IMG_RATIO = `${IMG_W} / ${IMG_H}`;

function pct(x: number, y: number, w: number, h: number) {
  return {
    left: `${(x / IMG_W) * 100}%`,
    top: `${(y / IMG_H) * 100}%`,
    width: `${(w / IMG_W) * 100}%`,
    height: `${(h / IMG_H) * 100}%`,
  };
}

// セットA/B
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

// 各メンバーの入力行
const MEMBERS_ROW = [
  { y: 825, h: 176 },  // りこ
  { y: 1177, h: 172 }, // ナナ
  { y: 1524, h: 176 }, // 綺沙良
  { y: 1876, h: 176 }, // 桃音
  { y: 2230, h: 172 }, // ルンルン
];

// 共通商品（白いコンテンツエリア x=498〜955 を2等分）
const COMMON_Y = 2645;
const COMMON_H = 172;
const COMMON_COLS = [
  { x: 500, w: 224 },  // フレークシール (x=500〜724)
  { x: 730, w: 224 },  // アクリルパーツ (x=730〜954)
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
    <div
      className="relative w-full select-none"
      style={{
        aspectRatio: IMG_RATIO,
        backgroundImage: "url(/order-sheet.jpg)",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
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
