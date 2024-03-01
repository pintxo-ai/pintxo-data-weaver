/* eslint-disable */
import * as _m0 from "protobufjs/minimal.js";
export const protobufPackage = "eth.seaport_metrics.v1";
function createBaseMetrics() {
    return { metrics: [] };
}
export const Metrics = {
    encode(message, writer = _m0.Writer.create()) {
        for (const v of message.metrics) {
            Metric.encode(v, writer.uint32(10).fork()).ldelim();
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMetrics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.metrics.push(Metric.decode(reader, reader.uint32()));
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            metrics: globalThis.Array.isArray(object?.metrics) ? object.metrics.map((e) => Metric.fromJSON(e)) : [],
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.metrics?.length) {
            obj.metrics = message.metrics.map((e) => Metric.toJSON(e));
        }
        return obj;
    },
    create(base) {
        return Metrics.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseMetrics();
        message.metrics = object.metrics?.map((e) => Metric.fromPartial(e)) || [];
        return message;
    },
};
function createBaseMetric() {
    return { key: "", value: "" };
}
export const Metric = {
    encode(message, writer = _m0.Writer.create()) {
        if (message.key !== "") {
            writer.uint32(10).string(message.key);
        }
        if (message.value !== "") {
            writer.uint32(18).string(message.value);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof _m0.Reader ? input : _m0.Reader.create(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseMetric();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    if (tag !== 10) {
                        break;
                    }
                    message.key = reader.string();
                    continue;
                case 2:
                    if (tag !== 18) {
                        break;
                    }
                    message.value = reader.string();
                    continue;
            }
            if ((tag & 7) === 4 || tag === 0) {
                break;
            }
            reader.skipType(tag & 7);
        }
        return message;
    },
    fromJSON(object) {
        return {
            key: isSet(object.key) ? globalThis.String(object.key) : "",
            value: isSet(object.value) ? globalThis.String(object.value) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        if (message.key !== "") {
            obj.key = message.key;
        }
        if (message.value !== "") {
            obj.value = message.value;
        }
        return obj;
    },
    create(base) {
        return Metric.fromPartial(base ?? {});
    },
    fromPartial(object) {
        const message = createBaseMetric();
        message.key = object.key ?? "";
        message.value = object.value ?? "";
        return message;
    },
};
function isSet(value) {
    return value !== null && value !== undefined;
}
