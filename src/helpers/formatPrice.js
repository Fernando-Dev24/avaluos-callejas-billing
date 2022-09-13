/* helpers */
import numbro from "numbro";

const formatPrice = (price) => {
   return numbro(price).formatCurrency({ mantissa: 2, thousandSeparated: true });
};

const formatNumber = (num) => {
   return numbro(num).format({ mantissa: 2 });
}

export { formatPrice, formatNumber };