import { COMMON_PRODUCTS } from "../data";
import { ProductRow } from "./ProductRow";

interface CommonSectionProps {
  getCommonQuantity: (productId: string) => number;
  setCommonQuantity: (productId: string, quantity: number) => void;
}

export function CommonSection({
  getCommonQuantity,
  setCommonQuantity,
}: CommonSectionProps) {
  return (
    <div
      className="border-2 rounded-lg overflow-hidden"
      style={{ borderColor: "#afafaf" }}
    >
      <div
        className="px-3 py-2 font-bold text-lg"
        style={{ backgroundColor: "#afafaf", color: "#fff" }}
      >
        共通商品
      </div>
      <div className="bg-white">
        {COMMON_PRODUCTS.map((product) => (
          <ProductRow
            key={product.id}
            name={product.name}
            price={product.price}
            inSet={product.inSet}
            quantity={getCommonQuantity(product.id)}
            onChange={(q) => setCommonQuantity(product.id, q)}
          />
        ))}
      </div>
    </div>
  );
}
