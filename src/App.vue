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
import { findPharmacy, encruption } from "@/libs/util";//, delay
import { makeOrder } from "@/api/order";

export default {
  name: "app",
  data() {
    return {
      orderstatus: {},
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
      this.orderstatus = {};

      // for (const lineitem of lineitems) {
      //   const pharmacy = findPharmacy(lineitem.pharmacyName);

      //   if (!pharmacy) {
      //     this.$message(`${lineitem.pharmacyName} was not found.`);
      //     continue;
      //   }
      //   this.orderstatus[lineitem.idcard] = 0;

      //   this.order(
      //     subscribeDate,
      //     {
      //       pharmacyName: pharmacy.serviceName,
      //       pharmacyAddress: pharmacy.serviceAddress,
      //       pharmacyMobile: pharmacy.phone,
      //       pharmcayId: pharmacy.id
      //     },
      //     lineitem
      //   );
      // }

      while (lineitems.length > 0) {
        const lineitem = lineitems.shift();
        const pharmacy = findPharmacy(lineitem.pharmacyName);

        if (!pharmacy) {
          this.$message(`${lineitem.pharmacyName} was not found.`);
          continue;
        }
        this.orderstatus[lineitem.idcard] = 0;

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

      this.$message(`${subscribeDate} done.`);
    },
    async order(subscribeDate, pharmacy, form) {
      const {
        pharmacyName,
        pharmacyAddress,
        pharmacyMobile,
        pharmcayId
      } = pharmacy;
      const { realName, idcard, mobile } = form;

      var queue = [];
      const check = function () {
        if (queue.length > 0) {
          let obj = queue.shift();
          domask(obj)
        }
      };
      const domask = function (target) {
        const payload = {
          maskCount: 5,
          subscribeDate,
          subscribeTime: "中午",
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
              console.log(`${realName} `, response.result, response.msg);
            }
          } else {
            if (response.msg == "您5天内已预约过口罩，不能再次预约") {
              // do nothing
            } else if (response.msg == "药店活动已结束") {
              // do nothing
              // console.log('欢迎下次再来')
            } else {
              queue.push(target); // 重新加入队列参加循环
            }
            console.log(
              `${realName}`,
              response.result,
              response.code,
              response.msg,
              `${new Date().toLocaleString()}`
            );
            check();
          }
        });
      };
      queue.push(form);
      check();

      // let count = 0;
      // const maxRetry = 2;
      // while (count < maxRetry) {
      //   if (this.orderstatus[idcard] === 1) {
      //     break;
      //   }
      //   const payload = {
      //     maskCount: 5,
      //     subscribeDate,
      //     subscribeTime: "中午",
      //     pharmacyName,
      //     pharmacyAddress,
      //     pharmacyMobile,
      //     pharmcayId,
      //     realName: encruption(realName),
      //     idcard: encruption(idcard),
      //     mobile: encruption(mobile),
      //     businessHours: null,
      //     subscribeChannel: 0
      //   };

      //   makeOrder(payload).then(response => {
      //     if (response.code === 200) {
      //       this.orderstatus[idcard] = 1;
      //       // 调用成功
      //       if (response.msg == "调用成功") {
      //         console.log(`${realName} OK!!!`, response.result.orderNo, response.result.createTime);
      //       } else {
      //         console.log(`${realName} `, response.result, response.msg);
      //       }
      //     } else {
      //       if (response.msg == "您5天内已预约过口罩，不能再次预约") {
      //         this.orderstatus[idcard] = 1;
      //       }

      //       console.log(
      //         `${realName}`,
      //         response.result,
      //         response.code,
      //         response.msg,
      //         `${new Date().toLocaleString()} ${count}`
      //       );
      //     }
      //   });
      //   await delay(5000);
      //   count++;
      // }
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
