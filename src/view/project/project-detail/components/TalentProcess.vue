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
  import { getCity, getDateTime, getStatusRender, toggleShow, getUserId, getUserInfoByKey } from "../../../../libs/tools";
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
            getAction('确认面试','2', 3);
            break;
          case '2':
            roleId == 3 && getAction('通知人才面试','2', 2);
            roleId == 3 && getAction('面试改期','2', 4);
            // roleId == 3 && getAction('放弃面试','8', 5);
            roleId == 3 && getAction('人才确认面试','3', 6);
            break;
          case '3':
            // getAction('面试待定','3', 7);
            roleId == 3 && getAction('复试','3', 8);
            roleId == 3 && getAction('offer谈判','3', 9);
            roleId == 3 && getAction('签订offer','4', 10);
            break;
          case '4':
            // getAction('辞职中','4', 11);
            getUserId()==createUserId && getAction('确认入职','6', 12);
            break;
          // case '5':
          //   getAction('进入保证期','6', 13);
          //   break;
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
        column: [
          {
            title: '姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '最后联系',
            key: 'updateTime',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
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
          probationTime: null
        }
      }
    },
    computed: {

    },
    methods: {
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
        const {type, interviewTime, yearSalary, sureTime, workTime, entryTime, probationTime} = this.actionData
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
        this.column.unshift({
            title: '公司名称',
            key: 'customerName',
            align: 'center'
          },
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
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
