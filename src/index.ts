import ShortId from "./id-shorter";
import * as Crypto from './crypto';
import { encryptString, decryptString } from "./crypto";
import uuid from "./uuid";

const Utils = {
    uuid,
    Crypto,
    ShortId,
    encryptString,
    decryptString,
};

export default Utils;

export {
    uuid,
    Crypto,
    ShortId,
    encryptString,
    decryptString,
};