"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DYING_MAX_TIME = exports.ALIVE_MAX_TIME = exports.TARGET_STATUSES = void 0;
var TARGET_STATUSES;
(function (TARGET_STATUSES) {
    TARGET_STATUSES[TARGET_STATUSES["ALIVE"] = 0] = "ALIVE";
    TARGET_STATUSES[TARGET_STATUSES["DEAD"] = 1] = "DEAD";
    TARGET_STATUSES[TARGET_STATUSES["DYING"] = 2] = "DYING";
    TARGET_STATUSES[TARGET_STATUSES["ERROR"] = 3] = "ERROR";
})(TARGET_STATUSES = exports.TARGET_STATUSES || (exports.TARGET_STATUSES = {}));
;
/**
 * This is time in milliseconds. If response received under this time
 * then target is alive.
 */
exports.ALIVE_MAX_TIME = 5000;
/**
 * If response time is under this limit but above 'alive', then target is dying
 */
exports.DYING_MAX_TIME = 5000;
