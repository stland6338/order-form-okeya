import { useRef, useState, useEffect, useCallback } from "react";
import { MEMBERS, COMMON_PRODUCTS, MAX_SETS_PER_ORDER } from "../data";

interface ImageViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  setQuantity: (memberId: string, productId: string, quantity: number) => void;
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
  totalSets: number;
}

// 画像の自然サイズ
const IMG_W = 4093;
// IMG_H = 2894 (参考値)

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

// メンバー入力行
const MEMBERS_ROW = [
  { y: 825, h: 176 },
  { y: 1177, h: 172 },
  { y: 1524, h: 176 },
  { y: 1876, h: 176 },
  { y: 2230, h: 172 },
];

// 共通商品（各セルが約450px幅で隣接）
const COMMON_Y = 2645;
const COMMON_H = 172;
const COMMON_COLS = [
  { x: 500, w: 450 },   // フレークシール (x=500〜950)
  { x: 960, w: 450 },   // アクリルパーツ (x=960〜1410)
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
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [showLimitMsg, setShowLimitMsg] = useState(false);

  const updateSize = useCallback(() => {
    if (imgRef.current) {
      setImgSize({
        w: imgRef.current.clientWidth,
        h: imgRef.current.clientHeight,
      });
    }
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [updateSize]);

  // px単位で座標を計算（%ではなく実ピクセル）
  function pos(x: number, y: number, w: number, h: number): React.CSSProperties {
    if (imgSize.w === 0) return { display: "none" };
    const scale = imgSize.w / IMG_W;
    return {
      left: `${x * scale}px`,
      top: `${y * scale}px`,
      width: `${w * scale}px`,
      height: `${h * scale}px`,
    };
  }

  return (
    <div className="w-full select-none overflow-hidden relative">
      {showLimitMsg && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white text-sm font-bold px-4 py-2 rounded-lg shadow-lg animate-bounce">
          セットはメンバー問わず1会計につき合計2個までです
        </div>
      )}
      <div className="relative inline-block w-full">
        <img
          ref={imgRef}
          src="/order-sheet.jpg"
          alt="注文票"
          className="block w-full h-auto"
          draggable={false}
          onLoad={updateSize}
        />

        {imgSize.w > 0 && (
          <>
            {MEMBERS.map((member, mi) => {
              const { y, h } = MEMBERS_ROW[mi];
              const setAKey = `${member.set.id}-A`;
              const setBKey = `${member.set.id}-B`;

              const clampSet = (key: string, v: number) => {
                const current = getQuantity(member.id, key);
                const increase = v - current;
                if (increase <= 0) return v;
                const remaining = MAX_SETS_PER_ORDER - totalSets;
                const clamped = current + Math.min(increase, remaining);
                if (clamped < v) {
                  setShowLimitMsg(true);
                  setTimeout(() => setShowLimitMsg(false), 3000);
                }
                return clamped;
              };

              return (
                <div key={member.id}>
                  <OverlayInput
                    value={getQuantity(member.id, setAKey)}
                    onChange={(v) => setQuantity(member.id, setAKey, clampSet(setAKey, v))}
                    style={pos(COL_SET_A.x, y, COL_SET_A.w, h)}
                  />
                  <OverlayInput
                    value={getQuantity(member.id, setBKey)}
                    onChange={(v) => setQuantity(member.id, setBKey, clampSet(setBKey, v))}
                    style={pos(COL_SET_B.x, y, COL_SET_B.w, h)}
                  />
                  {member.products.map((p, pi) => (
                    <OverlayInput
                      key={p.id}
                      value={getQuantity(member.id, p.id)}
                      onChange={(v) => setQuantity(member.id, p.id, v)}
                      style={pos(COL_PRODUCTS[pi].x, y, COL_PRODUCTS[pi].w, h)}
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
                style={pos(COMMON_COLS[i].x, COMMON_Y, COMMON_COLS[i].w, COMMON_H)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
