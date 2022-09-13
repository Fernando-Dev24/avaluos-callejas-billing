import React, { useState, useEffect, useContext } from 'react';
/* firebase */
import { db } from '../firebase/firebaseConfig';
import { onSnapshot, collection } from 'firebase/firestore';

/* Initialize app */
const YearContext = React.createContext();

// useYear
const useYear = () => useContext(YearContext);

// Provider
const YearProvider = ({ children }) => {
   /* states */
   const [years, setYears] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      const killEffect = onSnapshot(collection(db, 'billing'), (snapshot) => {
         setYears(snapshot.docs.map((doc) => {
            return { ...doc, id: doc.id, yearData: doc.data() };
         }));
      });
      setLoading(false);
      return killEffect;
   }, []);

   return (
      <YearContext.Provider value={{ years: years }}>
         { !loading && children }
      </YearContext.Provider>
   );
};

export { useYear, YearProvider };