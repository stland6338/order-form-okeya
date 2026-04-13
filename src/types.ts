export interface Product {
  id: string;
  name: string;
  price: number;
  inSet: boolean; // ★マーク（セットに含まれる）
}

export interface SetProduct {
  id: string;
  name: string;
  price: number;
  variants: string[]; // ["A", "B"]
}

export interface MemberColors {
  bg: string;       // 背景色 hex
  text: string;     // テキスト色 hex
  border: string;   // ボーダー色 hex
}

export interface Member {
  id: string;
  name: string;
  colors: MemberColors;
  set: SetProduct;
  products: Product[];
}

export interface CommonProduct {
  id: string;
  name: string;
  price: number;
  inSet: boolean;
}

export type OrderState = {
  members: Record<string, Record<string, number>>;
  common: Record<string, number>;
};
