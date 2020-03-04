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
import { findPharmacy, encruption, delay } from "@/libs/util";
import { makeOrder } from "@/api/order";

export default {
  name: "app",
  data() {
    return {
      orderstatus: {}
    };
  },
  created() {
    if (!this.$ls.get("lineitems")) {
      this.$ls.set("lineitems", []);
    }
  },
  methods: {
    async handleOrder() {
      const lineitems = this.$ls.get("lineitems");
      const subscribeDate = moment()
        .add(1, "d")
        .format("YYYY-MM-DD");

      if (lineitems.length === 0) {
        this.$message("lineitems were not found.");
        return;
      }
      this.orderstatus = {};

      for (const lineitem of lineitems) {
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
      const maxRetry = 1;
      const {
        pharmacyName,
        pharmacyAddress,
        pharmacyMobile,
        pharmcayId
      } = pharmacy;
      const { realName, idcard, mobile } = form;
      let count = 0;

      while (count < maxRetry) {
        if (this.orderstatus[idcard] === 1) {
          break;
        }
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
        // sync
        // const response = await makeOrder(payload);
        // if (response.code === 200) {
        //   console.log(response.result);
        //   this.$message(`${realName} ordered done.`);
        //   break;
        // } else {
        //   console.log(response.msg);
        //   console.log(`${new Date().toLocaleString()} ${count}`);
        //   await delay(200);
        // }
        // async
        makeOrder(payload).then(response => {
          if (response.code === 200) {
            this.orderstatus[idcard] = 1;
            console.log(`${realName} OK!!!`, response.result, response.msg);
          } else {
            if (response.msg == "您5天内已预约过口罩，不能再次预约") {
              this.orderstatus[idcard] = 1;
            }
            console.log(
              `${realName}`,
              response.result,
              response.code,
              response.msg,
              `${new Date().toLocaleString()} ${count}`
            );
          }
        });
        await delay(500);
        count++;
      }
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
