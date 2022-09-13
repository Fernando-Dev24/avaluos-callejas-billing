/* data */
import { months } from '../data';

export const getMonthNumber = (monthInLetters) => {
   // DONE: Loop on every item from month to filter its name and get its id
   const [{ id }] = months.filter(({ value }) => value === monthInLetters);
   return id;
};