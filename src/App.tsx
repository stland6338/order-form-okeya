import { useMemo, useState } from "react";
import { MEMBERS, COMMON_PRODUCTS } from "./data";
import { useOrderState } from "./hooks/useOrderState";
import { Header } from "./components/Header";
import { NotesSection } from "./components/NotesSection";
import { MemberSection } from "./components/MemberSection";
import { CommonSection } from "./components/CommonSection";
import { OrderSummary } from "./components/OrderSummary";
import { TableView } from "./components/TableView";

type ViewMode = "list" | "table";

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    order,
    setQuantity,
    setCommonQuantity,
    getQuantity,
    getCommonQuantity,
    resetOrder,
  } = useOrderState();

  // セット合計数（全メンバー横断）
  const totalSets = useMemo(() => {
    let count = 0;
    for (const member of MEMBERS) {
      for (const variant of member.set.variants) {
        const key = `${member.set.id}-${variant}`;
        count += order.members[member.id]?.[key] ?? 0;
      }
    }
    return count;
  }, [order]);

  // 合計金額・合計点数
  const { total, itemCount } = useMemo(() => {
    let total = 0;
    let itemCount = 0;

    for (const member of MEMBERS) {
      // セット
      for (const variant of member.set.variants) {
        const key = `${member.set.id}-${variant}`;
        const qty = order.members[member.id]?.[key] ?? 0;
        if (qty > 0) {
          total += member.set.price * qty;
          itemCount += qty;
        }
      }
      // 通常商品
      for (const product of member.products) {
        const qty = order.members[member.id]?.[product.id] ?? 0;
        if (qty > 0) {
          total += product.price * qty;
          itemCount += qty;
        }
      }
    }

    // 共通商品
    for (const product of COMMON_PRODUCTS) {
      const qty = order.common[product.id] ?? 0;
      if (qty > 0) {
        total += product.price * qty;
        itemCount += qty;
      }
    }

    return { total, itemCount };
  }, [order]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      {/* ビュー切り替えタブ */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setViewMode("table")}
          className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
            viewMode === "table"
              ? "border-gray-800 text-gray-900"
              : "border-transparent text-gray-400"
          }`}
        >
          注文票
        </button>
        <button
          onClick={() => setViewMode("list")}
          className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
            viewMode === "list"
              ? "border-gray-800 text-gray-900"
              : "border-transparent text-gray-400"
          }`}
        >
          リスト
        </button>
      </div>

      <NotesSection />

      {viewMode === "table" ? (
        <TableView
          getQuantity={getQuantity}
          setQuantity={setQuantity}
          getCommonQuantity={getCommonQuantity}
          setCommonQuantity={setCommonQuantity}
          totalSets={totalSets}
        />
      ) : (
        <div className="px-4 space-y-4 pb-4">
          {MEMBERS.map((member) => (
            <MemberSection
              key={member.id}
              member={member}
              getQuantity={getQuantity}
              setQuantity={setQuantity}
              totalSets={totalSets}
            />
          ))}
          <CommonSection
            getCommonQuantity={getCommonQuantity}
            setCommonQuantity={setCommonQuantity}
          />
        </div>
      )}

      <OrderSummary
        total={total}
        itemCount={itemCount}
        onReset={resetOrder}
      />
    </div>
  );
}

export default App;
