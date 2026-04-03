"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Type = exports.Status = void 0;
var Status;
(function (Status) {
    Status["Applied"] = "applied";
    Status["Interview"] = "interview";
    Status["Offer"] = "offer";
    Status["Rejected"] = "rejected";
})(Status || (exports.Status = Status = {}));
var Type;
(function (Type) {
    Type["Remote"] = "remote";
    Type["Onsite"] = "onsite";
    Type["Hybrid"] = "hybrid";
})(Type || (exports.Type = Type = {}));
