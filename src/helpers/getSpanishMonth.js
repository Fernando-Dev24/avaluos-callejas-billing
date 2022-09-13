import { months } from '../data';

export const getSpanishMonth = (monthInEnglish) => {
   if( monthInEnglish !== undefined ) {
      const [ { title } ] = months.filter(({ value }) => value === monthInEnglish);
      return title;
   };
};