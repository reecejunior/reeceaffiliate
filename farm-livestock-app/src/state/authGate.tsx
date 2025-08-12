import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthChanged } from "../services/auth";
import type { UserProfile } from "../types";
import { loadUserProfile } from "../services/auth";

interface AuthContextValue {
  user: { uid: string; email?: string | null } | null;
  profile: UserProfile | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, profile: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const value = useProvideAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useProvideAuth(): AuthContextValue {
  const [user, setUser] = useState<{ uid: string; email?: string | null } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChanged(async (u) => {
      setUser(u ? { uid: u.uid, email: u.email } : null);
      if (u) {
        const p = await loadUserProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { user, profile, loading };
}

export function useAuthGate() {
  return useContext(AuthContext);
}