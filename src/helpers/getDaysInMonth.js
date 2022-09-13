export const getDaysInMonth = (targetDate) => {
   /* desestructuring targetDate */
   const { year, monthNumber } = targetDate;
   let daysCounter = new Date(year, monthNumber, 0).getDate();

   // Now, we need to return the number of days in an array to render later
   let days = [];
   for( let index = 1; index <= daysCounter; index++ ) {
      days = [...days, index];
   };
   
   return days;
};