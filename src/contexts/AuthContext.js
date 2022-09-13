import React, { useState, useEffect, useContext } from 'react';
/* firebase */
import { auth } from '../firebase/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

/* Initialize Context */
const AuthContext = React.createContext();

/* useAuth */
const useAuth = () => useContext(AuthContext);

// Provider
const AuthProvider = ({ children }) => {
   /* states */
   const [user, setUser] = useState({});
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const killEffect = onAuthStateChanged(auth, (user) => {
         setUser(user);
         setLoading(false);
      });
      return killEffect;
   }, []);

   return (
      <AuthContext.Provider value={{ user: user }}>
         { !loading && children }
      </AuthContext.Provider>
   );
};

export { useAuth, AuthProvider };