import { HttpContextToken } from "@angular/common/http";

/**
 * Specifies whether a request needs an authorization.
 */
export const IS_ANONYMOUS_ENDPOINT = new HttpContextToken<boolean>(() => false);