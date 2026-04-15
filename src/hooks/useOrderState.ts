import { useState, useCallback } from "react";
import type { OrderState } from "../types";
import { STORAGE_KEY, MEMBERS, MAX_SETS_PER_ORDER, MAX_PER_PRODUCT, MAX_QUANTITY } from "../data";

function isValidOrderState(v: unknown): v is OrderState {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return (
    typeof obj.members === "object" && obj.members !== null &&
    typeof obj.common === "object" && obj.common !== null
  );
}

function loadOrder(): OrderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (isValidOrderState(parsed)) return parsed;
    }
  } catch {
    // ignore
  }
  return { members: {}, common: {} };
}

function saveOrder(state: OrderState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// 現在の全セット合計を計算
function countTotalSets(state: OrderState): number {
  let count = 0;
  for (const member of MEMBERS) {
    for (const variant of member.set.variants) {
      const key = `${member.set.id}-${variant}`;
      count += state.members[member.id]?.[key] ?? 0;
    }
  }
  return count;
}

// セットのキーかどうかを判定
function isSetKey(productId: string): boolean {
  return MEMBERS.some(
    (m) => m.set.variants.some((v) => `${m.set.id}-${v}` === productId),
  );
}

export function useOrderState() {
  const [order, setOrder] = useState<OrderState>(loadOrder);

  const setQuantity = useCallback(
    (memberId: string, productId: string, quantity: number) => {
      setOrder((prev) => {
        let qty = Math.min(MAX_QUANTITY, Math.max(0, quantity));

        if (isSetKey(productId)) {
          // セットの場合: 合計2個上限
          const currentQty = prev.members[memberId]?.[productId] ?? 0;
          const currentTotal = countTotalSets(prev);
          const increase = qty - currentQty;
          if (increase > 0) {
            const remaining = MAX_SETS_PER_ORDER - currentTotal;
            qty = currentQty + Math.min(increase, Math.max(0, remaining));
          }
        } else {
          // 通常商品: 個別3個上限
          qty = Math.min(MAX_PER_PRODUCT, qty);
        }

        const next: OrderState = {
          ...prev,
          members: {
            ...prev.members,
            [memberId]: {
              ...prev.members[memberId],
              [productId]: qty,
            },
          },
        };
        saveOrder(next);
        return next;
      });
    },
    [],
  );

  const setCommonQuantity = useCallback(
    (productId: string, quantity: number) => {
      setOrder((prev) => {
        const qty = Math.min(MAX_PER_PRODUCT, Math.max(0, quantity));
        const next: OrderState = {
          ...prev,
          common: {
            ...prev.common,
            [productId]: qty,
          },
        };
        saveOrder(next);
        return next;
      });
    },
    [],
  );

  const getQuantity = useCallback(
    (memberId: string, productId: string): number => {
      return order.members[memberId]?.[productId] ?? 0;
    },
    [order],
  );

  const getCommonQuantity = useCallback(
    (productId: string): number => {
      return order.common[productId] ?? 0;
    },
    [order],
  );

  // delta(+1/-1)で増減。prevから最新値を読むのでクロージャの古い値問題なし
  const adjustQuantity = useCallback(
    (memberId: string, productId: string, delta: number) => {
      setOrder((prev) => {
        const current = prev.members[memberId]?.[productId] ?? 0;
        let qty = Math.min(MAX_QUANTITY, Math.max(0, current + delta));

        if (isSetKey(productId) && delta > 0) {
          const currentTotal = countTotalSets(prev);
          const remaining = MAX_SETS_PER_ORDER - currentTotal;
          qty = current + Math.min(delta, Math.max(0, remaining));
        } else if (!isSetKey(productId)) {
          qty = Math.min(MAX_PER_PRODUCT, qty);
        }

        const next: OrderState = {
          ...prev,
          members: {
            ...prev.members,
            [memberId]: {
              ...prev.members[memberId],
              [productId]: qty,
            },
          },
        };
        saveOrder(next);
        return next;
      });
    },
    [],
  );

  const adjustCommonQuantity = useCallback(
    (productId: string, delta: number) => {
      setOrder((prev) => {
        const current = prev.common[productId] ?? 0;
        const qty = Math.min(MAX_PER_PRODUCT, Math.max(0, current + delta));
        const next: OrderState = {
          ...prev,
          common: {
            ...prev.common,
            [productId]: qty,
          },
        };
        saveOrder(next);
        return next;
      });
    },
    [],
  );

  const resetOrder = useCallback(() => {
    const empty: OrderState = { members: {}, common: {} };
    saveOrder(empty);
    setOrder(empty);
  }, []);

  return {
    order,
    setQuantity,
    setCommonQuantity,
    adjustQuantity,
    adjustCommonQuantity,
    getQuantity,
    getCommonQuantity,
    resetOrder,
  };
}
