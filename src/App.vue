<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <div>
      <el-button type="primary" @click="handleOrder">Order Mask</el-button>
    </div>
  </div>
</template>

<script>
import * as moment from "moment";
import { findPharmacy, encruption } from "@/libs/util";
import { makeOrder } from "@/api/order";

export default {
  name: "app",
  data() {
    return {
      orderlist: []
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData () {
      let li = this.$ls.get("lineitems");
      if (!li) {
        this.$ls.set("lineitems", []);
      } else {
        this.orderlist = li;
      }
    },
    async handleOrder() {
      this.getData();
      const lineitems = this.orderlist;
      const subscribeDate = moment()
        .add(1, "d")
        .format("YYYY-MM-DD");
      if (lineitems.length === 0) {
        this.$message("lineitems were not found.");
        return;
      }
      while (lineitems.length > 0) {
        const lineitem = lineitems.shift();
        const pharmacy = findPharmacy(lineitem.pharmacyName);
        if (!pharmacy) {
          this.$message(`${lineitem.pharmacyName} was not found.`);
          continue;
        }
        this.order(
          subscribeDate,
          {
            pharmacyName: pharmacy.serviceName,
            pharmacyAddress: pharmacy.serviceAddress,
            pharmacyMobile: pharmacy.phone,
            pharmcayId: pharmacy.id
          },
          lineitem
        );
      }
      this.$message(`${subscribeDate} All items have been sent.`);
    },
    async order(subscribeDate, pharmacy, form) {
      const {
        pharmacyName,
        pharmacyAddress,
        pharmacyMobile,
        pharmcayId
      } = pharmacy;
      const { realName, idcard, mobile, subscribeTime = "中午" } = form;
      const maxRetry = 300; // 运行最大次数后停止, 可再次点击运行
      let count = 0;
      var queue = [];
      const check = function () {
        if (queue.length > 0) {
          let obj = queue.shift();
          domask(obj)
        }
      };
      const domask = function (target) {
        const payload = {
          maskCount: 10,
          subscribeDate,
          subscribeTime,
          pharmacyName,
          pharmacyAddress,
          pharmacyMobile,
          pharmcayId,
          realName: encruption(realName),
          idcard: encruption(idcard),
          mobile: encruption(mobile),
          businessHours: null,
          subscribeChannel: 0
        };
        makeOrder(payload).then(response => {
          if (response.code === 200) {
            // 调用成功
            if (response.msg == "调用成功") {
              console.log(`${realName} OK!!!`, response.result.orderNo, response.result.createTime);
            } else {
              console.log(`${realName} `, response.result.orderNo, response.msg);
            }
          } else {
            let printflag = false;
            if (response.msg == "您5天内已预约过口罩，不能再次预约") {
              // do nothing
              printflag = true;
            } else if (response.msg == "药店活动已结束") {
              // do nothing
              printflag = true;
              // console.log('欢迎下次再来')
            } else {
              // 当前预约人数较多，请稍后重试！
              if (count <= maxRetry) {
                count++;
                queue.push(target); // 重新加入队列参加循环
              } else {
                console.log(`已经运行了${maxRetry}次请求。`)
              }
            }
            if (printflag) {
              console.log(
                `${realName}`,
                response.result,
                response.code,
                response.msg,
                `${new Date().toLocaleString()}`
              );
            }
            check();
          }
        }).catch(e => {
          console.log('EXCEPTION=', e)
          if (count <= maxRetry) {
            count++;
            queue.push(target); // 重新加入队列参加循环
          } else {
            console.log(`已经运行了${maxRetry}次请求。`)
          }
        });
      };
      count++;
      queue.push(form);
      check();
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
