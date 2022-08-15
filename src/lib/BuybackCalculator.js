export class BuybackCalculator {
	constructor() {
		this.deduction_list = [];
	}

	add_deduction(deduction) {
		this.deduction_list.push(deduction);
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
		return buy_price;
	}
}
