# SPOOPY Buyback

This is the source code that powers the Spoopy Buyback website.
If you need any help, contact `Scarcrow Archer` in game or on Slack

# If you want to contribute

The following sections will help you guide you a little through the structure
of the repository. 

The website is built using Vuejs and TailwindCSS. It's deployed on a free
firebase hosting instance. At time of writing of this document the database of
tax rates, haul rates, whether to use Jita/Amarr value, everything is basically
downloaded by the user. This is not a big deal since the entire database fits 
within 1MB while the Spoopy Buyback image itself is 600kB.

While a particularly tech savvy Spoopster could modify the local copy of the
database and generate an appraisal amount higher than should be, Buyback 
operators would be able to easily identify such miscreants by just creating 
their own appraisal and matching the contract amount.

## Database Structure

All database is stored as JS objects and can be found in `./src/lib/`

## Data flow

All components interact through a singleton data store found in 
`./src/stores/Appraisal.js`. The store has the following attributes:

1. **eve_input**: Expected to be a string of text copied from EVE inventory
2. **app_data**: Appraisal as fetched from Janice
3. **extract**: Appraisal parsed into special local format. Selection between Jita
   and Amarr price is done before this.
4. **compute**: Spoopy specific tax rates, fixed price etc applied and stored.
	 This  is what is displayed in list form on the site.
5. **summary**: Final calculation of total amount and effective buyback %

### 1. Input data is fetched from the textbox

Textbox and submit/clear buttons are part of `./src/components/AppraisaInput.vue`
component. When submit is pressed with non-empty text field, the value from the
text field is stored to `Appraisal.eve_input`. 

Clear button sets `Appraisal.eve_input` to `undefined`

### 2. Appraisals are fetched from Janice

This step is performed in `./src/components/AppraisalFetch.vue`. This is an
empty component, as in, it does not have any HTML just JS code to fetch the 
Appraisal JSON.

This component watches for any change in `Appraisal.eve_input`. Whenever any
change is detected, a callback is triggered which does the following:

1. Creates two HTTP Post requests based on Janice API. One each for Jita/Amarr.
2. Sends these requests and waits for a response.
3. HTTP request could fail in case of network issues or Janice being down. 
   Conveys such error to the user via the Alert System
4. Even if HTTP request succeeds, the input may be bad which would cause Janice
	 to respond with some HTTP error code. Conveys to user using the Alert System
5. If everything goes smoothly, parses both responses from JSON to an Object.
	 This step has potential to fail. If it does, Alerts the user.
6. If JSON parse succeeds, stores both responses in `Appraisal.app_data`

Note: All the above steps are only taken if `Appraisal.eve_input` is defined
and non-empty

### 3. Combines the two responses.

This step is performed in `./src/components/AppraisalJanice.vue`. Just like
`AppraisalFetch` this is also an empty component. It runs completely in the
background. The component watches for changes in `Appraisal.app_data` and
takes the following actions if the new value is not `undefined`

The data containing the mapping between item and Jita/Amarr is stored in
`./src/lib/market_lists.js` in the form of two lists, namely, `jita_list` and
`amarr_list`. Both of these are simply a list of TYPE\_IDS of items that
should use that respective market price as the base price.

For items that have a fixed price (such as Blue/Red loot), the base price is
taken from Jita. This price will not be used in final calculation. It's simply
for display purposes.

There may be some items which are in neither of the two lists. For such items,
a base price of `0` is assumed. As in buyback will not pay anything for them.
Additionally, no item shall be present in both lists. But if it is, Amarr price
will be used simply due to the way the code is structured. 

This step also condenses the Janice response down to only what is needed by the
subsequent steps. This also serves as a way to Abstract away the Janice API
so the code is easier to maintain if the API changes at some point in the
future or we decide to move to some other appraisal tool

The final abstracted out format of data is stored in `Appraisal.extract`

#### Note about Fuel blocks:

While all other items are priced based on their Jita/Amarr Buy value, an
exception is made for Fuel Blocks which are priced based on the Jita Sell
price due to their extremely high value to Corp. These typeids are stored in
`jita_sell_list` in `./src/lib/market_lists.js`. There is no reason to limit
only to fuel blocks, other items can be added to the `jita_sell_list` as and
when required.

### 4. Calculation of Buyback rates

This step is performed in `./src/components/AppraisalCompute.vue`. Just like
`AppraisalFetch` this is also an empty component. It runs completely in the
background. The component watches for changes in `Appraisal.extract` and takes
the following actions if the new value is not `undefined`

For each item in the `Appraisal.extract` takes the following steps to calculate
buyback rate:

1. Applies a percentage tax based deduction with the market price as base.
   In `./src/lib/deductions.js` tax data is stored as a `TaxDeduction` class.
	 This class has a field called `custom` which is a Map between TypeIDs and 
	 tax rates. If a particular TypeID is not one of the keys of this map, a 
	 default value is used (15% at time of writing this doc).
2. Applies a hauling deduction based on the volume of the object. This  data is
   structured in much the same way as `TaxDeduction` and is stored as 
	 `HaulingDeduction` in `./src/lib/deductions.js`. At the time of writing this
	 document, the default deduction is 385isk/m<sup>3</sup> capped at a max of
	 25% market value.
3. If the item has a fixed rate set in `./src/lib/flat_rates.js`, overwrites 
	 the value calculated in `1` and `2` above with the given rate.
4. Computes the net percentage rate of buyback for item.
