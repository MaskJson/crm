<template>
    <div>
      <div class="info-item border mB10">
        <div class="pd-10 bgf2 borderB">基本信息</div>
        <Row class="pd-10">
          <Col span="12">
            <p><span class="label">电话：</span><span >{{entity.phone}}</span></p>
            <p><span class="label">邮箱：</span><span >{{entity.email}}</span></p>
            <p><span class="label">学历：</span><span>{{entity.education}}</span></p>
            <p><span class="label">目前公司：</span><span>{{workDetail?workDetail.company:'--'}}</span></p>
            <p><span class="label">目前职位：</span><span>{{workDetail?workDetail.position:'--'}}</span></p>
            <p><span class="label">部门：</span><span>{{workDetail?workDetail.department:'--'}}</span></p>
            <p><span class="label">所在城市：</span><span>{{entity.city | cityFilter}}</span></p>
            <p><span class="label">意向城市：</span><span>{{entity.intentionCity | cityFilter}}</span></p>
            <p><span class="label">语言能力：</span><span>{{language}}</span></p>
          </Col>
          <Col span="12">
            <p><span class="label">年薪：</span><span>{{entity.salary}}</span><span v-show="entity.salary">万元</span></p>
            <p><span class="label">出生年月：</span><span>{{getDateTime(entity.birthday)}}</span></p>
            <p><span class="label">性别：</span><span>{{entity.sex == 0 ? '男' : '女'}}</span></p>
            <p><span class="label">创建者：</span><span>{{entity.createUser}}</span></p>
            <p><span class="label">创建日期：</span><span>{{getDateTime(entity.createTime)}}</span></p>
            <p><span class="label">最近联系：</span><span>{{getDateTime(entity.concatTime)}}</span></p>
            <p><span class="label">职能：</span><span>{{entity.aptness | industryFilter}}</span></p>
            <p><span class="label">行业：</span><span>{{entity.industry | industryFilter}}</span></p>
            <p><span class="label">状态：</span><span>{{entity.status | statusFilter}}</span></p>
          </Col>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">工作背景</div>
        <Row class="pd-10" v-if="workDetail.company">
          <Col span="6">
            <span class="mr-5">{{workDetail.startTime || '--'}}</span>  -
            <span class="ml-5">{{workDetail.status ? '至今' : workDetail.endTime || '--'}}</span>
          </Col>
          <Col span="18">
            <p>
              <span class="bold mr-20">公司名称：{{workDetail.company || '--'}}</span>
              <span class="mr-20">职位：{{workDetail.position || '--'}}</span>
              <span>部门：{{workDetail.department || '--'}}</span>
            </p>
            <p class="mt-10">
              <span class="mr-20">评价：{{workDetail.remark || '--'}}</span>
              <span>工作业绩：{{workDetail.performance || '--'}}</span>
            </p>
          </Col>
        </Row>
        <Row class="pd-10" v-else>
          <span>不在职</span>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">项目经历</div>
        <Row class="pd-10">
          <div v-html="entity.projectExperience"></div>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">教育经历</div>
        <Row class="pd-10">
          <div v-html="entity.educationExperience"></div>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">职业技能</div>
        <Row class="pd-10">
          <div v-html="entity.occupationSkill"></div>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">评价</div>
        <Row class="pd-10">
          <div v-html="entity.evaluate"></div>
        </Row>
      </div>
      <div class="info-item border mb-10">
        <div class="pd-10 bgf2 borderB">备注</div>
        <Row class="pd-10">
          <div v-html="entity.remark"></div>
        </Row>
      </div>
    </div>
</template>

<script>
  import { jsonArray, getStatusRender, getDateTime } from "../../../../libs/tools";
  import { language } from "../../../../libs/constant";

  export default {
    name: "detail",
    props: {
      entity: {
        type: Object,
        default: () => {
          return {};
        }
      }
    },
    computed: {
      language() {
        const index = language.findIndex(item => item.value == this.entity.language);
        return index > -1 ? language[index].label : '--';
      },
      workDetail() {
        let working = null;
        let workList = this.entity.experienceList || [];
        for (let i=0; i < workList.length; i++) {
          if (workList[i].status) {
            working = workList[i];
            break;
          }
        }
        if (!working && workList.length) {
          working = workList[0];
        }
        return working || {};
      },
    },
    filters: {
      cityFilter(v) {
        return (v || []).join(' ');
      },
      industryFilter(v) {
        return (v || []).join('、');
      },
      statusFilter(v) {
        return getStatusRender(false, v);
      }
    },
    methods: {
      getDateTime: getDateTime
    }
  }
</script>

<style scoped lang="less">
  @import "../../../../assets/css/_props.less";
  @import "../../../../assets/css/_mixin.less";
  @import "../../../../assets/css/favoriteDrawer.less";
  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
  }
  .talent-detail{
  .flex-row{
    justify-content: space-between;
  .user{
    font-size: 24px;
    font-weight: 600;
  .id{
    padding-left: 10px;
  }
  }
  }
  .btn-group{
  .ivu-btn{
    margin-left: 10px;
  }
  }
  .item-title{
    font-size: 24px;
    font-weight: 600;
  }
  .sub-card{
    border: none;
    border-radius: 0;
    background: #b9b9b9;
  }
  }
  .download {
    width: 180px;
    height: 120px;
    border-radius: 4px;
    transition: all .2s;
  }
  .download:hover {
    border-color: #348EED;
    color: #348EED;
  }
  .pd100{
    padding: 100px;
  }
</style>
