<!-- 项目详情 -->
<template>
  <div class="project-info">
    <div class="info-item border mb-10">
      <div class="pd-10 bgf2 borderB">项目基本要求</div>
      <Row class="pd-10">
        <Col class="flex">
          <div>
            创建者：<span class="mr-20">{{ entity.name }}</span>
            创建时间：<span class="mr-20">{{ getDateTime(entity.createTime) }}</span>
          </div>
        </Col>
        <Col>
          <div>
            首推时间：<span class="mr-20">{{ getDateTime(entity.firstApplyTime) }}</span>
            计划完成时间：<span>{{ getDateTime(entity.finishTime) }}</span>
          </div>
        </Col>
        <Col>
          <div>项目优先级：<span>{{ entity.priority == 1 ? '高' : entity.priority == 2 ? '中' : '低' }}</span></div>
        </Col>
        <Col>
          <div>
            项目需求：
            <span class="ml-10 mr-10">行业：{{(entity.industry || []).join('、')}}</span>
            <span class="ml-20">职能：{{(entity.aptness || []).join('、')}}</span>
          </div>
        </Col>
        <Divider dashed></Divider>
        <Col class="flex">
          <div class="w300 line">名企背景：<span>{{ getBackground(false, entity.background) || '无' }}</span></div>
          <div class="w300 line">项目费用：<span v-if="entity.fee">{{ entity.fee }} 万</span><span v-else>--</span></div>
          <div class="w300 line">是否保密进行：<span>{{ entity.isSecrecy == '0'?'否':'是' }}</span></div>
        </Col>
        <Col class="flex">
          <div class="w300 line">学历：<span>{{ getEducation(false, entity.education) || '无' }}</span></div>
          <div class="w300 line">保证期：<span>{{ getQuality(false, entity.qualityType) }}</span></div>
          <!--<div>客户内部开放时间：<span>{{ entity.updateTime }}</span></div>-->
        </Col>
        <Col class="flex">
          <div class="w300 line">语言能力：<span>{{ getLanguage(false, entity.language) }}</span></div>
          <div>
            年薪范围：
            <span v-show="entity.salaryStart">{{ entity.salaryStart || '' }}万</span>
            <span class="ml5 mR5">-</span>
            <span v-show="entity.salaryEnd">{{ entity.salaryEnd || '' }}万</span>
          </div>
        </Col>
        <Col class="flex">
          <div class="w300 line">年龄要求：<span>{{ entity.ageStart }} - {{ entity.ageEnd }}</span></div>
          <div>是否独家：<span>{{ entity.isOneself ? '是' : '否'}}</span></div>
        </Col>
        <Col class="flex">
          <div class="w300 line">工作年限：<span>{{ entity.yearStart }} - {{ entity.yearEnd }}</span></div>
          <div>新增/替换：<span>{{ entity.type ? '新增' : '替换' }}</span></div>
        </Col>
      </Row>
    </div>
    <!--<div class="info-item border mb-10">-->
      <!--<div class="pd-10 bgf2 borderB">项目成员</div>-->
      <!--<div class="pd-10">-->
        <!--<div v-if="teamMember && teamMember.length>0">-->
          <!--<p v-for="item of teamMember">-->
            <!--<span class="w200">顾问ID：{{item.plId}}</span>-->
            <!--<span class="w200">顾问名称：{{item.plName}}</span>-->
          <!--</p>-->
        <!--</div>-->
        <!--<div v-else>没有成员数据</div>-->
      <!--</div>-->
    <!--</div>-->
    <div class="info-item border mb-10">
      <div class="pd-10 bgf2 borderB">职位基本情况</div>
      <Row class="pd-10">
        <Col>
          <div>{{ entity.situation }}</div>
        </Col>
      </Row>
    </div>
    <div class="info-item border mb-10">
      <div class="pd-10 bgf2 borderB">职位亮点及优势</div>
      <Row class="pd-10">
        <Col>
          <div>{{ entity.advantage }}</div>
        </Col>
      </Row>
    </div>
    <div class="info-item border mb-10">
      <div class="pd-10 bgf2 borderB">面试流程及领导介绍</div>
      <Row class="pd-10">
        <Col>
          <div>{{ entity.introduce }}</div>
        </Col>
      </Row>
    </div>
    <div class="info-item border mb-10">
      <div class="pd-10 bgf2 borderB">更多详情信息</div>
      <Row class="pd-10">
        <Col>
          <div>{{ entity.situation }}</div>
        </Col>
      </Row>
    </div>
  </div>
</template>

<script>

import { getDateTime, getProjectInfoUtil, getBackground, getEducation, getLanguage, getQuality } from "../../../../libs/tools";
import { getProjectInfo } from "../../../../api/project";

export default {
  name: 'project-info',
  data () {
    return {
      teamMember: [], // 项目成员
      entity: {

      }
    }
  },
  methods: {
    getDateTime: getDateTime,
    getBackground: getBackground,
    getEducation: getEducation,
    getLanguage: getLanguage,
    getQuality: getQuality,
    // 获取项目成员
    getTeamMember() {

    },
    init() {
      this.$emit('show');
      getProjectInfo({id: this.id}).then(data => {
        this.entity = getProjectInfoUtil(data || {});
        this.$emit('on-change', this.entity);
      }).catch(data => {
        this.$emit('on-change', {});
      });
    }
  },
  created() {
    this.id = Number(this.$route.query.id);
    this.init();
  },
  mounted () {
    this.getTeamMember();
  }
}
</script>

<style lang="less" scoped>
@import "../../../../assets/css/_props";
@import "../../../../assets/css/_mixin";
.project-info{
  .progress-wrap{
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .progress-detail{
      display: flex;
      flex-direction: row;
    }
  }
  .progress-item{
    flex-direction: row;
  }
  .progress-detail{

  }
}
</style>
