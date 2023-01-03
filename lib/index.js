//
// Imports
//
import isLocalIp from "is-local-ip";
/** A class for creating middlewares that only allow specific IPs to continue down the stack. */
export class AllowListMiddleware {
    /** Whether or not to block local requests unless they're on the allow list. */
    blockLocalRequests = false;
    /** A set of IP addresses that are allowed to continue. */
    ips = new Set();
    /** The middleware function. */
    execute;
    /**
     * Constructs a new AllowListMiddleware.
     *
     * @author Loren Goodwin
     */
    constructor(options) {
        this.blockLocalRequests = options.blockLocalRequests ?? this.blockLocalRequests;
        this.ips = new Set(options.ips);
        this.execute = async (context, next) => {
            //
            // Check Allowed IPs
            //
            let isAllowed = false;
            if (!this.blockLocalRequests && isLocalIp(context.ip)) {
                isAllowed = true;
            }
            else if (this.ips.has(context.ip)) {
                isAllowed = true;
            }
            if (!isAllowed) {
                console.log(`[AllowListMiddleware] Rejected request from ${context.ip}.`);
                context.status = 403;
                context.response.body = "You don't have permission to access this resource.";
                return;
            }
            await next();
        };
    }
}
