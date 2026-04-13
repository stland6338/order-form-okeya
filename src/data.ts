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
    bg: "#e5c735",
    text: "#4a3f00",
    border: "#d0b42e",
  }, 1),
  createMember("nana", "ナナ", {
    bg: "#83b7e2",
    text: "#1a3a5c",
    border: "#6fa5d4",
  }, 8),
  createMember("kisara", "綺沙良", {
    bg: "#ac83cc",
    text: "#3a1a5c",
    border: "#9a6fbe",
  }, 15),
  createMember("moone", "桃音", {
    bg: "#ff9cce",
    text: "#6b0040",
    border: "#f080b8",
  }, 22),
  createMember("runrun", "ルンルン", {
    bg: "#a5b2d3",
    text: "#2a3050",
    border: "#8f9cc0",
  }, 29),
];

export const COMMON_PRODUCTS: CommonProduct[] = [
  { id: "flake-seal", name: "36. フレークシール", price: 500, inSet: true },
  { id: "acrylic-parts", name: "37. アクリルパーツ", price: 2000, inSet: false },
];

export const MAX_SETS_PER_ORDER = 2;
export const MAX_QUANTITY = 99;

export const STORAGE_KEY = "okeya-order";
