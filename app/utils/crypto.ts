import CryptoJS from 'crypto-js'


declare let process: {
    env: {
        URL_SHORTNER_CRYPTO_SECRET: string
    }
}

export enum HASH_ENUM {
    SHA_256 = "SHA-256",
    SHA_512 = "SHA-512"
}

export const getHash = (str: string, algo: HASH_ENUM = HASH_ENUM.SHA_256): Promise<string> => {
    let strBuf = new TextEncoder().encode(str);
    return crypto.subtle.digest(algo, strBuf)
        .then(hash => {
            let result = '';
            const view = new DataView(hash);
            for (let i = 0; i < hash.byteLength; i += 4) {
                result += ('00000000' + view.getUint32(i).toString(16)).slice(-8);
            }
            return result;
        });
}

interface JsonObj {
    ct: string,
    iv?: string,
    s?: string,
}

let JsonFormatter = {
    stringify: function (cipherParams: CryptoJS.lib.CipherParams) {
        // create json object with ciphertext
        let jsonObj: JsonObj = { ct: cipherParams.ciphertext.toString(CryptoJS.enc.Base64) };

        // optionally add iv or salt
        if (cipherParams.iv) {
            jsonObj.iv = cipherParams.iv.toString();
        }

        if (cipherParams.salt) {
            jsonObj.s = cipherParams.salt.toString();
        }

        // stringify json object
        return JSON.stringify(jsonObj);
    },
    parse: function (jsonStr: any) {
        // parse json string
        var jsonObj = JSON.parse(jsonStr);

        // extract ciphertext from json object, and create cipher params object
        var cipherParams = CryptoJS.lib.CipherParams.create({
            ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
        });

        // optionally extract iv or salt

        if (jsonObj.iv) {
            cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
        }

        if (jsonObj.s) {
            cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);
        }

        return cipherParams;
    }
};

export const encrypt = (str: string) => {
    let encrypted = CryptoJS.AES.encrypt(str, process.env.URL_SHORTNER_CRYPTO_SECRET);
    return encrypted.toString();
}

export const decrypt = (encryptedText: string) => {
    return CryptoJS.AES.decrypt(encryptedText, process.env.URL_SHORTNER_CRYPTO_SECRET).toString(CryptoJS.enc.Utf8);
}

