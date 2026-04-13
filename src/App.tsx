import { useMemo } from "react";
import { MEMBERS, COMMON_PRODUCTS } from "./data";
import { useOrderState } from "./hooks/useOrderState";
import { Header } from "./components/Header";
import { OrderSummary } from "./components/OrderSummary";
import { ImageView } from "./components/ImageView";

function App() {
  const {
    order,
    setQuantity,
    setCommonQuantity,
    getQuantity,
    getCommonQuantity,
    resetOrder,
  } = useOrderState();

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

  const { total, itemCount } = useMemo(() => {
    let total = 0;
    let itemCount = 0;

    for (const member of MEMBERS) {
      for (const variant of member.set.variants) {
        const key = `${member.set.id}-${variant}`;
        const qty = order.members[member.id]?.[key] ?? 0;
        if (qty > 0) {
          total += member.set.price * qty;
          itemCount += qty;
        }
      }
      for (const product of member.products) {
        const qty = order.members[member.id]?.[product.id] ?? 0;
        if (qty > 0) {
          total += product.price * qty;
          itemCount += qty;
        }
      }
    }

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

      <ImageView
        getQuantity={getQuantity}
        setQuantity={setQuantity}
        getCommonQuantity={getCommonQuantity}
        setCommonQuantity={setCommonQuantity}
        totalSets={totalSets}
      />

      <OrderSummary
        total={total}
        itemCount={itemCount}
        onReset={resetOrder}
      />
    </div>
  );
}

export default App;
