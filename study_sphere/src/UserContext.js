import React, { createContext, useContext, useState } from 'react';

/**
 * UserContext for storing and providing username across the app.
 */
const UserContext = createContext(null);

// PUBLIC_INTERFACE
export function useUser() {
  /** Hook to access user context (username and setter). */
  return useContext(UserContext);
}

// PUBLIC_INTERFACE
export function UserProvider({ children }) {
  /** Provides username context to the component tree. */
  const [username, setUsername] = useState('');
  return (
    <UserContext.Provider value={{ username, setUsername }}>
      {children}
    </UserContext.Provider>
  );
}
