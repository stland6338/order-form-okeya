import { useState, useCallback } from "react";
import type { OrderState } from "../types";
import { STORAGE_KEY } from "../data";

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

export function useOrderState() {
  const [order, setOrder] = useState<OrderState>(loadOrder);

  const setQuantity = useCallback(
    (memberId: string, productId: string, quantity: number) => {
      setOrder((prev) => {
        const next: OrderState = {
          ...prev,
          members: {
            ...prev.members,
            [memberId]: {
              ...prev.members[memberId],
              [productId]: Math.max(0, quantity),
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
