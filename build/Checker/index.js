"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Checker = void 0;
var axios_1 = __importDefault(require("axios"));
var globals_1 = require("../globals");
/**
 * Used to check importantTargets.
 * Remember that you need to call start and after was done you can use results.
 * Remember that axios requires http:// before URL else it returns `econnrefused` error
 */
var Checker = /** @class */ (function () {
    function Checker(options) {
        this.targets = [];
        this.dead = [];
        this.alive = [];
        this.dying = [];
        this.error = [];
        this.proxy = {
            ip: "23.108.47.124:80",
            auth: "ocelot:oempg4uvlf"
        };
        this.targets = options.targets;
    }
    /**
     * Alive importantTargets should be attacked
     */
    Checker.prototype.getAlive = function () {
        return this.alive;
    };
    /**
     * Dying importantTargets are not putted down completely, but it can be fixed
     */
    Checker.prototype.getDying = function () {
        return this.dying;
    };
    /**
     * Dead can be ignored for now, because server is not responsive(at list from current IP address)
     */
    Checker.prototype.getDead = function () {
        return this.dead;
    };
    /**
     * Something gone wrong
     */
    Checker.prototype.getError = function () {
        return this.error;
    };
    /**
     * Start checking all sites
     */
    Checker.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var promises;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promises = [];
                        this.targets.forEach(function (target) {
                            var promise = _this.checkTarget(target);
                            promise.then(function (status) {
                                switch (status) {
                                    case globals_1.TARGET_STATUSES.ALIVE:
                                        _this.alive.push(target);
                                        break;
                                    case globals_1.TARGET_STATUSES.DEAD:
                                        _this.dead.push(target);
                                        break;
                                    case globals_1.TARGET_STATUSES.DYING:
                                        _this.dying.push(target);
                                        break;
                                    case globals_1.TARGET_STATUSES.ERROR:
                                        _this.error.push(target);
                                        break;
                                }
                            }).catch(function (e) {
                                console.log('Request failed for target: ', target);
                            });
                            promises.push(promise);
                        });
                        return [4 /*yield*/, Promise.all(promises)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Checker.prototype.checkTarget = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var startTime, resultStatus, proxyAddressSplit, proxyIP, proxyPort, proxyAuthSplit, proxyUsername, proxyPassword, request, response, endTime, requestTime, requestStatus, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        startTime = (new Date()).valueOf();
                        resultStatus = globals_1.TARGET_STATUSES.ERROR;
                        proxyAddressSplit = this.proxy.ip.split(':');
                        proxyIP = proxyAddressSplit[0];
                        proxyPort = parseInt(proxyAddressSplit[1]);
                        proxyAuthSplit = this.proxy.auth.split(':');
                        proxyUsername = proxyAuthSplit[0];
                        proxyPassword = proxyAuthSplit[1];
                        request = (0, axios_1.default)({
                            url: url,
                            method: "get",
                            timeout: 10000,
                            validateStatus: function () { return true; },
                            proxy: {
                                host: proxyIP,
                                port: proxyPort,
                                auth: {
                                    username: proxyUsername,
                                    password: proxyPassword
                                }
                            }
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, request];
                    case 2:
                        response = _a.sent();
                        endTime = (new Date()).valueOf();
                        requestTime = endTime - startTime;
                        requestStatus = void 0;
                        if (requestTime <= globals_1.ALIVE_MAX_TIME)
                            requestStatus = globals_1.TARGET_STATUSES.ALIVE;
                        else if (requestTime <= globals_1.DYING_MAX_TIME)
                            requestStatus = globals_1.TARGET_STATUSES.DYING;
                        else
                            requestStatus = globals_1.TARGET_STATUSES.DEAD;
                        console.log("".concat(response.status, " | ").concat(requestTime, " ms | ").concat(requestStatus, " | ").concat(url));
                        resultStatus = requestStatus;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.log("ERR | ".concat(e_1.code, " | ").concat(url));
                        resultStatus = globals_1.TARGET_STATUSES.ERROR;
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/, resultStatus];
                }
            });
        });
    };
    return Checker;
}());
exports.Checker = Checker;
