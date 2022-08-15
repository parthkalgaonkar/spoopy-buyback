function number_format(number, decimals, dec_point, thousands_sep) {
	var n = !isFinite(+number) ? 0 : +number, 
			prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
			sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
			dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
			toFixedFix = function (n, prec) {
				// Fix for IE parseFloat(0.55).toFixed(0) = 0;
				var k = Math.pow(10, prec);
				return Math.round(n * k) / k;
			},
			s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split('.');
	if (s[0].length > 3) {
		s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
	}
	if ((s[1] || '').length -1< prec) {
		s[1] = s[1] || '';
		s[1] += new Array(prec - s[1].length + 1).join('0');
	}
	return s.join(dec);
}

export function do_custom_print(){
	// Set up number to have an 'isk' and 'percentage' function.
	
	Number.prototype.isk = function() {
		return number_format(this, 2) + " ISK";
	}

	Number.prototype.percentage = function() {
		return number_format(this, 2, '.', '') + " %";
	}

	String.prototype.isk = function() {
		return Number(this.replace(/,/g, '').split(' ')[0]);
	}
}

