import { JSEncrypt } from "jsencrypt";

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFZLucigIvl/AAliSrlP0QI8vxB11C9iAEsvvZto3A/yh9MIlCoKVFbUvqAEuLpxJxMqTDDJA4C7xoukAcyXJTEiEILeqBbqSxDlsxh+L3msaim+ZKKoUnJvxuekJyFOi9H0seZbS/WytkqKhKmATOe0w94JMHFkFFON4QyERehwIDAQAB";

const util = {};

util.encruption = function(data) {
  var e = new JSEncrypt();
  e.setPublicKey(publicKey);
  return e.encrypt(data);
};
util.delay = ms => new Promise(resolve => setTimeout(resolve, ms));
util.makeOrder = async obj =>
  new Promise(resolve => {
    console.log(obj);
    const arr = [true, false];
    const ret = arr[Math.floor(Math.random() * arr.length)];
    resolve(
      ret
        ? {
            result: "",
            code: -1,
            msg: "当前预约人数较多，请稍后重试！"
          }
        : { result: 666, code: 200 }
    );
  });

export default util;
