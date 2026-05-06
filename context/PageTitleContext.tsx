"use client";
import { createContext, useContext, useState, useEffect } from "react";

interface PageTitleCtx { title: string; setTitle: (t: string) => void; }
const Ctx = createContext<PageTitleCtx>({ title: "ePermits", setTitle: () => {} });

export function PageTitleProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState("ePermits");
  return <Ctx.Provider value={{ title, setTitle }}>{children}</Ctx.Provider>;
}

export function usePageTitle(title: string) {
  const { setTitle } = useContext(Ctx);
  useEffect(() => { setTitle(title); }, [title]);
}

export function useCurrentTitle() {
  return useContext(Ctx).title;
}
