import { MEMBERS, COMMON_PRODUCTS } from "../data";

interface MenuViewProps {
  getQuantity: (memberId: string, productId: string) => number;
  getCommonQuantity: (productId: string) => number;
}

// 画像サイズ
const M1_W = 2894;
const M1_H = 4075;
const M2_W = 2894;
const M2_H = 4013;

type CellCoord = { x: number; y: number; w: number; h: number };

// menu1.jpg の各セル座標 (りこ, ナナ, 綺沙良)
// 測定結果から算出:
// りこ: 行1(set+acsta) y=228-702, 行2(products) y=948-1239
// ナナ: 行1 y=1545-2007, 行2 y=2262-2583
// 綺沙良: 行1 y=2871-3321, 行2 y=3579-3897
const M1_CELLS: Record<string, CellCoord> = {
  // りこ
  "riko-set": { x: 30, y: 200, w: 2260, h: 540 },
  "riko-acsta": { x: 2310, y: 200, w: 560, h: 540 },
  "riko-ackey": { x: 30, y: 900, w: 565, h: 400 },
  "riko-cheki": { x: 597, y: 900, w: 565, h: 400 },
  "riko-kira": { x: 1164, y: 900, w: 565, h: 400 },
  "riko-old-ackey": { x: 1731, y: 900, w: 565, h: 400 },
  "riko-old-sticker": { x: 2298, y: 900, w: 565, h: 400 },
  // ナナ
  "nana-set": { x: 30, y: 1510, w: 2260, h: 540 },
  "nana-acsta": { x: 2310, y: 1510, w: 560, h: 540 },
  "nana-ackey": { x: 30, y: 2210, w: 565, h: 400 },
  "nana-cheki": { x: 597, y: 2210, w: 565, h: 400 },
  "nana-kira": { x: 1164, y: 2210, w: 565, h: 400 },
  "nana-old-ackey": { x: 1731, y: 2210, w: 565, h: 400 },
  "nana-old-sticker": { x: 2298, y: 2210, w: 565, h: 400 },
  // 綺沙良
  "kisara-set": { x: 30, y: 2830, w: 2260, h: 540 },
  "kisara-acsta": { x: 2310, y: 2830, w: 560, h: 540 },
  "kisara-ackey": { x: 30, y: 3530, w: 565, h: 400 },
  "kisara-cheki": { x: 597, y: 3530, w: 565, h: 400 },
  "kisara-kira": { x: 1164, y: 3530, w: 565, h: 400 },
  "kisara-old-ackey": { x: 1731, y: 3530, w: 565, h: 400 },
  "kisara-old-sticker": { x: 2298, y: 3530, w: 565, h: 400 },
};

// menu2.jpg の各セル座標 (桃音, ルンルン, 共通商品)
// 桃音: 行1 y=120-624, 行2 y=852-1221
// ルンルン: 行1 y=1398-1932, 行2 y=2196-2493
// 共通商品: y=2802-3258
const M2_CELLS: Record<string, CellCoord> = {
  // 桃音
  "moone-set": { x: 30, y: 100, w: 2260, h: 560 },
  "moone-acsta": { x: 2310, y: 100, w: 560, h: 560 },
  "moone-ackey": { x: 30, y: 820, w: 565, h: 420 },
  "moone-cheki": { x: 597, y: 820, w: 565, h: 420 },
  "moone-kira": { x: 1164, y: 820, w: 565, h: 420 },
  "moone-old-ackey": { x: 1731, y: 820, w: 565, h: 420 },
  "moone-old-sticker": { x: 2298, y: 820, w: 565, h: 420 },
  // ルンルン
  "runrun-set": { x: 30, y: 1380, w: 2260, h: 580 },
  "runrun-acsta": { x: 2310, y: 1380, w: 560, h: 580 },
  "runrun-ackey": { x: 30, y: 2160, w: 565, h: 380 },
  "runrun-cheki": { x: 597, y: 2160, w: 565, h: 380 },
  "runrun-kira": { x: 1164, y: 2160, w: 565, h: 380 },
  "runrun-old-ackey": { x: 1731, y: 2160, w: 565, h: 380 },
  "runrun-old-sticker": { x: 2298, y: 2160, w: 565, h: 380 },
  // 共通商品
  "flake-seal": { x: 30, y: 2780, w: 1410, h: 520 },
  "acrylic-parts": { x: 1460, y: 2780, w: 1410, h: 520 },
};

function pct(c: CellCoord, imgW: number, imgH: number): React.CSSProperties {
  return {
    left: `${(c.x / imgW) * 100}%`,
    top: `${(c.y / imgH) * 100}%`,
    width: `${(c.w / imgW) * 100}%`,
    height: `${(c.h / imgH) * 100}%`,
  };
}

function QuantityBadge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div
        className="absolute top-1 left-1 bg-yellow-400 text-gray-900 font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-gray-900"
        style={{
          width: "clamp(24px, 5vw, 40px)",
          height: "clamp(24px, 5vw, 40px)",
          fontSize: "clamp(12px, 3vw, 20px)",
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function MenuView({
  getQuantity,
  getCommonQuantity,
}: MenuViewProps) {
  // 各メンバーのセット合計(A+B)を取得するヘルパー
  const getSetTotal = (memberId: string, setId: string) =>
    getQuantity(memberId, `${setId}-A`) + getQuantity(memberId, `${setId}-B`);

  return (
    <div className="w-full select-none pb-4">
      {/* menu1.jpg: りこ / ナナ / 綺沙良 */}
      <div className="relative w-full">
        <img
          src="/menu1.jpg"
          alt="お品書き 1"
          className="block w-full h-auto"
          draggable={false}
        />
        {MEMBERS.slice(0, 3).map((member) => {
          const setKey = `${member.id}-set`;
          const setCell = M1_CELLS[setKey];
          const setTotal = getSetTotal(member.id, member.set.id);
          return (
            <div key={member.id}>
              {setCell && (
                <div className="absolute" style={pct(setCell, M1_W, M1_H)}>
                  <QuantityBadge value={setTotal} />
                </div>
              )}
              {member.products.map((p) => {
                const shortId = p.id.replace(`${member.id}-`, "");
                const cell = M1_CELLS[`${member.id}-${shortId}`];
                if (!cell) return null;
                return (
                  <div
                    key={p.id}
                    className="absolute"
                    style={pct(cell, M1_W, M1_H)}
                  >
                    <QuantityBadge value={getQuantity(member.id, p.id)} />
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* menu2.jpg: 桃音 / ルンルン / 共通商品 */}
      <div className="relative w-full mt-2">
        <img
          src="/menu2.jpg"
          alt="お品書き 2"
          className="block w-full h-auto"
          draggable={false}
        />
        {MEMBERS.slice(3).map((member) => {
          const setKey = `${member.id}-set`;
          const setCell = M2_CELLS[setKey];
          const setTotal = getSetTotal(member.id, member.set.id);
          return (
            <div key={member.id}>
              {setCell && (
                <div className="absolute" style={pct(setCell, M2_W, M2_H)}>
                  <QuantityBadge value={setTotal} />
                </div>
              )}
              {member.products.map((p) => {
                const shortId = p.id.replace(`${member.id}-`, "");
                const cell = M2_CELLS[`${member.id}-${shortId}`];
                if (!cell) return null;
                return (
                  <div
                    key={p.id}
                    className="absolute"
                    style={pct(cell, M2_W, M2_H)}
                  >
                    <QuantityBadge value={getQuantity(member.id, p.id)} />
                  </div>
                );
              })}
            </div>
          );
        })}
        {COMMON_PRODUCTS.map((p) => {
          const cell = M2_CELLS[p.id];
          if (!cell) return null;
          return (
            <div key={p.id} className="absolute" style={pct(cell, M2_W, M2_H)}>
              <QuantityBadge value={getCommonQuantity(p.id)} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
