"use client"
import { UsefulProvider } from "./contexts/usefulContext";

export function Providers({ children }) {
  return <UsefulProvider>{children}</UsefulProvider>;
}
