import React, { useState, useEffect, useContext } from 'react';
/* firebase */
import { db } from '../firebase/firebaseConfig';
import { collection, onSnapshot, query } from 'firebase/firestore';
/* hooks */
import { useNavigate } from 'react-router-dom';
/* helpers */
import { getSpanishMonth } from '../helpers/getSpanishMonth';
import { v4 as uuidv4 } from 'uuid';

/* Initialize the contex */
const MonthContext = React.createContext();

// Custom hook to manage its response from firebase
const useMonthRegisters = () => useContext(MonthContext);

// Provider
const MonthRegistersProvider = ({ children, date, setAlertState, setAlertContent }) => {
   /* hooks */
   const navigate = useNavigate();
   
   /* props */
   const { year, month } = date;
   
   /* states */
   const [registers, setRegisters] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      onSnapshot(query(
         collection(db, `billing/${ year }/${ month }`),
      ), (snapshot) => {
         if( !snapshot.empty ) {
            setRegisters(snapshot.docs.map((doc) => {
               return {
                  ...doc.data(),
                  day: `${ doc.id } de ${ getSpanishMonth(month) }, ${ year }`,
                  id: uuidv4(),
               };
            }));
            setLoading(false);
         } else {
            setAlertState(true);
            setAlertContent({
               type: 'error',
               message: `No existen registros de ${ getSpanishMonth(month) }, ${ year }`,
            });
            navigate('/', { replace: true });
         };
      });
   }, []);

   return (
      <MonthContext.Provider value={{ data: registers }}>
         { !loading && children }
      </MonthContext.Provider>
   );
};

export { useMonthRegisters, MonthRegistersProvider };