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

// === menu1.jpg ===
// 測定値:
// りこ:   set+acsta y=228-702(h=474), products y=948-1239(h=291)
// ナナ:   set+acsta y=1545-2007(h=462), products y=2262-2583(h=321)
// 綺沙良: set+acsta y=2871-3321(h=450), products y=3579-3897(h=318)
//
// セットはトートバッグA/Bの位置に個別オーバーレイ（右側、上下分割）
// トートバッグエリア: x≈1440-2290 (右側の約30%)
// A: 上半分, B: 下半分

function buildMenu1(): Record<string, CellCoord> {
  const rows = [
    { setY: 228, setH: 474, prodY: 948, prodH: 291 }, // りこ
    { setY: 1545, setH: 462, prodY: 2262, prodH: 321 }, // ナナ
    { setY: 2871, setH: 450, prodY: 3579, prodH: 318 }, // 綺沙良
  ];
  const members = ["riko", "nana", "kisara"];
  const cells: Record<string, CellCoord> = {};

  // 通常商品5セルの幅
  const prodCellW = Math.floor((2894 - 60) / 5);
  const prodStartX = 30;

  // トートバッグA/B位置 (セット内右側)
  const bagX = 1440;
  const bagW = 850;

  // アクスタ位置
  const acstaX = 2310;
  const acstaW = 554;

  members.forEach((m, i) => {
    const r = rows[i];
    const halfH = Math.floor(r.setH / 2);
    cells[`${m}-set-A`] = { x: bagX, y: r.setY, w: bagW, h: halfH };
    cells[`${m}-set-B`] = { x: bagX, y: r.setY + halfH, w: bagW, h: r.setH - halfH };
    cells[`${m}-acsta`] = { x: acstaX, y: r.setY, w: acstaW, h: r.setH };

    const products = ["ackey", "cheki", "kira", "old-ackey", "old-sticker"];
    products.forEach((p, idx) => {
      cells[`${m}-${p}`] = {
        x: prodStartX + idx * prodCellW,
        y: r.prodY,
        w: prodCellW,
        h: r.prodH,
      };
    });
  });

  return cells;
}

// === menu2.jpg ===
// 桃音:   set+acsta y=120-624(h=504), products y=852-1221(h=369)
// ルンルン: set+acsta y=1398-1932(h=534), products y=2196-2493(h=297)
// 共通商品: y=2802-3258(h=456), 2セル横並び
function buildMenu2(): Record<string, CellCoord> {
  const rows = [
    { setY: 120, setH: 504, prodY: 852, prodH: 369 }, // 桃音
    { setY: 1398, setH: 534, prodY: 2196, prodH: 297 }, // ルンルン
  ];
  const members = ["moone", "runrun"];
  const cells: Record<string, CellCoord> = {};

  const prodCellW = Math.floor((2894 - 60) / 5);
  const prodStartX = 30;
  const bagX = 1440;
  const bagW = 850;
  const acstaX = 2310;
  const acstaW = 554;

  members.forEach((m, i) => {
    const r = rows[i];
    const halfH = Math.floor(r.setH / 2);
    cells[`${m}-set-A`] = { x: bagX, y: r.setY, w: bagW, h: halfH };
    cells[`${m}-set-B`] = { x: bagX, y: r.setY + halfH, w: bagW, h: r.setH - halfH };
    cells[`${m}-acsta`] = { x: acstaX, y: r.setY, w: acstaW, h: r.setH };

    const products = ["ackey", "cheki", "kira", "old-ackey", "old-sticker"];
    products.forEach((p, idx) => {
      cells[`${m}-${p}`] = {
        x: prodStartX + idx * prodCellW,
        y: r.prodY,
        w: prodCellW,
        h: r.prodH,
      };
    });
  });

  // 共通商品 (横並び2セル)
  const commonCellW = Math.floor((2894 - 60) / 2);
  cells["flake-seal"] = { x: 30, y: 2802, w: commonCellW, h: 456 };
  cells["acrylic-parts"] = {
    x: 30 + commonCellW,
    y: 2802,
    w: commonCellW,
    h: 456,
  };

  return cells;
}

const M1_CELLS = buildMenu1();
const M2_CELLS = buildMenu2();

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
    <div className="absolute inset-0 pointer-events-none bg-yellow-300/40 rounded">
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
          const setAKey = `${member.set.id}-A`;
          const setBKey = `${member.set.id}-B`;
          const setACell = M1_CELLS[`${member.id}-set-A`];
          const setBCell = M1_CELLS[`${member.id}-set-B`];
          return (
            <div key={member.id}>
              {setACell && (
                <div className="absolute" style={pct(setACell, M1_W, M1_H)}>
                  <QuantityBadge value={getQuantity(member.id, setAKey)} />
                </div>
              )}
              {setBCell && (
                <div className="absolute" style={pct(setBCell, M1_W, M1_H)}>
                  <QuantityBadge value={getQuantity(member.id, setBKey)} />
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
          const setAKey = `${member.set.id}-A`;
          const setBKey = `${member.set.id}-B`;
          const setACell = M2_CELLS[`${member.id}-set-A`];
          const setBCell = M2_CELLS[`${member.id}-set-B`];
          return (
            <div key={member.id}>
              {setACell && (
                <div className="absolute" style={pct(setACell, M2_W, M2_H)}>
                  <QuantityBadge value={getQuantity(member.id, setAKey)} />
                </div>
              )}
              {setBCell && (
                <div className="absolute" style={pct(setBCell, M2_W, M2_H)}>
                  <QuantityBadge value={getQuantity(member.id, setBKey)} />
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
