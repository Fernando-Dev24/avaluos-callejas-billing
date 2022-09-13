import React, { useState, useEffect, useContext } from 'react';
/* firebase */
import { db } from '../firebase/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

/* Initialize context */
const IncomesContext = React.createContext();

/* custom incomes hook */
const useIncomes = () => useContext(IncomesContext);

/* Incomes Provider */
const IncomesProvider = ({ children, date, setRegisterBills }) => {
   /* props */
   const { year, month, day } = date;

   /* states */
   const [bills, setBills] = useState([]);
   const [loading, setLoading] = useState(true);

   /* handleGetData */
   const handleGetData = async () => {

   };
};