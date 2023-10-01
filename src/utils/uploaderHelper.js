import * as qiniu from 'qiniu-js';
// @ts-ignore
import * as CryptoJS from 'crypto-js'

// export const ak = 'IAM-F5yqfl0mN9zferTQMsaZP_pf8tsnXbz4YVJWJMEM'
// export const sk = 'gjnAWqegg3V37pitU-aRojQxdiwFfnFd5UrRwxCqOvyB'
// export const bucketname = 'city-best-all'

export const ak = 'IAM-hoBasBUKO_CONvgWjf08D6GxugA4n5m_zKhRUrTY'
export const sk = 'mM99LD045_VHVe9knrBDo1wYpUg6eCkuDXOJdsaSoQ7M'
export const bucketname = 'develop-shan'

export function uploadFile(file,fileBolder) {
    const uptoken = getToken(ak,sk,bucketname);
    const key = `${fileBolder ? fileBolder + '/' : ''}${file.name}`;
    const config = {
        useCdnDomain: true,
        region: qiniu.region.z0,
        forceDirect: false,
        chunkSize:64
    };
    const putExtra = {
        fname: file.name,
        mimeType: null
    };
    return qiniu.upload(file, key, uptoken, putExtra, config);
}
export function getToken(access_key, secret_key, bucketname) {
    var putPolicy = {
        "scope": bucketname,
        "deadline": 3600 + Math.floor(Date.now() / 1000)
    }
    var encoded = base64Encode(utf16to8(JSON.stringify(putPolicy)));
    var hash = CryptoJS.HmacSHA1(encoded, secret_key);
    var encodedSign = hash.toString(CryptoJS.enc.Base64).replace(/\//g, '_').replace(/\+/g, '-');
    var uploadToken = access_key + ':' + encodedSign + ':' + encoded;
    return uploadToken;
}
function base64Encode(str) {
    var out, i, len;
    var c1, c2, c3;
    len = str.length;
    i = 0;
    out = "";
    var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
    while (i < len) {
        c1 = str.charCodeAt(i++) & 0xff;
        if (i === len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt((c1 & 0x3) << 4);
            out += "==";
            break;
        }
        c2 = str.charCodeAt(i++);
        if (i === len) {
            out += base64EncodeChars.charAt(c1 >> 2);
            out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
            out += base64EncodeChars.charAt((c2 & 0xF) << 2);
            out += "=";
            break;
        }
        c3 = str.charCodeAt(i++);
        out += base64EncodeChars.charAt(c1 >> 2);
        out += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
        out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
        out += base64EncodeChars.charAt(c3 & 0x3F);
    }
    return out;
}
function utf16to8(str) {
    var out, i, len, c;
    out = "";
    len = str.length;
    for (i = 0; i < len; i++) {
        c = str.charCodeAt(i);
        if ((c >= 0x0001) && (c <= 0x007F)) {
            out += str.charAt(i);
        } else if (c > 0x07FF) {
            out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
            out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        } else {
            out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
            out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
        }
    }
    return out;
}