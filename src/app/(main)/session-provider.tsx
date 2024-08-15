"use client";

import { Session, User } from 'lucia';
import { createContext, PropsWithChildren, useContext } from 'react';

type SessionContextType = {
  user: User;
  session: Session;
};

const SessionContext = createContext<SessionContextType | null>(null);

export default function SessionProvider({
  children,
  value,
}: PropsWithChildren<{ value: SessionContextType }>) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export const useSession = () => {
  const context = useContext(SessionContext);

  if (context === null) {
    throw new Error("useSession must be used within a SessionProvider");
  }

  return context;
};
