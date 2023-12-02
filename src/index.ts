import ShortId from "./id-shorter";
import * as Crypto from './crypto';
import { encryptString, decryptString } from "./crypto";
import uuid from "./uuid";
import twcls from "./twcls";

const Utils = {
    uuid,
    twcls,
    Crypto,
    ShortId,
    encryptString,
    decryptString,
};

export default Utils;

export {
    uuid,
    twcls,
    Crypto,
    ShortId,
    encryptString,
    decryptString,
};