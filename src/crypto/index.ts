import AES from "crypto-js/aes";
import encUtf8 from "crypto-js/enc-utf8";

const defaultKey = "devflikr";

export function encryptString(inputString: string, secretKey: string = defaultKey, fix: boolean = false) {
    const str = AES.encrypt(inputString, secretKey).toString();
    return fix ? str.replace(/\+/g, "p1L2u3S").replace(/\//g, "s1L2a3S4h").replace(/=/g, "e1Q2u3A4l") : str;
}

export function decryptString(encryptedString: string, secretKey: string = defaultKey, fix: boolean = false) {

    if (fix) encryptedString = encryptedString.replace(/p1L2u3S/g, "+").replace(/s1L2a3S4h/g, "/").replace(/e1Q2u3A4l/g, "=");

    const decrypted = AES.decrypt(encryptedString, secretKey);
    if (decrypted) {
        try {
            const str = decrypted.toString(encUtf8);
            if (str.length > 0) return str;
        } catch (e) { return ""; }
    }
    return "";
}