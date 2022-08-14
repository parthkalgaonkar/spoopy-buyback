class deduction {
	calculate(item, base) {
		return 0;
	}
}

export class TaxDeduction {
	constructor () {
		this.base_rate = 0.15;
		this.custom = {};
	}

	calculate(item) {
		var typeid = item.typeid;
		var tax_rate = (this.custom.hasOwnProperty(typeid))?
				this.custom.typeid : this.base_rate;
		return tax_rate * item.base_price;
	}
}

export class HaulingDeduction {
	constructor () {
		this.rate_per_m3 = 385;
		this.max_rate = 0.25;
		this.custom = {
			4246: 0,
			4247: 0,
			4051: 0,
			4312: 0,
		};
	}

	calculate(item) {
		var typeid = item.typeid;
		var haul_rate = (this.custom.hasOwnProperty(typeid))?
				this.custom.typeid : this.rate_per_m3;
		return Math.min(haul_rate*item.volume, this.max_rate*item.base_price);
	}
}
