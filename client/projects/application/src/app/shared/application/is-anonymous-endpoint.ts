import { HttpContextToken } from "@angular/common/http";

export const IS_ANONYMOUS_ENDPOINT = new HttpContextToken<boolean>(() => false);