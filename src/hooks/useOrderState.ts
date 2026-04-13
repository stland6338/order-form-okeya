import { useState, useCallback } from "react";
import type { OrderState } from "../types";
import { STORAGE_KEY, MEMBERS, MAX_SETS_PER_ORDER } from "../data";

function loadOrder(): OrderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as OrderState;
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
        let qty = Math.max(0, quantity);

        // セットの場合: 最新のprevから合計を計算してクランプ
        if (isSetKey(productId)) {
          const currentQty = prev.members[memberId]?.[productId] ?? 0;
          const currentTotal = countTotalSets(prev);
          const increase = qty - currentQty;
          if (increase > 0) {
            const remaining = MAX_SETS_PER_ORDER - currentTotal;
            qty = currentQty + Math.min(increase, Math.max(0, remaining));
          }
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
        const next: OrderState = {
          ...prev,
          common: {
            ...prev.common,
            [productId]: Math.max(0, quantity),
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

  const resetOrder = useCallback(() => {
    const empty: OrderState = { members: {}, common: {} };
    saveOrder(empty);
    setOrder(empty);
  }, []);

  return {
    order,
    setQuantity,
    setCommonQuantity,
    getQuantity,
    getCommonQuantity,
    resetOrder,
  };
}
