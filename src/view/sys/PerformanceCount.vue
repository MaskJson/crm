<template>
  <div class="center border pt-10 pb-10 mb-10">
    <span class="mr-30">专属人才总数：{{map.zhuanshu}}</span>
    <span class="mr-30">计划沟通总量：{{map.remind}}</span>
    <span class="mr-30">人才地图总数：{{map.map}}</span>
    <span class="mr-30">预约率：{{!!map.map ? (map.remind/map.map*100).toFixed(2) : 0}}%</span>
  </div>
</template>

<script>
  import {getUserId, getUserInfoByKey} from "../../libs/tools";
  import {getPerformanceCount} from "../../api";

  export default {
    name: "PerformanceCount",
    props: {
      memberId: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        map: {
          map: 0,
          zhuanshu: 0,
          remind: 0
        }
      }
    },
    methods: {
      init() {
        getPerformanceCount({
          userId: this.userId,
          roleId: this.roleId,
          memberId: this.memberId == -1 ? null : this.memberId
        }).then(data => {
          this.map = data || {};
        }).catch(res => {

        })
      }
    },
    created() {
      this.init();
    }
  }
</script>

<style scoped>

</style>
