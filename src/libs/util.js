import { JSEncrypt } from "jsencrypt";

const publicKey =
  "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDFZLucigIvl/AAliSrlP0QI8vxB11C9iAEsvvZto3A/yh9MIlCoKVFbUvqAEuLpxJxMqTDDJA4C7xoukAcyXJTEiEILeqBbqSxDlsxh+L3msaim+ZKKoUnJvxuekJyFOi9H0seZbS/WytkqKhKmATOe0w94JMHFkFFON4QyERehwIDAQAB";

const util = {};

util.encruption = function(data) {
  var e = new JSEncrypt();
  e.setPublicKey(publicKey);
  return e.encrypt(data);
};

export default util;
