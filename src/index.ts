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
	blockLocalRequests : boolean;

	/** An array of IP addresses to allow. Optional, technically, but you should specify at least one... */
	ips : string[];
}

/** A class for creating middlewares that only allow specific IPs to continue down the stack. */
export class AllowListMiddleware
{
	/** Whether or not to block local requests unless they're on the allow list. */
	blockLocalRequests = false;

	/** A set of IP addresses that are allowed to continue. */
	ips : Set<string> = new Set();

	/** The middleware function. */
	execute : Middleware;

	/**
	 * Constructs a new AllowListMiddleware.
	 *
	 * @author Loren Goodwin
	 */
	constructor(options : AllowListMiddlewareOptions)
	{
		this.blockLocalRequests = options.blockLocalRequests ?? this.blockLocalRequests;

		this.ips = new Set(options.ips);

		this.execute = async (context, next) =>
		{
			//
			// Check Allowed IPs
			//

			let isAllowed = false;

			if (!this.blockLocalRequests && isLocalIp(context.ip))
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

			await next();
		};
	}
}