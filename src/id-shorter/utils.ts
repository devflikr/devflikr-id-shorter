import { ObjectId } from "bson";

export class BaseCharSet {
    set: string;
    bits: number;
    map: { [key: string]: number };
    escapeChar: string | undefined;

    constructor(str: string) {
        this.set = str;
        this.bits = (this.set.length - 1).toString(2).length;
        this.map = {};

        for (let i = 0; i < this.set.length; i++) {
            const char = this.set.charAt(i);
            this.map[char] = i;
        }
    }

}

export class EncodingCharSet {
    set: string;
    bits: number;
    po2: number;

    escapeChar: string;

    map: { [key: string]: number };

    constructor(str: string) {
        this.set = str.substring(0, str.length);
        this.bits = (this.set.length - 1).toString(2).length;
        this.po2 = Math.pow(2, this.bits);

        if (this.set.length < this.po2) {

            this.escapeChar = str.charAt(str.length - 1);

            this.set = str.substring(0, str.length - 1);
            this.bits = (this.set.length - 1).toString(2).length;
            this.po2 = Math.pow(2, this.bits);
        }
        else {

            this.escapeChar = "";
        }

        this.map = {};

        for (let i = 0; i < this.set.length; i++) {
            const char = this.set.charAt(i);
            this.map[char] = i;
        }
    }

    encode(value?: number) {
        if (value == undefined) {
            console.error("Value " + value + " is not a number");
            return "";
        }
        if (isNaN(value)) {
            console.error("Value " + value + " is not a number");
            return "";
        }
        if (value > this.po2 - 1) {
            console.error("Value cannot be decoded with given bit length. Try less bits.");
            return "";
        }

        let result = "";

        if (value > this.set.length - 1) {
            result = this.escapeChar;
            value -= this.set.length;
        }

        result += this.set.charAt(value);

        return result;
    }
}


export function getObjectIdTime(id: string | ObjectId) {
    let str = "";


    id = new ObjectId(String(id));


    const date = id.getTimestamp();


    let time = date.getTime();

    if (time < 0) {
        time = 0;
    }


    let counter = parseInt(id.toHexString().slice(-6), 16);


    counter = parseInt(counter.toString().slice(-3), 10);


    time = time + counter;

    str += time;

    return str;
}

export function padLeft(number: string, width: number, char: string | undefined) {
    char = char || "0";
    width -= number.toString().length;

    if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join(char) + number;
    }
    return number + "";
}