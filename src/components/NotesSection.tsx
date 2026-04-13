import { useState } from "react";

export function NotesSection() {
  const [open, setOpen] = useState(true);

  return (
    <div className="mx-4 my-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-sm font-medium text-gray-700"
      >
        <span className={`transition-transform ${open ? "rotate-90" : ""}`}>
          ▶
        </span>
        注意事項
      </button>
      {open && (
        <ul className="mt-2 text-xs text-gray-600 space-y-1 pl-4 list-disc">
          <li>ご購入希望のものに個数を記入してください。</li>
          <li className="text-red-600 font-bold">セットはメンバー問わず1会計につき合計2個までとさせていただきます。</li>
          <li>★＝セットに入っているものです。</li>
          <li>待ち時間お時間ある方はぴったりの金額をご用意いただけると大変助かります！</li>
        </ul>
      )}
    </div>
  );
}
