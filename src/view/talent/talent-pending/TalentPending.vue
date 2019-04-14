<template>
  <Card>
    <div>
      <SearchItem>
        <Select placeholder="请选择跟踪类型" v-model="searchData.type" class="w200" clearable>
          <Option :value="1">电话沟通</Option>
          <Option :value="2">顾问面试（内）</Option>
          <Option :value="3">顾问面试（外）</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Button @click="search" type="primary">查询</Button>
      </SearchItem>
    </div>
    <ManagerView class="talent-manager" ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData" @on-success="successHandler" @on-error="errorHandler">
      <Button type="primary" @click="finishRemind(1)">批量结束跟踪</Button>
    </ManagerView>
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
          <FormItem label="求职方向不离职原因" class="ivu-form-item-required">
            <Input type="textarea" :rows="3" v-model="remind.cause"/>
          </FormItem>
          <FormItem label="薪资架构" class="ivu-form-item-required">
            <Input v-model="remind.salary"/>
          </FormItem>
        </div>
        <div v-if="remind.type == 3">
          <FormItem label="面试时间" class="ivu-form-item-required">
            <DatePicker type="datetime" placeholder="日期" v-model="remind.meetTime"></DatePicker>
          </FormItem>
          <FormItem label="面试地点" v-if="[2,3].indexOf(remind.type) > -1" class="ivu-form-item-required">
            <Input v-model="remind.meetAddress"/>
          </FormItem>
        </div>
        <FormItem label="人才状态：" prop="status">
          <Select v-model="remind.status">
            <Option v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="下次跟踪类别">
          <Select v-model="remind.nextType">
            <Option :value="0">请选择</Option>
            <Option :value="1">电话</Option>
            <Option :value="2">顾问面试（内）</Option>
            <Option :value="3">顾问面试（外）</Option>
          </Select>
        </FormItem>
        <FormItem label="下次联系时间">
          <DatePicker type="datetime" placeholder="日期" v-model="remind.nextRemindTime"></DatePicker>
        </FormItem>
        <!--<FormItem label="提醒对象">-->
          <!--<Select v-model="remind.adviserId" placeholder="请选择">-->
            <!--<Option v-for="(user, index) of teamUserList" :value="user.id" :key="'user'+index">{{user.name}}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
      </Form>
    </ModalUtil>
  </Card>
</template>

<script>
  import { talentStatus } from "../../../libs/constant";
  import { getUserId, getStatusRender, toggleShow, getDateTime, getRenderList, globalSearch } from "../../../libs/tools";
  import { talentPendingList } from "../../../api/count";
  import { addRemind, finishRemind } from "../../../api/talent";

  export default {
    name: "TalentPending",
    data() {
      return {
        show: false,
        talentStatus: talentStatus,
        searchData: {
          userId: null,
          type: null
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            title: '人才名称',
            key: 'talentName',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                class: {
                  talent: !!params.row.followUserId
                }
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  class: {
                    'cl-primary': true,
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.talentId}});
                    }
                  }
                }, params.row.name)
              ]);
            }
          },
          {
            title: '人才状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.talentStatus);
            }
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '本次跟踪状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '跟踪时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          },
          {
            title: '跟踪类型',
            align: 'center',
            render: (h, params) => {
              const v = params.row.type;
              return h('span', v == 1 ? '电话沟通' : v == 2 ? '顾问面试内' : '顾问面试外');
            }
          },
          {
            title: '跟踪内容',
            align: 'center',
            render: (h, params) => {
              switch (params.row.type) {
                case 1:
                  return h('span', `跟踪记录：${params.row.remark}`);break;
                case 2:
                  const data = [`人才基本情况：${params.row.situation}`, `不离职原因：${params.row.cause}`, `薪资架构：${params.row.salary}`];
                  return getRenderList(h, JSON.stringify(data));
                  break;
                case 3:
                  const list = [`面试时间：${getDateTime(params.row.meetTime)}`, `面试地点：${params.row.meetAddress}`];
                  return getRenderList(h, JSON.stringify(list));
              }
            }
          },
          {
            title: '进展中项目数',
            align: 'center',
            key: 'projectCount'
          },
          {
            title: '操作',
            align: 'center',
            width: 150,
            render: (h, params) => {
              const followUserId = params.row.followUserId;
              return h('div', [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: followUserId && followUserId != this.searchData.userId || !!params.row.projectCount
                  },
                  on: {
                    click: () => {
                      this.talentType = !!params.row.followUserId;
                      this.showRemindModal(params.row.talentId, params.row.id);
                    }
                  }
                }, '跟进'),
                h('Button', {
                  props: {
                    type: 'warning',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.finishId = params.row.id;
                      this.finishRemind(2);
                    }
                  }
                }, '结束跟进')
              ]);
            }
          }
        ],
        teamUserList: [],
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
          customerId: null
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择类型', trigger: 'change' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
          ],
        },
        finishId: null, // 结束跟进id
      }
    },
    methods: {
      search() {
        globalSearch(this);
      },
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
          adviserId: null,
          followRemindId: null,
          talentType: null,
          customerId: null
        };
      },
      toggleShow(key, flag) {
        toggleShow(this, key, flag);
      },
      finishRemind(flag) {
        this.$Modal.confirm({
          title: '结束跟进确认',
          content: '您确认要结束跟进选择的跟踪记录吗?',
          onOk: () => {
            this.$refs['manager'].emitManagerHandler('finish', {
              params: flag == 1 ? null : [this.finishId],
              isBatch: flag == 1
            })
          }
        })
      },
      showRemindModal(talentId, id) {
        this.remind.talentId = talentId;
        this.remind.followRemindId = id;
        this.toggleShow('remind');
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
            if (talentType && (!params.nextType || !params.nextRemindTime)) {
              this.$Message.warning('专属人才必须选择下次跟踪类别和时间');
              return false;
            }
            params.createUserId = this.searchData.userId;
            this.$refs['manager'].emitManagerHandler('addRemind', {
              params
            });
          }
        })
      },
      successHandler() {
        this.show = false;
        toggleShow(this, 'remind', false);
      },
      errorHandler() {
        this.show = false;
      }
    },
    provide() {
      return {
        handlers: {
          search: talentPendingList,
          finish: finishRemind,
          addRemind: addRemind
        }
      }
    },
    created() {
      this.searchData.userId = getUserId();
    },
  }
</script>

<style scoped>

</style>
