<template>
  <Card>
    <Row class="container">
      <Col span="8" class="pd-10" v-if="roleId != 8">
        <div class="radius4 border pd-10">
          <h3>人才常规跟踪待办项</h3>
          <p class="mt-10">
            <span class="inline-block">电话沟通：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '1')">{{count.talentFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">顾问面试（内）：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '2')">{{count.talentSecond}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">顾问面试（外）：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '3')">{{count.talentThird}}</span>
          </p>
        </div>
      </Col>
      <Col span="8" class="pd-10" v-if="roleId == 3">
        <div class="radius4 border pd-10">
          <h3>客户常规跟踪待办项</h3>
          <p class="mt-10">
            <span class="inline-block">电话沟通：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '1')">{{count.customerFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">拜访客户：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '2')">{{count.customerSecond}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">客户上门：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '3')">{{count.customerThird}}</span>
          </p>
        </div>
      </Col>
      <Col span="8" class="pd-10" v-if="[2,3,6].indexOf(roleId) > -1">
        <div class="radius4 border pd-10">
          <h3>项目进展提醒</h3>
          <p class="mt-10">
            <span class="inline-block">启动阶段：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/project/progress-remind', '1')">{{count.qiDong}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">攻坚阶段：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/project/progress-remind', '2')">{{count.gongJian}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">收尾阶段：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/project/progress-remind', '3')">{{count.shouWei}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">项目结束：</span>
            <span class="ml-10 cl-primary cursor" @click="goto('/project/progress-remind', '4')">{{count.jieShu}}</span>
          </p>
        </div>
      </Col>
    </Row>
  </Card>
</template>

<script>
  import {getUserId, getUserInfoByKey} from "../../libs/tools";
  import { homeCount } from "../../api/count";

  export default {
    name: "home",
    data() {
      return {
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        count: {

        }
      }
    },
    methods: {
      goto(path, type) {
        this.$router.push({path, query: {type}});
      }
    },
    created() {
      homeCount({ userId: this.userId, roleId: this.roleId }).then(data => {
        this.count = data || {};
      }).catch(data => {})
    }
  }
</script>

<style scoped>
  .container {
    height: 190px;
  }
  .container .pd-10 {
    height: 100%;
  }
</style>
