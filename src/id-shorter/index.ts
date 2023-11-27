import { ObjectId } from "bson";
import * as Utils from "./utils";

const DEFAULT_BASESET = "0123456789";
const DEFAULT_FULL_BASESET = "0123456789abcdef";
const DEFAULT_ENCODINGSET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function ShortId(params?: { isFullId?: boolean; base?: string; encoding?: string; isInverse?: boolean; }) {

    params = params || {};


    let baseCharSet = new Utils.BaseCharSet(DEFAULT_BASESET);
    let encodingCharSet = new Utils.EncodingCharSet(DEFAULT_ENCODINGSET);
    let isFullId = false;
    let isInverse = true;


    const setBase = function (set: string) {
        baseCharSet = new Utils.BaseCharSet(set);
    };

    const setEncoding = function (set: string) {
        encodingCharSet = new Utils.EncodingCharSet(set);
    };


    const setFullId = function (value?: boolean) {
        isFullId = !!value;
        if (isFullId) {
            if (baseCharSet.set == DEFAULT_BASESET) {
                baseCharSet = new Utils.BaseCharSet(DEFAULT_FULL_BASESET);
            }
        }
        else {
            baseCharSet = new Utils.BaseCharSet(DEFAULT_BASESET);
        }
    };

    const inverse = function (value?: boolean) {
        isInverse = !!value;
    };


    if ("isFullId" in params) {
        setFullId(params.isFullId);
    }

    if (params.base) {
        setBase(params.base);
    }

    if (params.encoding) {
        setEncoding(params.encoding);
    }

    if ("isInverse" in params) {
        inverse(params.isInverse);
    }

    const BitStream = function (input: string, base: Utils.BaseCharSet) {
        let bitBuffer: string[] = [];
        let position = 0;

        for (let i = 0; i < input.length; i++) {
            const char = input.charAt(i);

            let value = base.map[char];

            if (char == base.escapeChar && (i + 1 < input.length)) {

                const nextChar = input.charAt(++i);
                value = base.set.length + base.map[nextChar];
            }


            if (isNaN(value)) {
                console.error("Invalid char \"" + char + "\" in input");

                bitBuffer = [];
                break;
            }

            const bitValue = Utils.padLeft(value.toString(2), base.bits, "0");



            bitBuffer = bitBuffer.concat(bitValue.split(""));
        }


        const stream = {
            rewind: function () {
                position = 0;
            },
            isEOF: function () {
                return position == bitBuffer.length;
            },
            getBits: function (bits: number) {
                if (stream.isEOF()) {
                    return;
                }

                const requestedBits = bitBuffer.slice(position, position + bits).join("");
                position += requestedBits.length;
                const value = parseInt(requestedBits, 2);

                return value;
            },
        };

        return stream;
    };


    return {
        setFullId: setFullId,
        setBase: setBase,
        setEncoding: setEncoding,
        inverse: inverse,
        encode: function (input: string | ObjectId) {

            if (!isFullId && baseCharSet.set == DEFAULT_BASESET) {
                input = Utils.getObjectIdTime(input);
            }

            const bitStream = BitStream(String(input), baseCharSet);

            let result = "";
            while (!bitStream.isEOF()) {
                const value = bitStream.getBits(encodingCharSet.bits);
                const nextChar = encodingCharSet.encode(value);
                if (isInverse) {
                    result = nextChar + result;
                }
                else {
                    result += nextChar;
                }
            }

            return result;
        },
        decode: function (input: string) {

            if (isInverse) {
                if (encodingCharSet.escapeChar !== undefined) {
                    let reverseStr = "";
                    let pos = 0;
                    while (pos < input.length) {
                        let char = input.charAt(pos++);
                        if (char == encodingCharSet.escapeChar) {
                            char += input.charAt(pos++);
                        }

                        reverseStr = char + reverseStr;
                    }
                    input = reverseStr;
                }
                else {
                    input = input.split("").reverse().join();
                }
            }

            const bitStream = BitStream(String(input), encodingCharSet);

            let result = "";
            while (!bitStream.isEOF()) {
                const value = bitStream.getBits(baseCharSet.bits);
                const char = baseCharSet.set.charAt(value || -1);
                result += char;
            }

            return result;

        }
    };
}

export default ShortId;