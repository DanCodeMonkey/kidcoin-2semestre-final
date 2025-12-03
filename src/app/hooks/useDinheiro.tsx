"use client";

import { useState, useCallback } from "react";

const LS_KEY = "kidcoin.dinheiro";
const DEFAULT_DINHEIRO = 9000; // valor inicial do aluno

type Updater = (prev: number) => number;
type SetDinheiroArg = number | Updater;

export default function useDinheiro(defaultValue = DEFAULT_DINHEIRO) {
  // Lazy init: tenta ler do localStorage na primeira render
  const [dinheiro, setDinheiroState] = useState<number>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const saved = localStorage.getItem(LS_KEY);
      if (saved === null) return defaultValue;
      const parsed = Number(saved);
      return Number.isFinite(parsed) ? parsed : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  // helper para persistir (centralizado)
  const persist = useCallback((value: number) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(LS_KEY, String(value));
    } catch {
      // falhas de storage (ex: quota) são ignoradas silenciosamente
    }
  }, []);

  // setDinheiro aceita number ou updater function para evitar problemas de stale state
  const setDinheiro = useCallback((value: SetDinheiroArg) => {
    setDinheiroState((prev) => {
      const next = typeof value === "function" ? (value as Updater)(prev) : value;
      // garante número válido
      const normalized = Number.isFinite(Number(next)) ? Number(next) : prev;
      persist(normalized);
      return normalized;
    });
  }, [persist]);

  // gastar: retorna true se operacao sucedeu, false se saldo insuficiente
  const gastar = useCallback((valor: number): boolean => {
    if (!Number.isFinite(valor) || valor <= 0) return false;
    let success = false;
    setDinheiroState((prev) => {
      if (valor <= prev) {
        const next = prev - valor;
        persist(next);
        success = true;
        return next;
      }
      // sem alteração se insuficiente
      success = false;
      return prev;
    });
    return success;
  }, [persist]);

  // adicionar: soma ao saldo (valor positivo)
  const adicionar = useCallback((valor: number) => {
    if (!Number.isFinite(valor) || valor === 0) return;
    setDinheiroState((prev) => {
      const next = prev + valor;
      persist(next);
      return next;
    });
  }, [persist]);

  // resetar para valor padrão (consistente no storage)
  const resetar = useCallback((toValue: number = defaultValue) => {
    const normalized = Number.isFinite(toValue) ? toValue : defaultValue;
    setDinheiroState(normalized);
    persist(normalized);
  }, [defaultValue, persist]);

  // formato legível (pt-BR, BRL)
  const dinheiroFormatado = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(dinheiro);

  return {
    dinheiro,
    dinheiroFormatado,
    setDinheiro,
    gastar,
    adicionar,
    resetar,
  };
}
