<template>
  <!--  添加跟踪记录 -->
  <ModalUtil ref="remind" title="添加跟踪记录" @reset="resetRemind" @on-ok="addRemind" :loading="show">
    <Form ref="addRemind" :model="remind" :rules="remindRule" :label-width="120">
      <FormItem label="本次跟踪类别" prop="type">
        <Select v-model="remind.type">
          <Option :value="1">电话</Option>
          <Option :value="2">顾问面试（内）</Option>
          <Option :value="3">顾问面试（外）</Option>
        </Select>
      </FormItem>
      <FormItem label="沟通记录" v-if="remind.type == 1" class="ivu-form-item-required">
        <Input type="textarea" :rows="3" v-model="remind.remark"/>
      </FormItem>
      <div v-if="remind.type == 2 || remind.type == 3">
        <FormItem label="候选人基本情况" class="ivu-form-item-required">
          <Input type="textarea" :rows="3" v-model="remind.situation"/>
        </FormItem>
        <FormItem label="求职方向离职原因" class="ivu-form-item-required">
          <Input type="textarea" :rows="3" v-model="remind.cause"/>
        </FormItem>
        <FormItem label="薪资架构" class="ivu-form-item-required">
          <Input v-model="remind.salary"/>
        </FormItem>
      </div>
      <div v-if="remind.type == 3">
        <FormItem label="面试时间" prop="meetTime" class="ivu-form-item-required">
          <DatePicker type="datetime" placeholder="日期" v-model="remind.meetTime"></DatePicker>
        </FormItem>
        <FormItem label="面试地点" prop="meetAddress" v-if="[2,3].indexOf(remind.type) > -1" class="ivu-form-item-required">
          <Input v-model="remind.meetAddress"/>
        </FormItem>
      </div>
      <FormItem label="人才状态：" prop="status">
        <Select v-model="remind.status">
          <Option :disabled="item.value == 10 && !!offerCount" v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">
            {{ item.label }}<span v-show="!!offerCount">{{`（已关联该项目）`}}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem label="项目：" prop="projectId" v-if="remind.status == 10" class="ivu-form-item-required">
        <Select v-model="remind.projectId" placeholder="请选择项目" filterable clearable>
          <Option :disabled="talentProjects.indexOf(item.id) > -1" v-for="(item, index) of projects" :value="item.id" :key="'project' + index">
            {{ item.name }}{{`（${item.customerName}）`}}
            <span v-show="talentProjects.indexOf(item.id) > -1">{{`（已关联该项目）`}}</span>
          </Option>
        </Select>
      </FormItem>
      <FormItem label="下次跟踪类别" prop="remindTypeId">
        <Select v-model="remind.nextType">
          <Option :value="0">请选择</Option>
          <Option :value="1">电话</Option>
          <Option :value="2">顾问面试（内）</Option>
          <Option :value="3">顾问面试（外）</Option>
        </Select>
      </FormItem>
      <FormItem label="下次联系时间" prop="remindTime" >
        <DatePicker type="datetime" placeholder="日期" v-model="remind.nextRemindTime"></DatePicker>
      </FormItem>
    </Form>
  </ModalUtil>
</template>

<script>
  import {getUserId, getUserInfoByKey, toggleShow} from "../../libs/tools";
  import {talentStatus} from "../../libs/constant";
  import {openByUserId} from "../../api/project";
  import {addRemind} from "../../api/talent";

  export default {
    name: "TalentRemind",
    props: {
      offerCount: {
        type: Number
      },
      talentId: {
        type: Number
      },
      talentType: {
        type: Number
      },
      talentProjects: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        show: false,
        talentStatus: talentStatus,
        projects: [], // 对用户开放的项目
        remind: { // 添加提醒条件
          type: null, // 本次跟踪类别
          status: null, // 人才状态
          remark: '', // 跟踪记录
          nextType: null, // 下次跟踪类别
          nextRemindTime: null, // 下次沟通时间
          situation: '', // 候选人基本情况
          cause: '', // 不离职原因
          salary: '', // 薪资架构
          meetTime: null, // 面试时间
          meetAddress: null, // 面试地点
          talentId: null,
          followRemindId: null,
          projectId: null,
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择类型', trigger: 'change' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
          ],
        },
      }
    },
    methods: {
      resetRemind() {
        this.remind = {
          type: null, // 本次跟踪类别
          status: null, // 人才状态
          remark: '', // 跟踪记录
          nextType: null, // 下次跟踪类别
          nextRemindTime: null, // 下次沟通时间
          situation: '', // 候选人基本情况
          cause: '', // 不离职原因
          salary: '', // 薪资架构
          meetTime: null, // 面试时间
          meetAddress: null, // 面试地点
          talentId: null,
          followRemindId: null,
          projectId: null,
        }
      },
      addRemind() {
        this.$refs['addRemind'].validate(valid => {
          if (valid) {
            const talentType = this.talentType;
            const params = this.remind;
            if (params.type == 1 && !params.remark) {
              this.$Message.warning('电话面试需要填写沟通记录');
              return false;
            }
            if (params.type == 2 && (!params.salary || !params.situation || !params.cause)) {
              this.$Message.warning('室内面试需要填写候选人基本情况、不离职原因和薪资架构');
              return false;
            }
            if (params.type == 3 && (!params.meetTime || !params.meetAddress || !params.salary || !params.situation || !params.cause)) {
              this.$Message.warning('室外面试需要填写面试时间、地点、基本情况、离职原因和薪资架构');
              return false;
            }
            if ((params.nextRemindTime || params.nextType) && (!params.nextRemindTime || !params.nextType)) {
              this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
              return false;
            }
            if (talentType == 1 && (!params.nextType || !params.nextRemindTime)) {
              this.$Message.warning('专属人才必须选择下次跟踪类别和时间');
              return false;
            }
            if (params.status == 10 && !params.projectId) {
              this.$Message.warning('请选择推荐客户关联的项目');
              return false;
            }
            params.createUserId = getUserId();
            params.roleId = getUserInfoByKey('roleId');
            params.talentId = this.talentId;
            this.show = true;
            addRemind(params).then(data => {
              this.show = false;
              this.$emit('on-ok', this.talentId, params.status, params.projectId);
              toggleShow(this, 'remind', false);
              // if (!!params.projectId) {
              //   this.$refs['manager'].list[this.remindIndex].projects.push(params.projectId);
              // }
            }).catch(data => { this.show = false;})
          }
        })
      },
      toggleShow(flag) {
        toggleShow(this, 'remind', flag);
      }
    },
    created() {
      openByUserId({ userId: getUserId() }).then(data => {
        this.projects = data || [];
      }).catch(data => {});
    },
  }
</script>

<style scoped>

</style>
