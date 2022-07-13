//
// Imports
//

import isLocalIp from "is-local-ip";

//
// Allow List Middleware
//

/**
 * A class for creating middlewares that only allow specific IPs to continue down the stack.
 */
export class AllowListMiddleware
{
	/**
	 * Whether or not to block local requests unless they're on the allow list.
	 * 
	 * @type {Boolean}
	 */
	blockLocalRequests = false;

	/**
	 * A set of IP addresses that are allowed to continue.
	 *
	 * @type {Array<String>}
	 */
	ips = [];

	/**
	 * The middleware function.
	 * 
	 * @type {import("koa").Middleware}
	 */
	execute;

	/**
	 * Constructs a new AllowListMiddleware.
	 *
	 * @param {Object} [options] Options for the middleware.
	 * @param {Boolean} [options.blockLocalRequests] Whether or not to block requests from local addresses that aren't on the allow list. Optional, defaults to false.
	 * @param {Array<String>} [options.ips] An array of IP addresses to allow. Optional, technically, but you should specify at least one...
	 * @author Loren Goodwin
	 */
	constructor()
	{
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
			else if (this.ips.indexOf(context.ip) != -1)
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