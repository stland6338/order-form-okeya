interface ProductRowProps {
  name: string;
  price: number;
  inSet: boolean;
  quantity: number;
  onChange: (quantity: number) => void;
}

export function ProductRow({ name, price, inSet, quantity, onChange }: ProductRowProps) {
  const active = quantity > 0;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-2 border-b border-gray-100 ${
        active ? "bg-yellow-50" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium truncate">{name}</span>
          {inSet && (
            <span className="text-amber-500 text-xs flex-shrink-0">★</span>
          )}
        </div>
        <span className="text-xs text-gray-500">¥{price.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(quantity - 1)}
          disabled={quantity <= 0}
          className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-bold text-lg flex items-center justify-center disabled:opacity-30"
        >
          -
        </button>
        <span className="w-8 text-center font-mono text-lg font-bold">
          {quantity}
        </span>
        <button
          onClick={() => onChange(quantity + 1)}
          className="w-8 h-8 rounded-full bg-gray-700 text-white font-bold text-lg flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
