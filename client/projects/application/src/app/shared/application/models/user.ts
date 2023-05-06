/**
 * User.
 */
export interface User {
    /**
     * ID.
     */
    readonly id: string;
    
    /**
     * Email.
     */
    readonly email: string;
    
    /**
     * Whether the user is admin.
     */
    readonly isAdmin: boolean;
}