export class BuybackCalculator {
	constructor() {
		this.deduction_list = [];
		this.flat_list = [];
	}

	add_deduction(deduction) {
		this.deduction_list.push(deduction);
	}

	add_flat_rate(flat_rate) {
		this.flat_list.push(flat_rate);
	}

	base_price(item) {
		var retval = null;
		for (var flat of this.flat_list) {
			var rate = flat.calculate(item);
			if (rate !== null) retval = rate;
		}
		return retval;
	}

	calculate_deductions(item) {
		var retval = 0;
		var base_price = item.base_price;
		for (var deduction of this.deduction_list) {
			retval += deduction.calculate(item);
		}
		return Math.min(retval, base_price);
	}

	buyback_rate(item) {
		var base_price = item.base_price;
		var buy_price = base_price - this.calculate_deductions(item);
		var flat_rate = this.base_price(item);
		if (flat_rate !== null) {
			console.log(flat_rate);
			buy_price = flat_rate;
		}
		return buy_price;
	}
}
