<template>
  <Card>
    <Tabs v-model="status" :animated="false">
      <TabPane label="我的人才地图" name="0"></TabPane>
      <TabPane label="收藏的人才地图" name="1"></TabPane>
      <TabPane label="推荐的人才地图" name="2"></TabPane>
      <TabPane label="面试的人才地图" name="3"></TabPane>
      <TabPane label="offer人才地图" name="4"></TabPane>
      <TabPane label="成功人才地图" name="5"></TabPane>
    </Tabs>
    <div class="mt-20">

    </div>
  </Card>
</template>

<script>
  import { talentMap } from "../../../api/count";
  import { getUserId } from "../../../libs/tools";

  export default {
    name: "TalentMap",
    data() {
      return {
        status: '0',
        list: []
      }
    },
    methods: {
      getTalentMap() {
        this.show = true;
        talentMap({ userId: getUserId() }).then(data => {
          this.show = false;
        }).catch(data => {this.show = false;})
      },
      getStatusTalentMap() {

      }
    },
    created() {
      this.getTalentMap();
    }
  }
</script>

<style scoped>

</style>
