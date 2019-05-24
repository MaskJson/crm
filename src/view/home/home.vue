<template>
  <Card>
    <Row class="container">
      <Col span="6" class="pd-10" v-if="roleId != 8">
        <div class="radius4 border pd-10">
          <h3 class="cursor" @click="goto('/talent/talent-pending')">人才常规跟踪待办项：<span class="cl-primary">{{count.talentFirst + count.talentSecond + count.talentThird}}</span></h3>
          <h3 class="cursor mt-10" @click="goto('/customer/customer-pending')">客户常规跟踪待办项：<span class="cl-primary">{{count.customerFirst + count.customerSecond + count.customerThird}}</span></h3>
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">电话沟通：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '1')">{{count.talentFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">顾问面试（内）：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '2')">{{count.talentSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">顾问面试（外）：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '3')">{{count.talentThird}}</span>-->
          <!--</p>-->
        </div>
      </Col>
      <!--<Col span="4" class="pd-10" v-if="roleId != 8">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto('/customer/customer-pending')">客户常规跟踪待办项</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">电话沟通：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '1')">{{count.customerFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">拜访客户：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '2')">{{count.customerSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">客户上门：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '3')">{{count.customerThird}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
      <Col span="4" class="pd-10">
        <div class="radius4 border pd-10">
          <h3 class="cursor" @click="goto2('/project/progress-pending', '1')">项目启动阶段</h3>
          <p class="mt-10">
            <span class="inline-block">进展中：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1', '1')">{{count.qiDongFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">停滞中：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1',  '2')">{{count.qiDongSecond}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">缓慢：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1',  '3')">{{count.qiDongThird}}</span>
          </p>
        </div>
      </Col>
      <Col span="4" class="pd-10">
        <div class="radius4 border pd-10">
          <h3 class="cursor" @click="goto2('/project/progress-pending', '2')">项目攻坚阶段</h3>
          <p class="mt-10">
            <span class="inline-block">进展中：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '2', '1')">{{count.gongJianFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">缓慢：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '2', '2')">{{count.gongJianSecond}}</span>
          </p>
        </div>
      </Col>
      <Col span="4" class="pd-10">
        <div class="radius4 border pd-10">
          <h3 class="cursor" @click="goto2('/project/progress-pending', '3')">项目收尾阶段</h3>
          <p class="mt-10">
            <span class="inline-block">签订offer：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '4')">{{count.shouWeiFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">入职：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '5')">{{count.shouWeiSecond}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">保证期：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '6')">{{count.shouWeiThird}}</span>
          </p>
        </div>
      </Col>
      <Col span="4" class="pd-10">
        <div class="radius4 border pd-10">
          <h3 class="cursor" @click="goto2('/project/progress-pending', '4')">项目结束</h3>
          <p class="mt-10">
            <span class="inline-block">通过保证期：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '4', '7')">{{count.jieShuFirst}}</span>
          </p>
          <p class="mt-10">
            <span class="inline-block">淘汰：</span>
            <span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '4', '8')">{{count.jieShuSecond}}</span>
          </p>
        </div>
      </Col>
    </Row>
    <Row v-show="list.length > 0">
      <h2>项目进展</h2>
      <TalentProgress flag="yes" home="yes" :project-talents="list" @change="getProjectTalent"/>
    </Row>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import {getUserId, getUserInfoByKey} from "../../libs/tools";
  import { homeCount } from "../../api/count";
  import {getProjectTalentByStatus} from "../../api/project";
  import TalentProgress from './../project/project-detail/components/TalentProcess';

  export default {
    name: "home",
    components: {
      TalentProgress
    },
    data() {
      return {
        show: false,
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        count: {
          talentFirst: 0,
          talentSecond: 0,
          talentThird: 0,
          customerFirst: 0,
          customerSecond: 0,
          customerThird: 0
        },
        list: []
      }
    },
    methods: {
      goto(path, type) {
        this.$router.push({path, query: {type}});
      },
      goto2(path, type, status) {
        this.$router.push({path, query: {type, status}});
      },
      getProjectTalent() {
        this.show = true;
        getProjectTalentByStatus({
          userId: this.userId,
        }).then(data => {
          this.show = false;
          this.list = data || [];
        }).catch(data => {this.show = false;})
      },
    },
    created() {
      this.show = true;
      homeCount({ userId: this.userId, roleId: this.roleId }).then(data => {
        this.show = false;
        this.count = data || {};
      }).catch(data => {this.show = false;});
      this.getProjectTalent();
    }
  }
</script>

<style scoped>
  .container {
    min-height: 190px;
  }
  .container .pd-10 {
    height: 100%;
  }
</style>
