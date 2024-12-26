var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
define("evil-type.ts/common/evil-type", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EvilType = void 0;
    // Original: https://github.com/wraith13/evil-type.ts/blob/master/common/evil-type.ts
    // License: BSL-1.0 ( https://github.com/wraith13/evil-type.ts/blob/master/LICENSE_1_0.txt )
    var EvilType;
    (function (EvilType) {
        EvilType.comparer = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return function (a, b) {
                for (var i = 0; i < args.length; ++i) {
                    var focus_1 = args[i];
                    var af = focus_1(a);
                    var bf = focus_1(b);
                    if (af < bf) {
                        return -1;
                    }
                    if (bf < af) {
                        return 1;
                    }
                }
                return 0;
            };
        };
        EvilType.lazy = function (invoker) {
            return (function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return invoker().apply(void 0, args);
            });
        };
        var Error;
        (function (Error) {
            Error.makeListener = function (path) {
                if (path === void 0) { path = ""; }
                return ({
                    path: path,
                    matchRate: {},
                    errors: [],
                });
            };
            Error.nextListener = function (name, listner) {
                return (listner ?
                    {
                        path: Error.makePath(listner.path, name),
                        matchRate: listner.matchRate,
                        errors: listner.errors,
                    } :
                    undefined);
            };
            Error.makePath = function (path, name) {
                var base = path.includes("#") ? path : "".concat(path, "#");
                var separator = base.endsWith("#") || "string" !== typeof name ? "" : ".";
                var tail = "string" === typeof name ? name : "[".concat(name, "]");
                return base + separator + tail;
            };
            Error.getPathDepth = function (path) {
                var valuePath = path.replace(/[^#]*#/, "#").replace(/\[(\d+)\]/g, ".$1");
                return valuePath.split(/[#\.]/).filter(function (i) { return 0 < i.length; }).length;
            };
            Error.getType = function (isType) {
                var transactionListner = Error.makeListener();
                isType(undefined, transactionListner);
                return transactionListner.errors
                    .map(function (i) { return i.requiredType.split(" | "); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Error.isMtached = function (matchRate) { return true === matchRate; };
            Error.matchRateToNumber = function (matchRate) {
                switch (matchRate) {
                    case false:
                        return 0;
                    case true:
                        return 1;
                    default:
                        return matchRate;
                }
            };
            Error.setMatchRate = function (listner, matchRate) {
                if (listner) {
                    listner.matchRate[listner.path] = matchRate;
                }
                return Error.isMtached(matchRate);
            };
            Error.getMatchRate = function (listner, path) {
                if (path === void 0) { path = listner.path; }
                if (path in listner.matchRate) {
                    return listner.matchRate[path];
                }
                return Error.calculateMatchRate(listner, path);
            };
            Error.calculateMatchRate = function (listner, path) {
                if (path === void 0) { path = listner.path; }
                var depth = Error.getPathDepth(path);
                var childrenKeys = Object.keys(listner.matchRate)
                    .filter(function (i) { return 0 === i.indexOf(path) && Error.getPathDepth(i) === depth + 1; });
                var length = childrenKeys.length;
                var sum = childrenKeys
                    .map(function (i) { return listner.matchRate[i]; })
                    .map(function (i) { return Error.matchRateToNumber(i); })
                    .reduce(function (a, b) { return a + b; }, 0.0);
                var result = 0 < length ? sum / length : true;
                if (true === result || 1.0 <= result) {
                    console.error("🦋 FIXME: \"MatchWithErrors\": " + JSON.stringify({ sum: sum, length: length, result: result, listner: listner }));
                }
                return listner.matchRate[path] = result;
            };
            Error.setMatch = function (listner) {
                if (listner) {
                    var paths = Object.keys(listner.matchRate)
                        .filter(function (path) { return 0 === path.indexOf(listner.path); });
                    if (paths.every(function (path) { return Error.isMtached(listner.matchRate[path]); })) {
                        paths.forEach(function (path) { return delete listner.matchRate[path]; });
                    }
                }
                Error.setMatchRate(listner, true);
            };
            Error.raiseError = function (listner, requiredType, actualValue) {
                if (listner) {
                    Error.setMatchRate(listner, false);
                    listner.errors.push({
                        type: "solid",
                        path: listner.path,
                        requiredType: "string" === typeof requiredType ? requiredType : requiredType(),
                        actualValue: Error.valueToString(actualValue),
                    });
                }
                return false;
            };
            Error.orErros = function (listner, modulus, errors, fullErrors) {
                var _a;
                var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
                (_a = listner.errors).push.apply(_a, paths.map(function (path) {
                    return ({
                        type: modulus <= fullErrors.filter(function (i) { return "solid" === i.type && i.path === path; }).length ?
                            "solid" :
                            "fragment",
                        path: path,
                        requiredType: errors
                            .filter(function (i) { return i.path === path; })
                            .map(function (i) { return i.requiredType; })
                            .map(function (i) { return i.split(" | "); })
                            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                            .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                            .join(" | "),
                        actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
                    });
                }));
            };
            Error.andErros = function (listner, errors) {
                var _a;
                var paths = errors.map(function (i) { return i.path; }).filter(function (i, ix, list) { return ix === list.indexOf(i); });
                (_a = listner.errors).push.apply(_a, paths.map(function (path) {
                    return ({
                        type: errors.some(function (i) { return "solid" === i.type && i.path === path; }) ?
                            "solid" :
                            "fragment",
                        path: path,
                        requiredType: errors
                            .filter(function (i) { return i.path === path; })
                            .map(function (i) { return i.requiredType; })
                            .map(function (i) { return i.split(" & "); })
                            .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                            .filter(function (i, ix, list) { return ix === list.indexOf(i); })
                            .join(" & "),
                        actualValue: errors.filter(function (i) { return i.path === path; }).map(function (i) { return i.actualValue; })[0],
                    });
                }));
            };
            Error.valueToString = function (value) {
                return undefined === value ? "undefined" : JSON.stringify(value);
            };
            Error.withErrorHandling = function (isMatchType, listner, requiredType, actualValue) {
                if (listner) {
                    if (isMatchType) {
                        Error.setMatch(listner);
                    }
                    else {
                        Error.raiseError(listner, requiredType, actualValue);
                    }
                }
                return isMatchType;
            };
        })(Error = EvilType.Error || (EvilType.Error = {}));
        var Validator;
        (function (Validator) {
            Validator.makeErrorListener = Error.makeListener;
            Validator.isJust = function (target) { return null !== target && "object" === typeof target ?
                function (value, listner) {
                    return Error.withErrorHandling(JSON.stringify(target) === JSON.stringify(value), listner, function () { return Error.valueToString(target); }, value);
                } :
                function (value, listner) {
                    return Error.withErrorHandling(target === value, listner, function () { return Error.valueToString(target); }, value);
                }; };
            Validator.isNever = function (value, listner) {
                return Error.withErrorHandling(false, listner, "never", value);
            };
            Validator.isUndefined = Validator.isJust(undefined);
            Validator.isUnknown = function (_value, _listner) { return true; };
            Validator.isAny = function (_value, _listner) { return true; };
            Validator.isNull = Validator.isJust(null);
            Validator.isBoolean = function (value, listner) {
                return Error.withErrorHandling("boolean" === typeof value, listner, "boolean", value);
            };
            Validator.isInteger = function (value, listner) {
                return Error.withErrorHandling(Number.isInteger(value), listner, "integer", value);
            };
            Validator.isSafeInteger = function (value, listner) {
                return Error.withErrorHandling(Number.isSafeInteger(value), listner, "safe-integer", value);
            };
            Validator.isDetailedInteger = function (data, safeInteger) {
                var base = "safe" === safeInteger ? Validator.isSafeInteger : Validator.isInteger;
                if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                    return base;
                }
                else {
                    var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                        (undefined === data.minimum || data.minimum <= value) &&
                        (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                        (undefined === data.maximum || value <= data.maximum) &&
                        (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                        (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                        var details = [];
                        if (undefined !== data.minimum) {
                            details.push("minimum:".concat(data.minimum));
                        }
                        if (undefined !== data.exclusiveMinimum) {
                            details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                        }
                        if (undefined !== data.maximum) {
                            details.push("maximum:".concat(data.maximum));
                        }
                        if (undefined !== data.exclusiveMaximum) {
                            details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                        }
                        if (undefined !== data.multipleOf) {
                            details.push("multipleOf:".concat(data.multipleOf));
                        }
                        return "".concat("safe" === safeInteger ? "safe-integer" : "integer", "(").concat(details.join(","), ")");
                    }, value); };
                    return result;
                }
            };
            Validator.isNumber = function (value, listner) {
                return Error.withErrorHandling("number" === typeof value, listner, "number", value);
            };
            Validator.isSafeNumber = function (value, listner) {
                return Error.withErrorHandling(Number.isFinite(value), listner, "safe-number", value);
            };
            Validator.isDetailedNumber = function (data, safeNumber) {
                var base = "safe" === safeNumber ? Validator.isSafeNumber : Validator.isNumber;
                if ([data.minimum, data.exclusiveMinimum, data.maximum, data.exclusiveMaximum, data.multipleOf].every(function (i) { return undefined === i; })) {
                    return base;
                }
                else {
                    var result = function (value, listner) { return Error.withErrorHandling(base(value) &&
                        (undefined === data.minimum || data.minimum <= value) &&
                        (undefined === data.exclusiveMinimum || data.exclusiveMinimum < value) &&
                        (undefined === data.maximum || value <= data.maximum) &&
                        (undefined === data.exclusiveMaximum || value < data.exclusiveMaximum) &&
                        (undefined === data.multipleOf || 0 === value % data.multipleOf), listner, function () {
                        var details = [];
                        if (undefined !== data.minimum) {
                            details.push("minimum:".concat(data.minimum));
                        }
                        if (undefined !== data.exclusiveMinimum) {
                            details.push("exclusiveMinimum:".concat(data.exclusiveMinimum));
                        }
                        if (undefined !== data.maximum) {
                            details.push("maximum:".concat(data.maximum));
                        }
                        if (undefined !== data.exclusiveMaximum) {
                            details.push("exclusiveMaximum:".concat(data.exclusiveMaximum));
                        }
                        if (undefined !== data.multipleOf) {
                            details.push("multipleOf:".concat(data.multipleOf));
                        }
                        return "".concat("safe" === safeNumber ? "safe-number" : "number", "(").concat(details.join(","), ")");
                    }, value); };
                    return result;
                }
            };
            Validator.isString = function (value, listner) {
                return Error.withErrorHandling("string" === typeof value, listner, "string", value);
            };
            Validator.makeStringTypeName = function (data) {
                var details = [];
                if (undefined !== data.minLength) {
                    details.push("minLength:".concat(data.minLength));
                }
                if (undefined !== data.maxLength) {
                    details.push("maxLength:".concat(data.maxLength));
                }
                if (undefined !== data.format) {
                    details.push("format:".concat(data.format));
                }
                else if (undefined !== data.pattern) {
                    details.push("pattern:".concat(data.pattern));
                }
                if (undefined !== data.regexpFlags) {
                    details.push("regexpFlags:".concat(data.regexpFlags));
                }
                return "string(".concat(details.join(","), ")");
            };
            Validator.isDetailedString = function (data, regexpFlags) {
                if ([data.minLength, data.maxLength, data.pattern, data.format].every(function (i) { return undefined === i; })) {
                    return Validator.isString;
                }
                var pattern = data.pattern;
                var result = function (value, listner) {
                    var _a, _b;
                    return Error.withErrorHandling("string" === typeof value &&
                        (undefined === data.minLength || data.minLength <= value.length) &&
                        (undefined === data.maxLength || value.length <= data.maxLength) &&
                        (undefined === pattern || new RegExp(pattern, (_b = (_a = data.regexpFlags) !== null && _a !== void 0 ? _a : regexpFlags) !== null && _b !== void 0 ? _b : "u").test(value)), listner, function () { return Validator.makeStringTypeName(data); }, value);
                };
                return result;
            };
            Validator.isObject = function (value) {
                return null !== value && "object" === typeof value && !Array.isArray(value);
            };
            Validator.isEnum = function (list) {
                return function (value, listner) {
                    return Error.withErrorHandling(list.includes(value), listner, function () { return list.map(function (i) { return Error.valueToString(i); }).join(" | "); }, value);
                };
            };
            Validator.isUniqueItems = function (list) {
                return list.map(function (i) { return JSON.stringify(i); }).every(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Validator.makeArrayTypeName = function (data) {
                var details = [];
                if (undefined !== (data === null || data === void 0 ? void 0 : data.minItems)) {
                    details.push("minItems:".concat(data.minItems));
                }
                if (undefined !== (data === null || data === void 0 ? void 0 : data.maxItems)) {
                    details.push("maxItems:".concat(data.maxItems));
                }
                if (true === (data === null || data === void 0 ? void 0 : data.uniqueItems)) {
                    details.push("uniqueItems:".concat(data.uniqueItems));
                }
                return details.length <= 0 ? "array" : "array(".concat(details.join(","), ")");
            };
            Validator.isArray = function (isType, data) {
                return function (value, listner) {
                    if (Array.isArray(value) &&
                        (undefined === (data === null || data === void 0 ? void 0 : data.minItems) || data.minItems <= value.length) &&
                        (undefined === (data === null || data === void 0 ? void 0 : data.maxItems) || value.length <= data.maxItems) &&
                        (true !== (data === null || data === void 0 ? void 0 : data.uniqueItems) || Validator.isUniqueItems(value))) {
                        var result = value.map(function (i) { return isType(i, listner); }).every(function (i) { return i; });
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, function () { return Validator.makeArrayTypeName(data); }, value);
                    }
                };
            };
            Validator.makeOrTypeNameFromIsTypeList = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return isTypeList.map(function (i) { return Error.getType(i); })
                    .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                    .filter(function (i, ix, list) { return ix === list.indexOf(i); });
            };
            Validator.getBestMatchErrors = function (listeners) {
                return listeners.map(function (listener) {
                    return ({
                        listener: listener,
                        matchRate: Error.getMatchRate(listener),
                    });
                })
                    .sort(EvilType.comparer(function (i) { return -Error.matchRateToNumber(i.matchRate); }))
                    .filter(function (i, _ix, list) { return i.matchRate === list[0].matchRate; })
                    .map(function (i) { return i.listener; });
            };
            Validator.isOr = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return function (value, listner) {
                    if (listner) {
                        var resultList = isTypeList.map(function (i) {
                            var transactionListner = Error.makeListener(listner.path);
                            var result = {
                                transactionListner: transactionListner,
                                result: i(value, transactionListner),
                            };
                            return result;
                        });
                        var success = resultList.filter(function (i) { return i.result; })[0];
                        var result = Boolean(success);
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                            if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                                var bestMatchErrors = Validator.getBestMatchErrors(resultList.map(function (i) { return i.transactionListner; }));
                                var errors = bestMatchErrors.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                var fullErrors = resultList.map(function (i) { return i.transactionListner; }).map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                Error.orErros(listner, isTypeList.length, errors, fullErrors);
                                if (errors.length <= 0) {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                                }
                                if (0 < bestMatchErrors.length) {
                                    Object.entries(bestMatchErrors[0].matchRate).forEach(function (kv) { return listner.matchRate[kv[0]] = kv[1]; });
                                }
                            }
                            else {
                                Error.raiseError(listner, requiredType.join(" | "), value);
                            }
                        }
                        return result;
                    }
                    else {
                        return isTypeList.some(function (i) { return i(value); });
                    }
                };
            };
            Validator.isAnd = function () {
                var isTypeList = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    isTypeList[_i] = arguments[_i];
                }
                return function (value, listner) {
                    if (listner) {
                        var resultList = isTypeList.map(function (i) {
                            var transactionListner = Error.makeListener(listner.path);
                            var result = {
                                transactionListner: transactionListner,
                                result: i(value, transactionListner),
                            };
                            return result;
                        });
                        var result = resultList.every(function (i) { return i.result; });
                        if (result) {
                            Error.setMatch(listner);
                        }
                        else {
                            var requiredType = Validator.makeOrTypeNameFromIsTypeList.apply(void 0, isTypeList);
                            if ((Validator.isObject(value) && requiredType.includes("object")) || (Array.isArray(value) && requiredType.includes("array"))) {
                                var transactionListners_1 = resultList.map(function (i) { return i.transactionListner; });
                                var errors = transactionListners_1.map(function (i) { return i.errors; }).reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, []);
                                Error.andErros(listner, errors);
                                if (errors.length <= 0) {
                                    console.error("🦋 FIXME: \"UnmatchWithoutErrors\": " + JSON.stringify(resultList));
                                }
                                if (0 < transactionListners_1.length) {
                                    var paths = transactionListners_1
                                        .map(function (i) { return Object.keys(i.matchRate); })
                                        .reduce(function (a, b) { return __spreadArray(__spreadArray([], a, true), b, true); }, [])
                                        .filter(function (i, ix, list) { return ix === list.indexOf(i); });
                                    paths.forEach(function (path) {
                                        var matchRates = transactionListners_1.map(function (i) { return i.matchRate[path]; })
                                            .filter(function (i) { return undefined !== i; });
                                        if (matchRates.every(function (i) { return true === i; })) {
                                            listner.matchRate[path] = true;
                                        }
                                        else {
                                            listner.matchRate[path] = matchRates
                                                .map(function (i) { return Error.matchRateToNumber(i); })
                                                .reduce(function (a, b) { return a + b; }, 0)
                                                / matchRates.length;
                                        }
                                    });
                                }
                            }
                            else {
                                Error.raiseError(listner, requiredType.join(" & "), value);
                            }
                        }
                        return result;
                    }
                    else {
                        return isTypeList.some(function (i) { return i(value); });
                    }
                };
            };
            Validator.isNeverTypeGuard = function (value, listner) {
                return Validator.isSpecificObject({
                    $type: Validator.isJust("never-type-guard"),
                })(value, listner);
            };
            Validator.isNeverMemberType = function (value, member, _neverTypeGuard, listner) {
                return !(member in value) || Validator.isNever(value[member], listner);
            };
            Validator.isOptionalTypeGuard = function (value, listner) {
                return Validator.isSpecificObject({
                    $type: Validator.isJust("optional-type-guard"),
                    isType: function (value, listner) {
                        return "function" === typeof value || (null !== value && "object" === typeof value) || (undefined !== listner && Error.raiseError(listner, "IsType<unknown> | ObjectValidator<unknown>", value));
                    },
                })(value, listner);
            };
            Validator.makeOptionalTypeGuard = function (isType) {
                return ({
                    $type: "optional-type-guard",
                    isType: isType,
                });
            };
            Validator.invokeIsType = function (isType) {
                return "function" === typeof isType ? isType : Validator.isSpecificObject(isType);
            };
            Validator.isOptional = Validator.makeOptionalTypeGuard;
            Validator.isOptionalMemberType = function (value, member, optionalTypeGuard, listner) {
                var result = !(member in value) || Validator.invokeIsType(optionalTypeGuard.isType)(value[member], listner);
                if (!result && listner) {
                    var error = listner.errors.filter(function (i) { return i.path === listner.path; })[0];
                    if (error) {
                        error.requiredType = "never | " + error.requiredType;
                    }
                    else {
                        // Not wrong, but noisy!
                        // listner.errors.filter(i => 0 === i.path.indexOf(listner.path) && "fragment" !== i.type).forEach(i => i.type = "fragment");
                        // listner.errors.push
                        // ({
                        //     type: "fragment",
                        //     path: listner.path,
                        //     requiredType: "never",
                        //     actualValue: Error.valueToString((value as ObjectType)[member]),
                        // });
                    }
                }
                return result;
            };
            Validator.isMemberType = function (value, member, isType, listner) {
                return Validator.isNeverTypeGuard(isType) ?
                    Validator.isNeverMemberType(value, member, isType, listner) :
                    Validator.isOptionalTypeGuard(isType) ?
                        Validator.isOptionalMemberType(value, member, isType, listner) :
                        Validator.invokeIsType(isType)(value[member], listner);
            };
            Validator.mergeObjectValidator = function (target) {
                var sources = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    sources[_i - 1] = arguments[_i];
                }
                return Object.assign.apply(Object, __spreadArray([{}, target], sources, true));
            };
            Validator.isSpecificObject = function (memberValidator, options) {
                return function (value, listner) {
                    if (Validator.isObject(value)) {
                        var result = Object.entries("function" === typeof memberValidator ? memberValidator() : memberValidator).map(function (kv) { return Validator.isMemberType(value, kv[0], kv[1], Error.nextListener(kv[0], listner)); })
                            .every(function (i) { return i; });
                        if (false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                            var regularKeys_1 = Object.keys(memberValidator);
                            var additionalKeys = Object.keys(value)
                                .filter(function (key) { return !regularKeys_1.includes(key); });
                            if (additionalKeys.some(function (_) { return true; })) {
                                additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                                result = false;
                            }
                        }
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, "object", value);
                    }
                };
            };
            Validator.isDictionaryObject = function (isType, keys, options) {
                return function (value, listner) {
                    if (Validator.isObject(value)) {
                        var result = undefined === keys ?
                            Object.entries(value).map(function (kv) { return isType(kv[1], Error.nextListener(kv[0], listner)); }).every(function (i) { return i; }) :
                            keys.map(function (key) { return isType(value, Error.nextListener(key, listner)); }).every(function (i) { return i; });
                        if (undefined !== keys && false === (options === null || options === void 0 ? void 0 : options.additionalProperties)) {
                            var additionalKeys = Object.keys(value)
                                .filter(function (key) { return !keys.includes(key); });
                            if (additionalKeys.some(function (_) { return true; })) {
                                additionalKeys.map(function (key) { return Error.raiseError(Error.nextListener(key, listner), "never", value[key]); });
                                result = false;
                            }
                        }
                        if (listner) {
                            if (result) {
                                Error.setMatch(listner);
                            }
                            else {
                                Error.calculateMatchRate(listner);
                            }
                        }
                        return result;
                    }
                    else {
                        return undefined !== listner && Error.raiseError(listner, "object", value);
                    }
                };
            };
        })(Validator = EvilType.Validator || (EvilType.Validator = {}));
    })(EvilType || (exports.EvilType = EvilType = {}));
});
define("generated/type", ["require", "exports", "evil-type.ts/common/evil-type"], function (require, exports, evil_type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Type = exports.EvilType = void 0;
    Object.defineProperty(exports, "EvilType", { enumerable: true, get: function () { return evil_type_1.EvilType; } });
    var Type;
    (function (Type) {
        Type.isStyleReplaceModeType = evil_type_1.EvilType.Validator.isEnum(["auto", "disabled",
            "embedded", "rules"]);
        Type.isEvilTimerConfigType = evil_type_1.EvilType.lazy(function () { return evil_type_1.EvilType.Validator.isSpecificObject(Type.evilTimerConfigTypeValidatorObject, {
            additionalProperties: false
        }); });
        Type.evilTimerConfigTypeValidatorObject = ({ $schema: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isJust("https://raw.githubusercontent.com/wraith13/evil-timer.js/master/generated/schema.json#")), disabled: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), debug: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean),
            disabledLoadMessage: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean), date: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isOr(evil_type_1.EvilType.Validator.isBoolean, evil_type_1.EvilType.Validator.isNumber, evil_type_1.EvilType.Validator.isString)), speed: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isNumber), pause: evil_type_1.EvilType.Validator.isOptional(evil_type_1.EvilType.Validator.isBoolean),
            styleReplaceMode: evil_type_1.EvilType.Validator.isOptional(Type.isStyleReplaceModeType), });
    })(Type || (exports.Type = Type = {}));
});
define("index", ["require", "exports", "generated/type"], function (require, exports, type_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EvilTimer = void 0;
    var EvilTimer;
    (function (EvilTimer) {
        var _a, _b, _c, _d;
        EvilTimer.Type = type_1.Type;
        var gThis = ((_a = self !== null && self !== void 0 ? self : window) !== null && _a !== void 0 ? _a : global);
        var VanillaDate = Date;
        var vanillaSetTimeout = setTimeout;
        var vanillaSetInteral = setInterval;
        var vanillaRequestAnimationFrame = (window !== null && window !== void 0 ? window : {}).requestAnimationFrame;
        var dateMode = "evil";
        EvilTimer.setDateMode = function (mode) {
            switch (mode) {
                case "vanilla":
                case "evil":
                    dateMode = mode;
                    break;
                default:
                    console.error("setDateMode(".concat(JSON.stringify(mode), " as \"vanilla\" | \"evil\");"));
                    break;
            }
        };
        var styleReplaceMode = "disabled";
        var originalEmbeddedStyles = null;
        var originalStyleRules = null;
        // let originalStyleSheets:string[] = null;
        var speed = 1;
        var isRegularSpeed = function () { return 1 === speed; };
        var isPaused = false;
        var susppendedTasks = [];
        var ankerAt = {
            vanilla: 0,
            evil: 0,
            vanillaPerformance: 0,
            evilPerformance: 0,
        };
        EvilTimer.getVanillaNow = function () { return new VanillaDate().getTime(); };
        EvilTimer.getEvilNow = function () {
            return !isAnkered() ?
                EvilTimer.getVanillaNow() :
                ankerAt.evil + (isPaused ? 0 : (speed * (EvilTimer.getVanillaNow() - ankerAt.vanilla)));
        };
        EvilTimer.getVanillaPerformanceNow = function () { return performance.now(); };
        EvilTimer.getEvilPerformanceNow = function () {
            return !isAnkered() ?
                EvilTimer.getVanillaPerformanceNow() :
                ankerAt.evilPerformance + (isPaused ? 0 : (speed * (EvilTimer.getVanillaPerformanceNow() - ankerAt.vanillaPerformance)));
        };
        var isAnkered = function () { return 0 !== ankerAt.vanilla; };
        var setAnkerAt = function (evil, evilPerformance) { return ankerAt =
            {
                vanilla: EvilTimer.getVanillaNow(),
                evil: evil !== null && evil !== void 0 ? evil : EvilTimer.getEvilNow(),
                vanillaPerformance: EvilTimer.getVanillaPerformanceNow(),
                evilPerformance: evilPerformance !== null && evilPerformance !== void 0 ? evilPerformance : EvilTimer.getEvilPerformanceNow(),
            }; };
        var resetAnkerAt = function (vanilla, vanillaPerformance) {
            if (vanilla === void 0) { vanilla = isRegularSpeed() ? 0 : EvilTimer.getVanillaNow(); }
            if (vanillaPerformance === void 0) { vanillaPerformance = isRegularSpeed() ? 0 : EvilTimer.getVanillaPerformanceNow(); }
            return ankerAt =
                {
                    vanilla: vanilla,
                    evil: vanilla,
                    vanillaPerformance: vanillaPerformance,
                    evilPerformance: vanillaPerformance,
                };
        };
        /*
        remain for support to timezone and locale.
        class EvilDateBody
        {
            vanilla: Date;
            constructor();
            constructor(value: number | string);
            constructor(year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number);
            constructor(year?: number | string, month?: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number)
            {
                if (undefined !== year)
                {
                    if ("number" === typeof year && undefined !== month)
                    {
                        this.vanilla = new VanillaDate(year, month, date, hours, minutes, seconds, ms);
                    }
                    else
                    {
                        this.vanilla = new VanillaDate(year);
                    }
                }
                else
                {
                    this.vanilla = new VanillaDate(getEvilNow());
                }
            }
            toString = () => this.vanilla.toString();
            toDateString = () => this.vanilla.toDateString();
            toTimeString = () => this.vanilla.toTimeString();
            toLocaleString = () => this.vanilla.toLocaleString();
            toLocaleDateString = () => this.vanilla.toLocaleDateString();
            toLocaleTimeString = () => this.vanilla.toLocaleTimeString();
            valueOf = () => this.vanilla.valueOf();
            getTime = () => this.vanilla.getTime();
            getFullYear = () => this.vanilla.getFullYear();
            getUTCFullYear = () => this.vanilla.getUTCFullYear();
            getMonth = () => this.vanilla.getMonth();
            getUTCMonth = () => this.vanilla.getUTCMonth();
            getDate = () => this.vanilla.getDate();
            getUTCDate = () => this.vanilla.getUTCDate();
            getDay = () => this.vanilla.getDay();
            getUTCDay = () => this.vanilla.getUTCDay();
            getHours = () => this.vanilla.getHours();
            getUTCHours = () => this.vanilla.getUTCHours();
            getMinutes = () => this.vanilla.getMinutes();
            getUTCMinutes = () => this.vanilla.getUTCMinutes();
            getSeconds = () => this.vanilla.getSeconds();
            getUTCSeconds = () => this.vanilla.getUTCSeconds();
            getMilliseconds = () => this.vanilla.getMilliseconds();
            getUTCMilliseconds = () => this.vanilla.getUTCMilliseconds();
            getTimezoneOffset = () => this.vanilla.getTimezoneOffset();
            setTime = (time: number) => this.vanilla.setTime(time);
            setMilliseconds = (ms: number) => this.vanilla.setMilliseconds(ms);
            setUTCMilliseconds = (ms: number) => this.vanilla.setUTCMilliseconds(ms);
            setSeconds = (sec: number, ms?: number) => this.vanilla.setSeconds(sec, ms);
            setUTCSeconds = (sec: number, ms?: number) => this.vanilla.setUTCSeconds(sec, ms);
            setMinutes = (min: number, sec?: number, ms?: number) => this.vanilla.setMinutes(min, sec, ms);
            setUTCMinutes = (min: number, sec?: number, ms?: number) => this.vanilla.setUTCMinutes(min, sec, ms);
            setHours = (hours: number, min?: number, sec?: number, ms?: number) => this.vanilla.setHours(hours, min, sec, ms);
            setUTCHours = (hours: number, min?: number, sec?: number, ms?: number) => this.vanilla.setUTCHours(hours, min, sec, ms);
            setDate = (date: number) => this.vanilla.setDate(date);
            setUTCDate = (date: number) => this.vanilla.setUTCDate(date);
            setMonth = (month: number, date?: number) => this.vanilla.setMonth(month, date);
            setUTCMonth = (month: number, date?: number) => this.vanilla.setUTCMonth(month, date);
            setFullYear = (year: number, month?: number, date?: number) => this.vanilla.setFullYear(year, month, date);
            setUTCFullYear = (year: number, month?: number, date?: number) => this.vanilla.setUTCFullYear(year, month, date);
            toUTCString = () => this.vanilla.toUTCString();
            toISOString = () => this.vanilla.toISOString();
            toJSON = (key?: any) => this.vanilla.toJSON(key);
            static parse = (s: string) => VanillaDate.parse(s);
            static UTC = (year: number, month: number, date?: number, hours?: number, minutes?: number, seconds?: number, ms?: number) => VanillaDate.UTC(year, month, date, hours, minutes, seconds, ms);
            static now = () => new EvilDateBody().getTime();
        }
        */
        EvilTimer.EvilDate = function _e() {
            var _newTarget = this && this instanceof _e ? this.constructor : void 0;
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if ("evil" === dateMode && isAnkered() && 0 === args.length) {
                return _newTarget ?
                    new VanillaDate(EvilTimer.getEvilNow()) :
                    new VanillaDate(EvilTimer.getEvilNow()).toString();
            }
            else {
                return _newTarget ? new (VanillaDate.bind.apply(VanillaDate, __spreadArray([void 0], args, false)))() : VanillaDate.apply(void 0, args);
            }
        };
        EvilTimer.EvilDate.parse = VanillaDate.parse;
        EvilTimer.EvilDate.UTC = VanillaDate.UTC;
        EvilTimer.EvilDate.now = EvilTimer.getEvilNow;
        EvilTimer.setDate = function (date) {
            if ("boolean" === typeof date) {
                EvilTimer.setDateMode(date ? "evil" : "vanilla");
            }
            else {
                EvilTimer.setDateMode("evil");
                setAnkerAt("number" === typeof date ? date :
                    "string" === typeof date ? VanillaDate.parse(date) :
                        date.getTime());
            }
        };
        EvilTimer.resetDate = function () { return resetAnkerAt(); };
        EvilTimer.restore = function () {
            EvilTimer.setSpeed(1);
            EvilTimer.unpause();
            resetAnkerAt();
        };
        EvilTimer.pause = function () {
            setAnkerAt();
            isPaused = true;
        };
        EvilTimer.unpause = function () {
            setAnkerAt();
            isPaused = false;
            EvilTimer.stepOut();
        };
        EvilTimer.step = function (count) {
            var _a;
            if (count === void 0) { count = 1; }
            for (var i = 0; i < count; ++i) {
                (_a = susppendedTasks.shift()) === null || _a === void 0 ? void 0 : _a();
            }
            return susppendedTasks.length;
        };
        EvilTimer.stepAll = function () {
            EvilTimer.step(susppendedTasks.length);
        };
        EvilTimer.stepOut = function () {
            while (0 < EvilTimer.step())
                ;
        };
        var styleTimerRegExp = /((?:animation|transition)(?:-duration|-delay)?\s*:)([\+\-0-9A-Za-z.\s]+);/gm;
        var hasTimer = function (css) { return styleTimerRegExp.test(css); };
        var replaceTimer = function (rate, css) { return css.replace(styleTimerRegExp, function (_m, p1, p2) { return "".concat(p1).concat(p2.replace(/([\+\-]?[0-9.]+)(m?s)/gm, function (_m, p1, p2) { return (parseFloat(p1) / Math.abs(rate)).toLocaleString("en") + p2; }), ";"); }); };
        var updateEmbeddedStyle = function (rate) {
            if (rate === void 0) { rate = speed; }
            var styles = Array.from(document.getElementsByTagName("style"));
            if (null === originalEmbeddedStyles) {
                originalEmbeddedStyles = styles.map(function (i) { return i.innerHTML; });
            }
            styles.forEach(function (i, ix) {
                var _a, _b;
                if (hasTimer((_a = originalEmbeddedStyles === null || originalEmbeddedStyles === void 0 ? void 0 : originalEmbeddedStyles[ix]) !== null && _a !== void 0 ? _a : "")) {
                    i.innerHTML = replaceTimer(rate, (_b = originalEmbeddedStyles === null || originalEmbeddedStyles === void 0 ? void 0 : originalEmbeddedStyles[ix]) !== null && _b !== void 0 ? _b : "");
                }
            });
        };
        var updateStyleRules = function (rate) {
            if (rate === void 0) { rate = speed; }
            var styles = Array.from(document.styleSheets);
            if (null === originalStyleRules) {
                originalStyleRules = styles.map(function (stylesheet) {
                    try {
                        var rules = Array.from(stylesheet.cssRules).map(function (rule) { return rule.cssText; });
                        if (0 < rules.filter(function (rule) { return hasTimer(rule !== null && rule !== void 0 ? rule : ""); }).length) {
                            return rules;
                        }
                    }
                    catch (_a) {
                        console.error("Can not read: ".concat(stylesheet.href));
                    }
                    return null;
                });
            }
            styles.forEach(function (stylesheet, ix) {
                var _a;
                if (null !== (originalStyleRules === null || originalStyleRules === void 0 ? void 0 : originalStyleRules[ix])) {
                    while (0 < stylesheet.cssRules.length) {
                        stylesheet.deleteRule(0);
                    }
                    (_a = originalStyleRules === null || originalStyleRules === void 0 ? void 0 : originalStyleRules[ix]) === null || _a === void 0 ? void 0 : _a.forEach(function (rule) { return stylesheet.insertRule(replaceTimer(rate, rule)); });
                }
            });
        };
        // const updateStyleSheets = () =>
        // {
        //     const styles = <CSSStyleSheet[]>Array.from(document.styleSheets);
        //     if (null === originalStyleSheets)
        //     {
        //         originalStyleSheets = styles.map
        //         (
        //             stylesheet =>
        //             {
        //                 try
        //                 {
        //                     const rules = Array.from(stylesheet.cssRules).map(rule => rule.cssText).join(" ");
        //                     if (0 <= rules.indexOf("animation-duration"))
        //                     {
        //                         return rules;
        //                     }
        //                 }
        //                 catch
        //                 {
        //                     console.error(`Can not read: ${stylesheet.href}`);
        //                 }
        //                 return null;
        //             }
        //         );
        //     }
        //     styles.forEach
        //     (
        //         (stylesheet, ix) =>
        //         {
        //             if (null !== originalStyleSheets[ix])
        //             {
        //                 (<any>stylesheet).replaceSync(replaceAnimationDuration(originalStyleSheets[ix]));
        //             }
        //         }
        //     );
        // };
        // const isChromium = () => !! (<any>window).chrome;
        var isEmbeddedStyleOnly = function () {
            return Array.from(document.getElementsByTagName("link"))
                .filter(function (i) { return "stylesheet" === i.rel; }).length <= 0;
        };
        EvilTimer.getStyleReplaceMode = function () {
            switch (styleReplaceMode) {
                case "auto":
                    // if (isChromium())
                    // {
                    //     return "sheets";
                    // }
                    if (isEmbeddedStyleOnly()) {
                        return "embedded";
                    }
                    return "rules";
                default:
                    return styleReplaceMode;
            }
        };
        var updateStyle = function (rate) {
            if (rate === void 0) { rate = speed; }
            switch (EvilTimer.getStyleReplaceMode()) {
                case "embedded":
                    updateEmbeddedStyle(rate);
                    break;
                case "rules":
                    updateStyleRules(rate);
                    break;
                // case "sheets":
                //     updateStyleSheets();
                //     break;
            }
        };
        EvilTimer.setStyleReplaceMode = function (mode) {
            switch (mode) {
                case "auto":
                case "disabled":
                case "embedded":
                case "rules":
                    // case "sheets":
                    if (styleReplaceMode !== mode) {
                        if ("disabled" !== styleReplaceMode && 1 !== speed) {
                            updateStyle(1);
                        }
                        styleReplaceMode = mode;
                        if ("disabled" !== styleReplaceMode && 1 !== speed) {
                            updateStyle();
                        }
                    }
                    break;
                default:
                    console.error("setStyleReplaceMode(".concat(JSON.stringify(mode), " as \"auto\" | \"disabled\" | \"embedded\" | \"rules\");"));
                    break;
            }
        };
        EvilTimer.setSpeed = function (rate) {
            if (0 == rate) {
                EvilTimer.pause();
            }
            else {
                setAnkerAt();
                speed = rate;
                updateStyle();
            }
        };
        EvilTimer.evilSetTimeout = function (callback, wait) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            return vanillaSetTimeout(function () {
                if (isPaused) {
                    susppendedTasks.push(function () { return callback.apply(void 0, args); });
                }
                else {
                    callback.apply(void 0, args);
                }
            }, undefined === wait ? wait : wait / Math.abs(speed));
        };
        EvilTimer.evilSetInterval = function (callback, wait) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            var pushed = false;
            return vanillaSetInteral(function () {
                if (isPaused) {
                    if (!pushed) {
                        susppendedTasks.push(function () { return callback.apply(void 0, args); });
                        pushed = true;
                    }
                }
                else {
                    pushed = false;
                    callback.apply(void 0, args);
                }
            }, undefined === wait ? wait : wait / Math.abs(speed));
        };
        EvilTimer.evilRequestAnimationFrame = function (callback) { return vanillaRequestAnimationFrame(function (_tick) {
            if (isPaused) {
                susppendedTasks.push(function () { return callback(EvilTimer.getEvilPerformanceNow()); });
            }
            else {
                callback(EvilTimer.getEvilPerformanceNow());
            }
        }); };
        var Vanilla;
        (function (Vanilla) {
            Vanilla.Date = function _a() {
                var _newTarget = this && this instanceof _a ? this.constructor : void 0;
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return _newTarget ? new (VanillaDate.bind.apply(VanillaDate, __spreadArray([void 0], args, false)))() : VanillaDate.apply(void 0, args);
            };
            Vanilla.Date.parse = VanillaDate.parse;
            Vanilla.Date.UTC = VanillaDate.UTC;
            Vanilla.Date.now = VanillaDate.now;
            Vanilla.setTimeout = function (callback, wait) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                return vanillaSetTimeout.apply(void 0, __spreadArray([callback,
                    wait], args, false));
            };
            Vanilla.setInterval = function (callback, wait) {
                var args = [];
                for (var _i = 2; _i < arguments.length; _i++) {
                    args[_i - 2] = arguments[_i];
                }
                return vanillaSetInteral.apply(void 0, __spreadArray([callback,
                    wait], args, false));
            };
        })(Vanilla = EvilTimer.Vanilla || (EvilTimer.Vanilla = {}));
        EvilTimer.set = function (config) {
            if ("boolean" === typeof config) {
                if (config) {
                    gThis.EvilTimer = EvilTimer;
                    gThis.Date = EvilTimer.EvilDate;
                    gThis.setTimeout = EvilTimer.evilSetTimeout;
                    gThis.setInterval = EvilTimer.evilSetInterval;
                    if (window) {
                        window.requestAnimationFrame = EvilTimer.evilRequestAnimationFrame;
                    }
                }
                else {
                    // delete gThis.EvilTimer;
                    gThis.Date = VanillaDate;
                    gThis.setTimeout = vanillaSetTimeout;
                    gThis.setInterval = vanillaSetInteral;
                    if (window) {
                        window.requestAnimationFrame = vanillaRequestAnimationFrame;
                    }
                }
            }
            else {
                if (undefined !== config.disabled && "boolean" === typeof config.disabled) {
                    EvilTimer.set(!config.disabled);
                }
                if (undefined !== config.styleReplaceMode) {
                    EvilTimer.setStyleReplaceMode(config.styleReplaceMode);
                }
                if (undefined !== config.date) {
                    EvilTimer.setDate(config.date);
                }
                if (undefined !== config.speed) {
                    EvilTimer.setSpeed(config.speed);
                }
                if (undefined !== config.pause) {
                    if (config.pause) {
                        EvilTimer.pause();
                    }
                    else {
                        EvilTimer.unpause();
                    }
                }
            }
        };
        EvilTimer.debugKey = "evil-timer.debug";
        EvilTimer.isDebug = function () { var _a; return JSON.parse((_a = window.localStorage.getItem(EvilTimer.debugKey)) !== null && _a !== void 0 ? _a : "false"); };
        EvilTimer.debugOn = function () { return window.localStorage.setItem(EvilTimer.debugKey, JSON.stringify(true)); };
        EvilTimer.debugOff = function () { return window.localStorage.removeItem(EvilTimer.debugKey); };
        EvilTimer.getStatus = function () {
            var vanilla = new VanillaDate();
            var evil = new EvilTimer.EvilDate();
            var result = {
                enabled: gThis.EvilTimer === EvilTimer,
                debug: EvilTimer.isDebug(),
                speed: speed,
                isPaused: isPaused,
                susppendedTasksCount: susppendedTasks.length,
                date: {
                    vanilla: {
                        text: vanilla.toLocaleString(),
                        tick: vanilla.getTime(),
                    },
                    evil: {
                        text: evil.toLocaleString(),
                        tick: evil.getTime(),
                    }
                }
            };
            return result;
        };
        var getConfigFromUrl = function () {
            var _a, _b, _c, _d;
            if (EvilTimer.isDebug()) {
                try {
                    return (_d = (_c = (_b = (_a = location.href
                        .split("#")[0]
                        .split("?")[1]) === null || _a === void 0 ? void 0 : _a.split("&")) === null || _b === void 0 ? void 0 : _b.filter(function (i) { return i.startsWith("evil-timer="); })) === null || _c === void 0 ? void 0 : _c.map(function (i) { return JSON.parse(decodeURIComponent(i.substr("evil-timer=".length))); })) === null || _d === void 0 ? void 0 : _d[0];
                }
                catch (err) {
                    console.log(err);
                }
            }
            return null;
        };
        var globalEvilTimerConfig = gThis.evilTimerConfig;
        if (undefined !== globalEvilTimerConfig && "boolean" !== typeof globalEvilTimerConfig) {
            var listener = type_1.EvilType.Error.makeListener("evilTimerConfig");
            if (!EvilTimer.Type.isEvilTimerConfigType(globalEvilTimerConfig, listener)) {
                console.error("🚫 Invalid evilTimerConfig(in JavaScript)");
                console.error(listener);
            }
        }
        if ("object" === typeof globalEvilTimerConfig && "boolean" === typeof globalEvilTimerConfig.debug) {
            if (globalEvilTimerConfig.debug) {
                EvilTimer.debugOn();
            }
            else {
                EvilTimer.debugOff();
            }
        }
        var configFromUrl = getConfigFromUrl();
        if (undefined !== configFromUrl && null !== configFromUrl && "boolean" !== typeof configFromUrl) {
            var listener = type_1.EvilType.Error.makeListener("configFromUrl");
            if (!EvilTimer.Type.isEvilTimerConfigType(configFromUrl, listener)) {
                console.error("🚫 Invalid evil-timer(in URL Parameter)");
                console.error(listener);
            }
        }
        var configOrBoolean = ((_b = configFromUrl !== null && configFromUrl !== void 0 ? configFromUrl : gThis.evilTimerConfig) !== null && _b !== void 0 ? _b : true);
        var evilTimerConfig = "boolean" === typeof configOrBoolean ? { disabled: !configOrBoolean, } : configOrBoolean;
        if (!((_c = evilTimerConfig.disabled) !== null && _c !== void 0 ? _c : false)) {
            EvilTimer.set(true);
            if (!((_d = evilTimerConfig.disabledLoadMessage) !== null && _d !== void 0 ? _d : false)) {
                console.log("evil-timer.js is loaded. You can use EvilTimer commands with your own risk. see: https://github.com/wraith13/evil-timer.js");
            }
            EvilTimer.set(evilTimerConfig);
        }
    })(EvilTimer || (exports.EvilTimer = EvilTimer = {}));
});
//# sourceMappingURL=index.js.map