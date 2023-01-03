import { Middleware } from "koa";
export interface AllowListMiddlewareOptions {
    /** Whether or not to block requests from local addresses that aren't on the allow list. Optional, defaults to false. */
    blockLocalRequests: Boolean;
    /** An array of IP addresses to allow. Optional, technically, but you should specify at least one... */
    ips: String[];
}
/** A class for creating middlewares that only allow specific IPs to continue down the stack. */
export declare class AllowListMiddleware {
    /** Whether or not to block local requests unless they're on the allow list. */
    blockLocalRequests: Boolean;
    /** A set of IP addresses that are allowed to continue. */
    ips: Set<String>;
    /** The middleware function. */
    execute: Middleware;
    /**
     * Constructs a new AllowListMiddleware.
     *
     * @author Loren Goodwin
     */
    constructor(options: AllowListMiddlewareOptions);
}
