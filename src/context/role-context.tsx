"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "student" | "teacher" | "coordinator";

interface RoleContextValue {
  role: Role;
  setRole: (r: Role) => void;
}

const RoleContext = createContext<RoleContextValue | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<Role>("coordinator");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (window.localStorage.getItem("sd-role") as Role | null) : null;
    if (stored) setRole(stored);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("sd-role", role);
    }
  }, [role]);

  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
