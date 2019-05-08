<!-- 人才进展情况 -->
<template>
  <div class="talent-progress">
    <Tabs v-model="status">
      <TabPane v-for="(tab, index) of projectTalentStatus" :key="'tab'+index" :label="tab.label" :name="tab.value"></TabPane>
    </Tabs>
    <Table :data="list" :columns="column" border></Table>

    <ModalUtil ref="remind" :title="(projectTalentRemindStatus[projectTalentRemindStatus.findIndex(item => item.id == actionData.type)] || {}).name" :loading="show" :width="600" @on-ok="addRemind">
      <Form ref="form" :model="actionData" :label-width="110">
        <FormItem label="本次跟踪状态" prop="remindType" class="hide">
          <Select v-model="actionData.type" :disabled="true">
            <Option v-for="(type, index) of projectTalentRemindStatus" :value="type.id" :key="'remindType'+index">{{type.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="候选人">
          <span>{{actionData.talentName}}</span>
        </FormItem>
        <div v-if="[2,4,8].indexOf(actionData.type) > -1">
          <FormItem label="面试时间" class="ivu-form-item-required">
            <DatePicker v-model="actionData.interviewTime"/>
          </FormItem>
          <FormItem label="提醒对象">
            <Input v-model="nickName" readonly/>
          </FormItem>
          <FormItem label="面试官">
            <Input v-model="actionData.interviewTone"/>
          </FormItem>
          <FormItem label="终试">
            <Checkbox v-model="actionData.isLast" />是
          </FormItem>
        </div>
        <div v-if="actionData.type == 10">
          <FormItem label="岗位">
            <Input v-model="actionData.position"/>
          </FormItem>
          <FormItem label="年薪￥" class="ivu-form-item-required">
            <InputNumber v-model="actionData.yearSalary"/>
          </FormItem>
          <FormItem label="收费金额￥">
            <InputNumber v-model="actionData.charge"/>
          </FormItem>
          <FormItem label="确认日期" class="ivu-form-item-required">
            <DatePicker v-model="actionData.sureTime"/>
          </FormItem>
          <FormItem label="预计上班日期" class="ivu-form-item-required">
            <DatePirkcer v-model="actionData.workTime"/>
          </FormItem>
        </div>
        <div v-if="actionData.type == 12">
          <FormItem label="入职时间" class="ivu-form-item-required">
            <DatePicker v-model="actionData.entryTime"/>
          </FormItem>
          <FormItem label="试用期时间" class="ivu-form-item-required">
            <DatePicker v-model="actionData.probationTime"/>
          </FormItem>
        </div>
        <div v-if="actionData.type == 16">
          <FormItem label="人选反馈">
            <Input v-model="actionData.talentRemark"/>
          </FormItem>
          <FormItem label="客户反馈">
            <Input v-model="actionData.customerRemark"/>
          </FormItem>
        </div>
        <div v-if="actionData.type == 99">
          <FormItem label="推荐理由">
            <Input v-model="actionData.recommendation"/>
          </FormItem>
        </div>
        <div v-if="actionData.status == 8">
          <FormItem label="淘汰理由">
            <Input v-model="actionData.killRemark"/>
          </FormItem>
        </div>
        <FormItem label="备注">
          <Input type="textarea" :rows="3" v-model="actionData.remark"/>
        </FormItem>
      </Form>
    </ModalUtil>

    <SpinUtil :show="show"/>
  </div>
</template>

<script>
  import { projectTalentStatus, projectProgress } from "../../../../libs/constant";
  import { getCity, getDateTime, getDateTime2, getStatusRender, toggleShow, getUserId, getUserInfoByKey, getRenderList } from "../../../../libs/tools";
  import { getProjectTalentByStatus, addProjectTalentRemind, reBack } from "../../../../api/project";

  export default {
    name: 'talent-progress',
    props: ['userList', 'flag'],
    data () {
      // 获取操作选项
      function renderAction(h, projectTalentId, type, name, createUserId) {
        let action = [];
        const roleId = this.roleId;
        // 添加选项
        const getAction = (text, status, actionType) => {
          const handler = () => {
            this.actionData = {
              projectTalentId,
              status: Number(status),
              remark: '',
              type: actionType,
              prevStatus: Number(this.status),
              prevType: type,
              talentName: name,
              // 特定状态字段
              interviewTime: null,
              remindType: null,
              interviewTone: null,
              isLast: false,
              position: '',
              yearSalary: null,
              charge: null,
              sureTime: null,
              workTime: null,
              entryTime: null,
              probationTime: null
            };
            if (actionType == 6) {
              this.addRemind();
            } else {
              toggleShow(this, 'remind', true);
            }
          };
          action.push(h('Button', {
            props: {
              type: 'text'
            },
            on: {
              click: handler
            }
          }, text));
        };
        getAction('补充跟踪', this.status, 99);
        switch (this.status) {
          case '0':
            type != 100 ? (roleId == 3 ? getAction('推荐给客户', '0', 100) : '') : action.push(h('span', {class: {'cl-error': true}}, '等待项目总监审核'));
            break;
          case '1':
            roleId == 3 && getAction('通知人才面试','1', 2);
            roleId == 3 && getAction('确认面试','2', 3);
            break;
          case '2':
            // roleId == 3 && getAction('通知人才面试','2', 2);
            roleId == 3 && getAction('面试改期','2', 4);
            roleId == 3 && getAction('放弃面试','8', 5);
            roleId == 3 && getAction('人才确认面试','3', 6);
            break;
          case '3':
            // roleId == 3 && type !=7  && getAction('面试反馈','3', 16);
            // roleId == 3 && type !=16 && getAction('面试待定','3', 7);
            roleId == 3 && getAction('面试反馈','3', 16);
            roleId == 3 && getAction('面试待定','3', 7);
            roleId == 3 && getAction('复试','3', 8);
            roleId == 3 && getAction('offer谈判','3', 9);
            // roleId == 3 && getAction('签订offer','4', 10);
            break;
          case '4':
            // getAction('辞职中','4', 11);
            roleId == 3 && getAction('签订offer','5', 10);
            break;
          case '5':
            // getAction('进入保证期','6', 13);
            getUserId()==createUserId && getAction('确认入职','6', 12);
            break;
          case '6':
            getUserId()==createUserId && getAction('通过保证期','7', 14);
            break;
          default:break;
        }
        if (['1','3','4','5','6'].indexOf(this.status)>-1) {
          getAction('淘汰', '8', 15);
        }
        if (this.status=='7' || this.status=='8') {
          action.push(h('span',{
            class: {
              'cl-success': this.status=='7',
              'cl-error': this.status=='8'&&type!=200,
              'cl-primary': this.status=='8'&&type==200
            }
          }, this.status=='7'?'已通过保证期':type == 200 ? '已在其他项目入职':'已淘汰'))
        }
        if (this.status != '0' && type != 200) {
          action.push(h('Button', {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                this.reBack(projectTalentId, this.status);
              }
            }
          }, '撤销'))
        }
        return action;
      }
      return {
        projectTalentStatus: projectTalentStatus,
        projectTalentRemindStatus: projectProgress,
        nickName: getUserInfoByKey('nickName'),
        roleId: getUserInfoByKey('roleId'),
        show: false,
        id: null,
        status: '0',
        current: 1,
        pageSize: 10,
        total: 0,
        list: [],
        nameColumn: [
          {
            title: '姓名',
            key: 'name',
            align: 'center'
          }
        ],
        actionColumn: [
          {
            title: '沟通记录',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastRemind(params.row.remind || []) || {};
              return h('span', `${remind.remark}-${getDateTime(remind.createTime)}`);
            }
          },
          {
            title: '操作',
            key: 'actions',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return renderAction.call(this, h, params.row.id, params.row.type, params.row.name, params.row.createUserId);
            }
          }
        ],
        actionData: {
          projectTalentId: null,
          status: null,
          type: null,
          remark: null,
          talentName: '',
          // 特定状态字段
          interviewTime: null,
          remindType: null,
          interviewTone: null,
          isLast: false,
          position: '',
          yearSalary: null,
          charge: null,
          sureTime: null,
          workTime: null,
          entryTime: null,
          probationTime: null,
          talentRemark: null,
          customerRemark: null,
          recommendation: null,
          killRemark: null,
        }
      }
    },
    computed: {
      // 候选、推荐
      recommendColumns() {
        return [
          ...this.nameColumn,
          {
            title: '推荐时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
          {
            title: '推荐理由',
            align: 'center',
            key: 'recommendation'
          },
          ...this.actionColumn
        ]
      },
      interviewColumns() {
        return [
          ...this.nameColumn,
          {
            title: '面试时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastInterview(params.row.remind || []) || {};
              return h('span', getDateTime(remind.interviewTime));
            }
          },
          {
            title: '人选反馈-客户反馈',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastFK(params.row.remind || []);
              if (remind) {
                return getRenderList([
                  `人选：${remind.talentRemark}`,
                  `客户：${remind.customerRemark}`,
                ]);
              }
            }
          },
          ...this.actionColumn
        ]
      },
      offerColumns() {
        return [
          ...this.nameColumn,
          {
            title: '签订offer时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', getDateTime2(remind.sureTime));
            }
          },
          {
            title: '岗位',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.position);
            }
          },
          {
            title: '年薪',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.yearSalary);
            }
          },
          {
            title: '入职时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', getDateTime2(remind.workTime));
            }
          },
          ...this.actionColumn
        ]
      },
      workingColumns() {
        return [
          ...this.nameColumn,
          {
            title: '岗位',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.position);
            }
          },
          {
            title: '年薪',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.yearSalary);
            }
          },
          {
            title: '入职时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastSure(params.row.remind || []) || {};
              return h('span', getDateTime2(remind.entryTime));
            }
          },
          {
            title: '保证期',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastSure(params.row.remind || []) || {};
              return h('span', getDateTime2(remind.probationTime));
            }
          },
          ...this.actionColumn
        ]
      },
      successColumns() {
        return [
          ...this.nameColumn,
          {
            title: '推荐时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
          {
            title: '入职时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastSure(params.row.remind || []) || {};
              return h('span', getDateTime2(remind.entryTime));
            }
          },
          {
            title: '岗位',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.position);
            }
          },
          {
            title: '年薪',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.remind || []) || {};
              return h('span', remind.yearSalary);
            }
          },
          ...this.actionColumn
        ]
      },
      columns() {
        switch (this.status) {
          case '0':
          case '1': return this.recommendColumns;
          case '2':
          case '3':
          case '4': return this.interviewColumns;
          case '5': return this.offerColumns;
          case '6': return this.workingColumns;
          case '7': return this.successColumns;
          case '8': return [...this.nameColumn, ...this.actionColumn];
        }
      }
    },
    methods: {
      // 获取当前状态的最后一次跟踪
      getLastRemind(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if (arr[i].status == this.status) {
            return arr[i];
          }
        }
      },
      // 获取最后一次面试跟踪记录
      getLastInterview(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if ([2,4,8].indexOf(arr[i].type > -1)) {
            return arr[i];
          }
        }
      },
      // 获取最后一次面试反馈
      getLastFK(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if (arr[i].type == 16) {
            return arr[i];
          }
        }
      },
      // 获取最后一次签订的合同
      getLastOffer(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if (arr[i].type == 10) {
            return arr[i];
          }
        }
      },
      // 获取最后一次入职
      getLastSure(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if (arr[i].type == 12) {
            return arr[i];
          }
        }
      },
      // 撤销回退到上一个状态
      reBack(projectTalentId, status) {
        this.$Modal.confirm({
          title: '操作确认',
          content: '是否撤销，撤销后将根据进展记录回退到上一个状态！',
          onOk: () => {
            this.show = true;
            reBack({projectTalentId, status}).then(data => {
              this.getProjectTalent();
            }).catch(data => this.show = false);
          }
        })
      },
      // 添加跟踪记录
      addRemind() {
        // 特定状态验证
        const {type, status, interviewTime, yearSalary, sureTime, workTime, entryTime, probationTime, talentRemark, customerRemark, recommendation, killRemark} = this.actionData;
        if ([2,4,8].indexOf(type) > -1) {
          if (!interviewTime) {
            this.$Message.error('请填写面试时间');
            return;
          }
        } else if (type == 10) {
          if (!yearSalary || !sureTime || !workTime) {
            this.$Message.error('请填写年薪、确认时间和预计上班时间');
            return;
          }
        } else if (type == 12) {
          if (!entryTime || !probationTime) {
            this.$Message.error('请填写入职时间和保证期');
            return;
          }
        } else if (type == 16) {
          if (!talentRemark || !customerRemark) {
            this.$Message.error('请填写反馈信息');
            return;
          }
        } else if (type == 99) {
          if (!recommendation) {
            this.$Message.error('请填写推荐理由');
            return;
          }
        } else if (status == 8) {
          if (!killRemark) {
            this.$Message.error('请填写淘汰理由');
            return;
          }
        }
        this.show = true;
        addProjectTalentRemind({
          ...this.actionData,
          createUserId: getUserId(),
          roleId: this.roleId
        }).then(data => {
          this.show = false;
          toggleShow(this, 'remind', false);
          this.getProjectTalent();
        }).catch(data => {this.show = false;})
      },
      // 获取当前进展状态下的项目人才
      getProjectTalent() {
        this.show = true;
        getProjectTalentByStatus({
          userId: getUserId(),
          id: this.id,
          status: Number(this.status)
        }).then(data => {
          this.show = false;
          this.list = data || [];
        }).catch(data => {this.show = false;})
      }
    },
    created () {
      if (!this.flag) {
        this.id = Number(this.$route.query.id);
      } else {
        this.nameColumn.push({
          title: '项目-公司',
          align: 'center',
          render: (h, params) => {
            return h('span', `${params.row.projectName}-${params.row.customerName}`);
          }
        });
      }
      this.getProjectTalent();
    },
    watch: {
      status() {
        this.getProjectTalent();
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
