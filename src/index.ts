//
// Imports
//

import isLocalIp from "is-local-ip";
import { Middleware } from "koa";

//
// Allow List Middleware
//

export interface AllowListMiddlewareOptions
{
	/** Whether or not to block requests from local addresses that aren't on the allow list. Optional, defaults to false. */
	blockLocalRequests? : boolean;

	/** An array of IP addresses to allow. Optional, technically, but you should specify at least one... */
	ips? : string[];
}

/** A class for creating middlewares that only allow specific IPs to continue down the stack. */
export class AllowListMiddleware
{
	/** The original options passed to this middleware. */
	readonly options : AllowListMiddlewareOptions;

	/** A set of IP addresses that are allowed to continue. */
	ips : Set<string> = new Set();

	/** The middleware function. */
	readonly execute : Middleware;

	/**
	 * Constructs a new AllowListMiddleware.
	 *
	 * @author Loren Goodwin
	 */
	constructor(options : AllowListMiddlewareOptions)
	{
		//
		// Default Options
		//

		this.options = options ?? {};

		this.options.blockLocalRequests ??= false;

		this.options.ips ??= [];

		//
		// Create IPs Set
		//

		this.ips = new Set(this.options.ips);

		//
		// Create Execute Function
		//

		this.execute = async (context, next) =>
		{
			//
			// Check Allowed IPs
			//

			let isAllowed = false;

			if (!this.options.blockLocalRequests && isLocalIp(context.ip))
			{
				isAllowed = true;
			}
			else if (this.ips.has(context.ip))
			{
				isAllowed = true;
			}

			if (!isAllowed)
			{
				console.log(`[AllowListMiddleware] Rejected request from ${ context.ip }.`);

				context.status = 403;
				context.response.body = "You don't have permission to access this resource.";

				return;
			}

			//
			// Execute Next Middleware
			//

			await next();
		};
	}
}