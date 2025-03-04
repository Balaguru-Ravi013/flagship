# FSI18n

Internationalization helper for Flagship. Automatically reads the user's current locale and uses it
to format numbers, dates, and strings.

Uses [react-native-i18n](https://github.com/AlexanderZaytsev/react-native-i18n)/[i18n-js](https://github.com/fnando/i18n-js)
for strings, [Number.prototype.toLocaleString](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)
for numbers, and [Date.prototype.toLocaleString](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)
under the hood.

## Installation

```sh
yarn add @brandingbrand/fsi18n
yarn add react-native-i18n
```

The `react-native-i18n` package must be added to your project as a dependency so the native modules
will link correctly.

## Example Usage

Assume the user's language preference is set to French (fr-FR).

```js
import FSI18n from '@brandingbrand/fsi18n';
const translations = {
  en: {
    greeting: 'Hello',
  },
  fr: {
    greeting: 'Bonjour',
  },
  es: {
    greeting: 'Hola',
  },
};

FSI18n.addTranslations(translations);
FSI18n.string('greeting'); // Bonjour
```

```js
import FSI18n from '@brandingbrand/fsi18n';
FSI18n.number(1234.56); // 1 234,56
```

```js
import FSI18n from '@brandingbrand/fsi18n';
FSI18n.currency(1234.56, 'EUR'); // 1 234,56 €
FSI18n.currency(1234.56, undefined, {
  currency: 'USD',
  currencyDisplay: 'code',
}); // 1 234,56 USD
```

```js
import FSI18n from '@brandingbrand/fsi18n';
FSI18n.percent(0.123456); // 12 %
```

```js
import FSI18n from '@brandingbrand/fsi18n';
const importantDate = new Date('Nov 1, 2018');
FSI18n.date(importantDate); // 01/11/2018
```

### Currency Override

Some clients might want Australian dollars to display as "A$ 19.99" instead of the default "AUD
19.99"

To get this to work you need represent each currency you want to override as a key value pair with
the key being a three character ISO-4217 currency code and the value being the desired symbol.

IOS-4217 standard: <https://www.iso.org/iso-4217-currency-codes.html>

Here is an example of using the `addCurrencyOverrides()`

```ts
import FSI18n, { MappedCurrencySymbols } from '@brandingbrand/fsi18n';

const currencyOverrides: MappedCurrencySymbols = {
  AUD: 'A$',
  USD: 'US$',
};

FSI18n.addCurrencyOverrides(currencyOverrides);
```
