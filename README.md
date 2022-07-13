# Koa Allow List
A class for creating Koa middlewares that reject requests that aren't on the allow list.

**Note:** Requests from a local IP address are not blocked by default. This is acheived by using the [is-local-ip](https://www.npmjs.com/package/is-local-ip) package.

## Installation
Install the package with NPM:

```
npm install @donutteam/koa-allow-list
```

## Usage
To use this class, simply instantiate an instance and add it to your Koa stack:

```js
import Koa from "koa";

import { AllowListMiddleware } from "@donutteam/koa-allow-list";

const app = new Koa();

const allowListMiddleware = new AllowListMiddleware(
	{
		ips:
		[
			"142.250.72.110",
		],
	});

// Be sure to add the execute function on the instance
// and NOT the instance itself
app.use(allowListMiddleware.execute);
```

## Options
An object containing various options can be passed to the middleware's constructor.

These options can also be manually modified on the instance afterwards, if you need to do so for some reason.

### blockLocalRequests
Whether or not local IP addresses are blocked (unless they're on the allow list). Optional, defaults to false.

```js
const allowListMiddleware = new AllowListMiddleware(
	{
		blockLocalRequests: true,
		ips:
		[
			"142.250.72.110", // Now can ONLY be accessed from this IP
		],
	});
```

### ips
An array of IP addresses that will be allowed to continue down the middleware stack. Optional, technically, but you should probably specify at least one...

```js
const allowListMiddleware = new AllowListMiddleware(
	{
		ips:
		[
			"142.250.72.110",
		],
	});
```

## License
[MIT](https://github.com/donutteam/koa-allow-list/blob/main/LICENSE.md)