import { useState } from 'react';

export const useForm = (formValues = {}) => {
   /* states */
   const [values, setValues] = useState(formValues);

   /* handleSetValues */
   const handleSetValues = ({ target }) => {
      setValues({
         ...values,
         [target.name]: target.value
      });
   };

   const resetValues = (initialValues) => {
      setValues(initialValues);
   };

   return [values, handleSetValues, resetValues];
};