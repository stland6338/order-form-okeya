import { useState } from "react";

export function NotesSection() {
  const [open, setOpen] = useState(false);

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
          <li>記入が終わったら記入した紙をお持ちいただき、バインダーを後ろの方に回してください。</li>
          <li>桶沢のXを見て既にご対応いただいている方は記入不要です。そのままバインダーを後ろへ回し、注文時は画面を見せてください。</li>
          <li>時間がかかりそうな方はQRコード読み込み後スマホでご対応ください。</li>
          <li>セットは一回のお会計で2個までとさせていただきます。</li>
          <li>★＝セットに入っているものです。</li>
          <li>待ち時間お時間ある方はぴったりの金額をご用意いただけると大変助かります！</li>
          <li>混乱回避のためこちらの紙は会計後お返しさせていただきます。</li>
        </ul>
      )}
    </div>
  );
}
