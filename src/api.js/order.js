import request from "@/plugin/axios";

/**
 * 下单
 * @param {*} obj {"maskCount":5,"subscribeDate":"2020-03-02","subscribeTime":"中午","pharmacyName":"大连海王星辰医药有限公司依海店","pharmacyAddress":"大连市高新技术产业园区小平岛依海街50-1、2号","pharmacyMobile":"15542662391","pharmcayId":52,"realName":"xHpyamKi0xXNnWigPPKfxrS+N2/yxfh2meK9q4V1knMS1/Dc3IYanuYsNrdlHEBU+SemUecnAMdEa1pF/rrWaRHe/RADGG3CDb9KQB9NFe8xs2TpPwhQHxVxPnfv/6uHUd1lCbEmulFgUDfNFwYDkPCALAzbCUnq/BT3dr+LAYw=","idcard":"GR01dv9mo8bBKFVd+9MsHkVR3nb8LBR4K6Gaci4+BwhF2+hncjMDrtXhOqs4AtPb5Xxuu+dZsH1Rez6W6EAPM7I2BMl1qQLiXOH1QzaUtMt4dHPRuYfg/QSzRLOF+o4AuSb19Bqn1bx+VpR+FF38NUrC1+a0od/8DEThAvQ3w78=","mobile":"G5WUsqbd2y0cZ4JBiSHb1oDkCXZLRRSnFpmjCgBAcHNGQxRo5IXRvqOMfYSkiaJCuEl1V2jXzUdR08DE7/Rp+MNuD6sWp/Zb8JDxbH5DTrfBvr1YeaTw13GhpQYZe59ypxLHUMJqlFd9+i94aGDNFzEfHZPCGUrObJSMe7VKpHc=","businessHours":null,"subscribeChannel":0}
 * @returns {*} fail {"result":"","code":-1,"msg":"当前预约人数较多，请稍后重试！"}
 * @returns {*} success {"result":{"id":null,"realName":"","idcard":"","mobile":"","maskCount":5,"subscribeDate":"2020-03-02","subscribeTime":"中午","orderNo":"481785","pharmacyName":"大连海王星辰医药有限公司依海店","pharmacyAddress":"大连市高新技术产业园区小平岛依海街50-1、2号","pharmacyMobile":"15542662391","pharmcayId":"52","orderStatus":1,"receiveStatus":1,"activityStatus":3,"remark":null,"createTime":"2020-03-01 20:00:57","updateTime":"2020-03-01 20:00:57","idcardSubsidiary":null,"subscribeChannel":0,"businessHours":null},"code":200,"msg":"调用成功"}
 */
export function makeOrder(obj) {
  return request({
    url: "/getMaskMaskorder",
    method: "post",
    data: obj
  });
}
