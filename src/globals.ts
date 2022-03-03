
export enum TARGET_STATUSES {
	ALIVE,
	DEAD,
	DYING,
	ERROR,
};

/**
 * This is time in milliseconds. If response received under this time
 * then target is alive.
 */
export const ALIVE_MAX_TIME = 5000;

/**
 * If response time is under this limit but above 'alive', then target is dying
 */
export const DYING_MAX_TIME = 5000;
