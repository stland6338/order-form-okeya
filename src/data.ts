import type { Member, MemberColors, CommonProduct } from "./types";

function createMember(
  id: string,
  name: string,
  colors: MemberColors,
  startNum: number,
): Member {
  return {
    id,
    name,
    colors,
    set: {
      id: `${id}-set`,
      name: `${startNum}. セット`,
      price: 3000,
      variants: ["A", "B"],
    },
    products: [
      { id: `${id}-acsta`, name: `${startNum + 1}. アクスタ`, price: 1500, inSet: false },
      { id: `${id}-ackey`, name: `${startNum + 2}. アクキー`, price: 800, inSet: true },
      { id: `${id}-cheki`, name: `${startNum + 3}. チェキ`, price: 200, inSet: true },
      { id: `${id}-kira`, name: `${startNum + 4}. キラステッカー`, price: 300, inSet: true },
      { id: `${id}-old-ackey`, name: `${startNum + 5}. 旧アクキー`, price: 800, inSet: false },
      { id: `${id}-old-sticker`, name: `${startNum + 6}. 旧ステッカー`, price: 200, inSet: false },
    ],
  };
}

// 元画像に合わせた色定義
export const MEMBERS: Member[] = [
  createMember("riko", "りこ", {
    bg: "#FFE033",    // 鮮やかな黄色
    text: "#5C4A00",
    border: "#E6C800",
  }, 1),
  createMember("nana", "ナナ", {
    bg: "#5BADE6",    // コーンフラワーブルー
    text: "#003366",
    border: "#4A9AD6",
  }, 8),
  createMember("kisara", "綺沙良", {
    bg: "#7DD4F0",    // スカイブルー（ナナより明るい）
    text: "#0A4D68",
    border: "#60C4E0",
  }, 15),
  createMember("moone", "桃音", {
    bg: "#FF85B0",    // ホットピンク
    text: "#6B0030",
    border: "#F06898",
  }, 22),
  createMember("runrun", "ルンルン", {
    bg: "#7ED957",    // ライムグリーン
    text: "#1A5C00",
    border: "#66C840",
  }, 29),
];

export const COMMON_PRODUCTS: CommonProduct[] = [
  { id: "flake-seal", name: "36. フレークシール", price: 500, inSet: true },
  { id: "acrylic-parts", name: "37. アクリルパーツ", price: 2000, inSet: false },
];

export const MAX_SETS_PER_ORDER = 2;

export const STORAGE_KEY = "okeya-order";
