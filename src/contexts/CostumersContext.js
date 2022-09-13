import React, { useState, useEffect, useContext } from 'react';
/* firebase */
import { db } from '../firebase/firebaseConfig';
import { onSnapshot,collection, query } from 'firebase/firestore';

/* Initialize the context */
const CostumerContext = React.createContext();

// Custom hook to use the data obtained from firebase
const useCostumers = () => useContext(CostumerContext);

// Provider
const CostumersProvider = ({ children }) => {
   /* states */
   const [costumers, setCostumers] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const killRequest = onSnapshot(query(
         collection(db, 'costumers'),
      ), (snapshot) => {
         setCostumers(snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id };
         }));
      });
      setLoading(false);
      return killRequest;
   }, []);

   return (
      <CostumerContext.Provider value={{
         costumers: costumers,
         setCostumers: setCostumers,
      }}>
         { !loading && children }
      </CostumerContext.Provider>
   );
};

export { CostumersProvider, useCostumers };