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

// === menu1.jpg 実測値 ===
// 水平境界: 105-737, 774-1317, 1437-2064, 2101-2644, 2758-3394, 3426-3969
// 垂直境界(set): 110-2261(set), 2306-2809(acsta)
// 垂直境界(prod): 110-617, 658-1165, 1206-1713, 1758-2261, 2306-2809
// セット内トートバッグA/B分割: x=1354 (右半分)

function buildMenu1(): Record<string, CellCoord> {
  const cells: Record<string, CellCoord> = {};

  // 各メンバーの行境界
  const rows = [
    { name: "riko", setT: 105, setB: 737, prodT: 774, prodB: 1317 },
    { name: "nana", setT: 1437, setB: 2064, prodT: 2101, prodB: 2644 },
    { name: "kisara", setT: 2758, setB: 3394, prodT: 3426, prodB: 3969 },
  ];

  // 商品セルのX座標
  const productCols = [
    { x: 110, w: 507 },   // 1
    { x: 658, w: 507 },   // 2
    { x: 1206, w: 507 },  // 3
    { x: 1758, w: 503 },  // 4
    { x: 2306, w: 503 },  // 5
  ];

  // セット内トートバッグA/B位置
  const bagX = 1354;
  const bagW = 907; // 1354 → 2261

  // アクスタ
  const acstaX = 2306;
  const acstaW = 503;

  rows.forEach((r) => {
    const setH = r.setB - r.setT;
    const halfH = Math.floor(setH / 2);

    // セットA/B (トートバッグ位置)
    cells[`${r.name}-set-A`] = {
      x: bagX,
      y: r.setT,
      w: bagW,
      h: halfH,
    };
    cells[`${r.name}-set-B`] = {
      x: bagX,
      y: r.setT + halfH,
      w: bagW,
      h: setH - halfH,
    };

    // アクスタ
    cells[`${r.name}-acsta`] = {
      x: acstaX,
      y: r.setT,
      w: acstaW,
      h: setH,
    };

    // 商品セル(アクキー, チェキ, キラステッカー, 旧アクキー, 旧ステッカー)
    const products = ["ackey", "cheki", "kira", "old-ackey", "old-sticker"];
    products.forEach((p, i) => {
      cells[`${r.name}-${p}`] = {
        x: productCols[i].x,
        y: r.prodT,
        w: productCols[i].w,
        h: r.prodB - r.prodT,
      };
    });
  });

  return cells;
}

// === menu2.jpg 実測値 ===
// 水平境界: 25-657, 693-1236, 1352-1983, 2020-2567, 2681-3308
// 垂直境界(set): 103-2253(set), 2298-2801(acsta)
// 垂直境界(prod): 103-610, 651-1158, 1198-1710, 1746-2253, 2298-2801
// 共通商品: 103-1422, 1459-2801

function buildMenu2(): Record<string, CellCoord> {
  const cells: Record<string, CellCoord> = {};

  const rows = [
    { name: "moone", setT: 25, setB: 657, prodT: 693, prodB: 1236 },
    { name: "runrun", setT: 1352, setB: 1983, prodT: 2020, prodB: 2567 },
  ];

  const productCols = [
    { x: 103, w: 507 },
    { x: 651, w: 507 },
    { x: 1198, w: 512 },
    { x: 1746, w: 507 },
    { x: 2298, w: 503 },
  ];

  const bagX = 1328;
  const bagW = 925; // 1328 → 2253
  const acstaX = 2298;
  const acstaW = 503;

  rows.forEach((r) => {
    const setH = r.setB - r.setT;
    const halfH = Math.floor(setH / 2);

    cells[`${r.name}-set-A`] = {
      x: bagX,
      y: r.setT,
      w: bagW,
      h: halfH,
    };
    cells[`${r.name}-set-B`] = {
      x: bagX,
      y: r.setT + halfH,
      w: bagW,
      h: setH - halfH,
    };
    cells[`${r.name}-acsta`] = {
      x: acstaX,
      y: r.setT,
      w: acstaW,
      h: setH,
    };

    const products = ["ackey", "cheki", "kira", "old-ackey", "old-sticker"];
    products.forEach((p, i) => {
      cells[`${r.name}-${p}`] = {
        x: productCols[i].x,
        y: r.prodT,
        w: productCols[i].w,
        h: r.prodB - r.prodT,
      };
    });
  });

  // 共通商品
  cells["flake-seal"] = { x: 103, y: 2681, w: 1319, h: 627 };
  cells["acrylic-parts"] = { x: 1459, y: 2681, w: 1342, h: 627 };

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
