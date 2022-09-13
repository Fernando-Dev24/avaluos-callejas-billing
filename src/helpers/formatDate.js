/* helpers */
import { fromUnixTime, getUnixTime, format } from "date-fns";

export const formatDate = (date = getUnixTime(new Date())) => {
   return format(fromUnixTime(date), 'dd/MM/yyyy');
};