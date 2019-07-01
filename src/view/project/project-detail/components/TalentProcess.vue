<!-- 人才进展情况 -->
<template>
  <div class="talent-progress">
    <div v-if="!home" class="zyc">
      <Tabs v-model="status">
        <TabPane v-for="(tab, index) of projectTalentStatus" :key="'tab'+index" :label="tab.label" :name="tab.value"></TabPane>
      </Tabs>
      <Table :data="list" :columns="columns" border></Table>
    </div>
    <div v-else>
      <div class="mb-10 zyc">
        <div v-if="getList(1).length > 0">
          <h3>推荐阶段</h3>
          <Table :data="getList(1)" :columns="getColumns(1)" border></Table>
        </div>
        <div v-if="getList(2).length > 0">
          <h3>面试阶段</h3>
          <Table :data="getList(2)" :columns="getColumns(2)" border></Table>
        </div>
        <div v-if="getList(4).length > 0">
          <h3>offer谈判阶段</h3>
          <Table :data="getList(4)" :columns="getColumns(4)" border></Table>
        </div>
        <div v-if="getList(5).length > 0">
          <h3>offer签订待入职</h3>
          <Table :data="getList(5)" :columns="getColumns(5)" border></Table>
        </div>
        <div v-if="getList(6).length > 0">
          <h3>保证期人才</h3>
          <Table :data="getList(6)" :columns="getColumns(6)" border></Table>
        </div>
        <div v-if="getList(7).length > 0">
          <h3>成功人才</h3>
          <Table :data="getList(7)" :columns="getColumns(7)" border></Table>
        </div>
      </div>
    </div>
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
        <div v-if="[2,4,8].indexOf(actionData.type) > -1 || actionData.remarkStatus == 2">
          <FormItem label="面试时间" class="ivu-form-item-required">
            <DatePicker v-model="actionData.interviewTime" type="datetime"/>
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
        <div v-if="actionData.type == 10 || actionData.remarkStatus == 5">
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
            <DatePicker v-model="actionData.workTime"/>
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
          <FormItem label="人选反馈" class="ivu-form-item-required">
            <Input v-model="actionData.talentRemark"/>
          </FormItem>
          <FormItem label="客户反馈" class="ivu-form-item-required">
            <Input v-model="actionData.customerRemark"/>
          </FormItem>
          <FormItem label="状态" class="ivu-form-item-required">
            <Select v-model="actionData.remarkStatus">
              <Option :value="1">面试待定</Option>
              <Option :value="2">复试</Option>
              <Option :value="4">offer谈判</Option>
              <Option :value="5">签订offer</Option>
              <Option :value="8">淘汰</Option>
            </Select>
          </FormItem>
        </div>
        <div v-if="actionData.type == 100">
          <FormItem label="推荐理由" class="ivu-form-item-required">
            <Input v-model="actionData.recommendation"/>
          </FormItem>
        </div>
        <div v-if="actionData.status == 8 || actionData.remarkStatus == 8">
          <FormItem label="淘汰理由" class="ivu-form-item-required">
            <Input v-model="actionData.killRemark"/>
          </FormItem>
          <div v-if="(!talent.followUserId || talent.followUserId == userId) && talent.progress <= 1">
            <FormItem label="人才状态：" prop="status">
              <Select v-model="remind.status">
                <Option v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">
                  {{ item.label }}
                </Option>
              </Select>
            </FormItem>
            <FormItem label="下次跟踪类别" prop="remindTypeId">
              <Select v-model="remind.nextType" clearable>
                <Option :value="1">电话</Option>
                <Option :value="2">顾问面试（内）</Option>
                <Option :value="3">顾问面试（外）</Option>
              </Select>
            </FormItem>
            <FormItem label="下次联系时间" prop="remindTime" >
              <DatePicker type="datetime" placeholder="日期" v-model="remind.nextRemindTime"></DatePicker>
            </FormItem>
          </div>
        </div>
        <FormItem label="备注">
          <Input type="textarea" :rows="3" v-model="actionData.remark"/>
        </FormItem>
      </Form>

    </ModalUtil>
    <SpinUtil :show="show"/>
    <TalentRemind ref="cg_remind" :talentProjects="talentProjects" :talentType="talentType" :talentId="talentId" :offerCount="offerCount" :followRemindId="followRemindId" @on-ok="okHandler"/>
    <TuiJian ref="tuijian" :talentProjects="talentProjects" :talentName="talentName" :projectTalentIndex="projectTalentIndex" :talentId="talentId" @on-ok="tjHandler"/>
  </div>
</template>

<script>
  import { projectTalentStatus, projectProgress, talentStatus } from "../../../../libs/constant";
  import { getCity, getDateTime, getDateTime2, getStatusRender, toggleShow, getUserId, getUserInfoByKey, getRenderList, getProjectTalentStatus, getProjectTalentType } from "../../../../libs/tools";
  import { getProjectTalentByStatus, addProjectTalentRemind, reBack, reviewTalent } from "../../../../api/project";
  import TalentRemind from '../../../components/TalentRemind';
  import TuiJian from '../../../components/TuiJian';

  const statuses = JSON.parse(JSON.stringify(projectTalentStatus));
  statuses.splice(0, 2, {value: '1', label: '推荐人才'});
  // statuses.pop();

  export default {
    name: 'talent-progress',
    props: ['userList', 'flag', 'performance', 'projectTalents', 'home'],
    components: {
      TalentRemind,
      TuiJian
    },
    data () {
      // 获取操作选项
      function renderAction(h, projectTalentId, type, name, createUserId, status, remarkStatus, talentName, followUserId, talentId, talentType, progress, projects, offerCount, createUser, index) {
        let action = [];
        const roleId = this.roleId;
        // 添加选项
        const getAction = (text, status, actionType) => {
          const handler = () => {
            this.nickName = createUser;
            // update
            this.talentName = talentName;
            this.talentProjects = projects;
            this.talentId = talentId;
            this.talentType = talentType;
            this.offerCount = offerCount;
            this.projectTalentIndex = index;
            this.talent = {
              talentId, talentType, followUserId, progress
            };
            this.remind = {
              type: 1,
              status: null,
              nextType: null,
              nextRemindTime: null
            };
            this.actionData = {
              projectTalentId,
              status: Number(status),
              remark: '',
              type: actionType,
              prevStatus: Number(status),
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
              probationTime: null,
              talentRemark: null,
              customerRemark: null,
              remarkStatus: null
            };
            if (status == -1) {
              toggleShow(this, 'cg_remind');
            } else if (status == -2) {
              toggleShow(this, 'tuijian');
            } else {
              if (actionType == 6 || actionType == 9 || actionType == 666) {
                this.addRemind();
              } else {
                toggleShow(this, 'remind', true);
              }
            }
          };
          action.push(h('Button', {
            props: {
              type: 'text',
              size: 'small',

            },
            class: 'block center',
            on: {
              click: handler
            }
          }, text));
        };
        if (status != 7) {
          getAction('补充跟踪', status, 99);
        }
        switch (status) {
          case 0:
            type != 100 ? (roleId == 3 ? getAction('推荐给客户', '0', 100) : null) : roleId == 3 ? getAction('通过', '666', 666) : action.push(h('span', {class: {'cl-error': true, block: true}}, '等待项目总监审核'));
            break;
          case 1:
            roleId == 3 && getAction('安排面试','3', 2);
            // roleId == 3 && getAction('确认面试','2', 3);
            break;
          // case 2:
            // roleId == 3 && getAction('通知人才面试','2', 2);
            // roleId == 3 && getAction('面试改期','2', 4);
            // roleId == 3 && getAction('放弃面试','8', 5);
            // roleId == 3 && getAction('人才确认面试','3', 6);
            break;
          case 3:
            // roleId == 3 && type !=7  && getAction('面试反馈','3', 16);
            // roleId == 3 && type !=16 && getAction('面试待定','3', 7);
            if (type == 6) {
              if (remarkStatus == 1) {
                roleId == 3 && getAction('复试','3', 8);
                roleId == 3 && getAction('offer谈判','4', 9);
                roleId == 3 && getAction('签订offer','5', 10);
              } else {
                roleId == 3 && getAction('面试反馈','3', 16);
              }
            } else {
              roleId == 3 && getAction('面试改期','3', 4);
              roleId == 3 && getAction('面试确认', '3', 6);
            }
            // roleId == 3 && getAction('面试待定','3', 7);
            // roleId == 3 && getAction('签订offer','4', 10);
            break;
          case 4:
            // getAction('辞职中','4', 11);
            roleId == 3 && getAction('签订offer','5', 10);
            break;
          case 5:
            // getAction('进入保证期','6', 13);
            getUserId()==createUserId && getAction('确认入职','6', 12);
            break;
          case 6:
            getUserId()==createUserId && getAction('通过保证期','7', 14);
            break;
          default:break;
        }
        if ([0,1,3,4,5,6].indexOf(status)>-1) {
          getAction('淘汰', '8', 15);
        }
        if (status == '7') {
          if ((!followUserId || followUserId == getUserId()) && !progress) {
            getAction('常规跟踪', -1);
          }
          if ((!followUserId || followUserId == getUserId()) && !offerCount) {
            getAction('推荐', -2);
          }
        }
        // if (status=='7' || status=='8') {
        if (status=='8') {
          action.push(h('span',{
            class: {
              'cl-success': status=='7',
              'cl-error': status=='8'&&type!=200,
              'cl-primary': status=='8'&&type==200,
              'block': true,
            },
            style: {
              marginLeft: '7px',
              textAlign: 'left'
            }
          }, status=='7'?'已通过保证期':type == 200 ? '已在其他项目入职':'已淘汰'))
        }
        if (status != '0' && type != 200 && status != 7) {
          action.push(h('Button', {
            props: {
              type: 'text',
              size: 'small'
            },
            class: 'block center',
            on: {
              click: () => {
                this.reBack(projectTalentId, status);
              }
            }
          }, '撤销'))
        }
        return action;
      }
      return {
        talentStatus: talentStatus.filter(item => item.value != 10),
        projectTalentStatus: statuses,
        projectTalentRemindStatus: projectProgress,
        talentName: '',
        nickName: '',
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        show: false,
        id: null,
        status: '1',
        current: 1,
        pageSize: 10,
        total: 0,
        list: [],
        nameColumn: [
          {
            title: '姓名',
            key: 'talentName',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const name = params.row.name || params.row.talentName;
              return h('span', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                domProps: {
                  title: name
                },
                class: {
                  'cl-primary': true,
                  'cursor': true
                },
                on: {
                  click: () => {
                    this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
                  }
                }
              }, name);
            }
          }
        ],
        actionColumn: [
          {
            title: '沟通记录',
            align: 'center',
            // width: 420,
            render: (h, params) => {
              // const remind = this.getLastRemind(params.row.reminds || [], !!this.home ? params.row.status : this.status) || {};
              if (!this.performance && params.row.reminds && params.row.reminds.length == 0) {
                return h('span', '暂无跟踪记录');
              }
              const remind = !!this.performance ? params.row.remind || {} : this.getLastRemind(params.row.reminds || [], !!this.home ? params.row.status : this.status) || {};
              const {type,status,createTime,recommendation,killRemark,interviewTime,interviewTone,remark,
                isLast,position,yearSalary,charge,sureTime,workTime,entryTime,probationTime,talentRemark,customerRemark,remarkStatus} = remind;
              const interview = [`面试时间：${getDateTime2(interviewTime) || ''}`,`提醒对象：${params.row.createUser}`,`${!!interviewTone?'面试官：'+interviewTone:''}`].filter(item => !!item);
              const offer = [`岗位：${position}`,!!yearSalary?`年薪：${yearSalary}`:'',!!charge?`收费：${charge}`:'',`确认日期：${getDateTime2(sureTime) || ''}`,`预计上班时间：${getDateTime2(workTime) || ''}`].filter(item => !!item);
              const pass = [`入职时间：${getDateTime2(entryTime)}`,`试用期结束：${getDateTime2(probationTime)}`];
              const fk = [`人才反馈：${talentRemark}`,`客户反馈：${customerRemark}`];
              const recommend = [`推荐理由：${recommendation}`];
              const kill = [`淘汰：${killRemark}`];
              const rmk = [`备注：${remark || '没有填写备注'}`,`创建时间：${getDateTime2(createTime) || ''}`].filter(item => !!item);
              let arr = [];
              switch (type) {
                // case 2:
                // case 4:
                // case 8: arr = interview;break;
                // case 10: arr = offer;break;
                // case 12: arr = pass;break;
                case 16:
                  arr = fk;
                  // remarkStatus == 2 && arr.push(...interview);
                  remarkStatus == 5 && arr.push(...offer);
                  remarkStatus == 8 && arr.push(...kill);
                  break;
                case 99: arr = [];break;
                case 100: arr = recommend;break;
                default: arr = [];break;
              }
              arr = arr.concat(rmk);
              // return h('span', !!remind.remark ? `${remind.remark || ''}-${getDateTime(remind.createTime) || ''}` : '');
              return getRenderList(h, JSON.stringify(arr), true);
            }
          },
          {
            title: '操作',
            key: 'actions',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const {id, type, name, createUserId, status, remarkStatus, talentName, followUserId, createUser, progress, offerCount, projects, talentType, talentId, _index} = params.row || {};
              const action =  renderAction.call(
                this, h, id, type, name, createUserId, status, remarkStatus, talentName,
                followUserId, talentId, talentType, progress, projects, offerCount, createUser, _index
              );
              return h('div', {
                class: 'ac auto inline-block relative center'
              }, [
                h('Button', {
                  props: {
                    size: 'small',
                  },
                  style: 'height: 32px'
                }, '操作'),
                h('div', {
                  class: 'btns hide w120 border radius4 bgfff',
                  style: 'z-index: 9999'
                }, action)
              ]);
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
          remarkStatus: null,
          recommendation: null,
          killRemark: null,
        },
        talent: {

        },
        remind: {
          type: 1,
          status: null,
          nextType: null,
          nextRemindTime: null
        },
        // talentRemind infos
        offerCount: 0,
        talentProjects: [],
        talentType: null,
        talentId: null,
        followRemindId: null,
        // projectTalent infos
        projectTalentIndex: null,
      }
    },
    computed: {
      // 候选、推荐
      recommendColumns() {
        return [
          ...this.nameColumn,
          {
            title: '推荐时间',
            width: 135,
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
          {
            title: '推荐理由',
            width: 120,
            align: 'center',
            render: (h, params) => {
              return getRenderList(h, JSON.stringify([params.row.recommendation]), true);
            }
          },
          ...this.actionColumn
        ]
      },
      interviewColumns() {
        return [
          ...this.nameColumn,
          {
            title: '面试时间',
            width: 135,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastInterview(params.row.reminds || []) || {};
              return h('span', getDateTime(remind.interviewTime));
            }
          },
          {
            title: '人选反馈-客户反馈',
            align: 'center',
            width: 150,
            render: (h, params) => {
              const remind = this.getLastFK(params.row.reminds || []);
              if (remind) {
                return getRenderList(h, JSON.stringify([
                  `人选：${remind.talentRemark}`,
                  `客户：${remind.customerRemark}`,
                ]), true);
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
            width: 80,
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span', getDateTime2(remind.sureTime));
            }
          },
          {
            title: '岗位',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span',{
                domProps: {
                  title: remind.position
                },
              }, remind.position);
            }
          },
          {
            title: '年薪',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span',{
                domProps: {
                  title: remind.yearSalary
                },
              }, remind.yearSalary);
            }
          },
          {
            title: '入职时间',
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
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
            width: 80,
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span', {
                domProps: {
                  title: remind.position
                },
              }, remind.position);
            }
          },
          {
            title: '年薪',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span', {
                domProps: {
                  title: remind.yearSalary
                },
              }, remind.yearSalary);
            }
          },
          {
            title: '入职时间',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const remind = this.getLastSure(params.row.reminds || []) || {};
              return h('span', getDateTime2(remind.entryTime));
            }
          },
          {
            title: '保证期',
            width: 100,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastSure(params.row.reminds || []) || {};
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
            width: 135,
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
          {
            title: '入职时间',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const remind = this.getLastSure(params.row.reminds || []) || {};
              return h('span', getDateTime2(remind.entryTime));
            }
          },
          {
            title: '岗位',
            align: 'center',
            width: 80,
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span', {
                domProps: {
                  title: remind.position
                },
              }, remind.position);
            }
          },
          {
            title: '年薪',
            width: 80,
            align: 'center',
            render: (h, params) => {
              const remind = this.getLastOffer(params.row.reminds || []) || {};
              return h('span', {
                domProps: {
                  title: remind.yearSalary
                },
              }, remind.yearSalary);
            }
          },
          ...this.actionColumn
        ]
      },
      killColumns() {
        return [
          ...this.nameColumn,
          {
            title: '淘汰理由',
            width: 250,
            align: 'center',
            render: (h, params) => {
              return getRenderList(h, JSON.stringify([params.row.killRemark]), true);
            },
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
          case '8': return this.killColumns;
        }
      }
    },
    methods: {
      getList(status) {
        if (status == 1) {
          return (this.projectTalents || []).filter(item => item.status == 0 || item.status == 1);
        } else if (status == 2 || status == 3) {
          return (this.projectTalents || []).filter(item => item.status == 2 || item.status == 3);
        } else {
          return (this.projectTalents || []).filter(item => item.status == status);
        }
      },
      getColumns(status) {
        switch (status) {
          case 0:
          case 1: return this.recommendColumns;
          case 2:
          case 3:
          case 4: return this.interviewColumns;
          case 5: return this.offerColumns;
          case 6: return this.workingColumns;
          case 7: return this.successColumns;
          case 8: return this.killColumns;
        }
      },
      // 获取当前状态的最后一次跟踪
      getLastRemind(arr, status) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          // if (arr[i].status == status || status == 1 && (arr[i].type == 100 || arr[i].type == 101)) {
          if (arr[i].status == status || (status == 1 || status == 0) && (arr[i].status == 1 || arr[i].status == 0)) {
            return arr[i];
          }
        }
      },
      // 获取最后一次面试跟踪记录
      getLastInterview(arr) {
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if ([2,4,8].indexOf(arr[i].type) > -1) {
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
      // 审核
      review(projectTalentId, projectRemindId, flag) {
        this.show = true;
        reviewTalent({
          projectTalentId,
          projectRemindId,
          flag,
          userId: getUserId()
        }).then(data => {
          this.show = false;
          if (!this.home) {
            this.getProjectTalent();
          } else {
            this.$emit('change');
          }
        }).catch(data => {
          this.show = false;
        })
      },
      // 添加跟踪记录
      addRemind() {
        // 特定状态验证
        const {remarkStatus, type, status, interviewTime, yearSalary, sureTime, workTime, entryTime, probationTime, talentRemark, customerRemark, recommendation, killRemark} = this.actionData;
        if (type == 666) {
          this.$Modal.confirm({
            title: '确认推荐',
            content: `您确认推荐人才-${this.talentName}吗?`,
            onOk: () => {
              this.review(this.actionData.projectTalentId, null, true);
            }
          })
        } else {
          let flag = false;
          if ([2,4,8].indexOf(type) > -1 || remarkStatus == 2) {
            if (!interviewTime) {
              this.$Message.error('请填写面试时间');
              return;
            }
          } else if (type == 10 || remarkStatus == 5) {
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
            if (!talentRemark || !customerRemark || !remarkStatus) {
              this.$Message.error('请填写反馈信息');
              return;
            }
          } else if (type == 100) {
            if (!recommendation) {
              this.$Message.error('请填写推荐理由');
              return;
            }
          } else if (status == 8 || remarkStatus == 8) {
            if (!killRemark) {
              this.$Message.error('请填写淘汰理由');
              return;
            }
            if ((!this.talent.followUserId || this.talent.followUserId == this.userId) && this.talent.progress <= 1) {
              flag = true;
              this.remind.talentId = this.talent.talentId;
              this.remind.createUserId = this.userId;
              if (!this.remind.status) {
                this.$Message.error('请选择人才状态');
                return ;
              }
              if ((this.remind.nextRemindTime || this.remind.nextType) && (!this.remind.nextRemindTime || !this.remind.nextType)) {
                this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
                return false;
              }
              if (this.talent.talentType == 1 && (!this.remind.nextType || !this.remind.nextRemindTime)) {
                this.$Message.warning('专属人才必须选择下次跟踪类别和时间');
                return false;
              }
            }
          }
          this.show = true;
          addProjectTalentRemind({
            ...this.actionData,
            createUserId: getUserId(),
            roleId: this.roleId,
            talentRemind: flag ? this.remind : null
          }).then(data => {
            this.show = false;
            toggleShow(this, 'remind', false);
            if (!this.home) {
              this.getProjectTalent();
            } else {
              this.$emit('change');
            }
          }).catch(data => {this.show = false;})
        }
      },
      okHandler() {

      },
      tjHandler() {
        if (!this.home) {
          this.getProjectTalent();
        } else {
          this.$emit('change');
        }
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
        if (this.performance) {
          this.status = '1';
          this.actionColumn.splice(1, 1);
          this.actionColumn.push({
            title: '现状',
            width: 150,
            align: 'center',
            render: (h, params) => {
              return h('span', {
                domProps: {
                  title: getProjectTalentStatus(false, params.row.status) + '——' +getProjectTalentType(false, params.row.type)
                }
              }, getProjectTalentStatus(false, params.row.status) + '——' +getProjectTalentType(false, params.row.type));
            }
          });
          this.projectTalentStatus = this.projectTalentStatus.slice(1, 8);
        }
        this.nameColumn.push({
          title: '项目-公司',
          align: 'center',
          width: 180,
          ellipsis: true,
          render: (h, params) => {
            return h('div', {class: 'line'}, [
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
                    this.$router.push('/project/project-detail?id=' + params.row.projectId);
                  }
                }
              }, params.row.projectName),
              h('span', '-'),
              h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                domProps: {
                  title: params.row.customerName
                }
              }, params.row.customerName)
            ]);
          }
        });
      }
      if (!this.flag) {
        this.getProjectTalent();
      }
    },
    watch: {
      status() {
        if (!this.flag) {
          this.getProjectTalent();
        } else if (this.performance) {
          if (this.status == '1') {
            this.list = (this.projectTalents || []).filter(item => item.status == 0 || item.status == 1);
          } else {
            this.list = (this.projectTalents || []).filter(item => item.remindStatus == this.status);
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
