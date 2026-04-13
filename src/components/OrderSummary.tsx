interface OrderSummaryProps {
  total: number;
  itemCount: number;
  onReset: () => void;
}

export function OrderSummary({ total, itemCount, onReset }: OrderSummaryProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t-2 border-gray-300 px-4 py-3 shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-500">{itemCount}点</p>
          <p className="text-2xl font-bold">
            ¥{total.toLocaleString()}
          </p>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-lg font-medium"
        >
          リセット
        </button>
      </div>
    </div>
  );
}
