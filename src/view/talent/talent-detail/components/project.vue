<template>
  <div class="pd10">
    <div class="border" v-for="(item, index) of projectList">
      <div class="bgf2 pd-5">
        <span class="cl-primary">{{item.projectName}}(ID：{{item.projectId}})</span>
        <span class="ml-5 mr-5">of</span>
        <span class="cl-primary">{{item.customerName}}</span>
        <div class="inline-block action relative ml-10" style="height: 32px;" v-if="item.createUserId == userId || item.projectCreateUserId == userId">
          <Button size="small" icon="ios-apps">操作</Button>
          <div class="hide btns w120 border radius4 bgfff">
            <Button
              type="text"
              class="block"
              v-for="(action, index) of renderAction(item.id, item.status, item.type, item.remarkStatus)"
              :key="'btn' + index"
              @click="setActionData(item.id, action.status, action.type, item.status, item.type, index, item.remarkStatus, item.createUser)"
            >{{action.text}}</Button>
            <Button v-if="item.status != 0" type="text" @click="reBack(item.id, item.status, index)">撤销</Button>
          </div>
        </div>
        <Button class="ml-5" @click="item.show = !item.show">{{item.show ? '隐藏' : '显示'}}</Button>
      </div>
      <div class="pd-10" v-show="item.show">
        <div v-for="remind of item.reminds" class="mb-15">
          <div class="inline-block w160 pt-5">
            {{getDateTime(remind.createTime)}}
          </div>
          <div class="inline-block alignT">
            <div>
              <Button size="small" class="mr-5" v-if="remind.type == 99">补充跟踪</Button>
              <Button :type="getType(remind.status)" size="small" class="mr-5">{{getProjectTalentStatus(false, remind.status)}}{{!!remind.index ? `（第${remind.index}次面试）` : ''}}</Button>
              <Button type="text">{{remind.createUser}}</Button>
            </div>
            <div class="mt-10">
              <span v-if="!!remind.recommendation">推荐理由：{{remind.recommendation}}<span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span></span>
              <span class="ml-20" v-if="!!remind.killRemark">淘汰理由：{{remind.killRemark}} <span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span></span>
              <div v-if="!!remind.interviewTime">
                <span class="ml-10">面试时间：{{getDateTime(remind.interviewTime)}}</span>
                <span class="ml-10">面试官：{{remind.interviewTone}}</span>
                <span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span>
                <!--<span class="ml-10">面试时间：{{getDateTime(remind.interviewTime)}}</span>-->
              </div>
              <div v-if="!!remind.position">
                <span class="">岗位：{{remind.position}}</span>
                <span class="ml-20">年薪：{{remind.yearSalary}}万</span>
                <span class="ml-20">收费：{{remind.charge}}万</span>
                <span class="ml-20">确认日期：{{getDateTime2(remind.sureTime)}}</span>
                <span class="ml-20">预计上班时间：{{getDateTime2(remind.workTime)}}</span>
                <span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span>
              </div>
              <div v-if="!!remind.entryTime">
                <span class="">入职时间：{{getDateTime2(remind.entryTime)}}</span>
                <span class="ml-20">试用期截止时间：{{getDateTime2(remind.probationTime)}}</span>
                <span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span>
              </div>
              <div v-if="!!remind.talentRemark">
                <span class="">人选反馈：{{remind.talentRemark}}</span>
                <span class="ml-20">客户反馈：{{remind.customerRemark}}</span>
                <span class="ml-20" v-if="!!remind.remark">备注：{{remind.remark}}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--<ModalUtil ref="remind" title="新增项目人才跟踪记录" :loading="show" :width="600" @on-ok="addRemind">-->
      <!--<Form ref="form" :model="actionData" :label-width="110">-->
        <!--<FormItem label="本次跟踪状态" prop="remindType">-->
          <!--<Select v-model="actionData.type" :disabled="true">-->
            <!--<Option v-for="(type, index) of projectTalentRemindStatus" :value="type.id" :key="'remindType'+index">{{type.name}}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <!--<FormItem label="备注">-->
          <!--<Input type="textarea" :rows="3" v-model="actionData.remark"/>-->
        <!--</FormItem>-->
      <!--</Form>-->
    <!--</ModalUtil>-->
    <ModalUtil ref="remind" :title="(projectTalentRemindStatus[projectTalentRemindStatus.findIndex(item => item.id == actionData.type)] || {}).name" :loading="show" :width="600" @on-ok="addRemind">
      <Form ref="form" :model="actionData" :label-width="110">
        <FormItem label="本次跟踪状态" prop="remindType" class="hide">
          <Select v-model="actionData.type" :disabled="true">
            <Option v-for="(type, index) of projectTalentRemindStatus" :value="type.id" :key="'remindType'+index">{{type.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="候选人">
          <span>{{talent.name}}</span>
        </FormItem>
        <div v-if="[2,4,8].indexOf(actionData.type) > -1 || actionData.remarkStatus == 2">
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
  </div>
</template>

<script>
  import {projectProgress, talentStatus} from "../../../../libs/constant";
  import {getTalentProjects} from "../../../../api/talent";
  import {reBack, addProjectTalentRemind, reviewTalent} from "../../../../api/project";
  import {
    getDateTime,
    getDateTime2,
    getProjectTalentStatus,
    toggleShow,
    getUserId,
    getUserInfoByKey,
  } from "../../../../libs/tools";

  export default {
    name: "project",
    props: {
      talent: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        talentStatus: talentStatus.filter(item => item.value != 10),
        show: false,
        talentName: '',
        userId: getUserId(),
        nickName: '',
        roleId: getUserInfoByKey('roleId'),
        projectTalentRemindStatus: projectProgress,
        projectList: [],// 项目经历
        actionData: {

        },
        actionIndex: null,
        remind: {
          type: 1,
          status: null,
          nextType: null,
          nextRemindTime: null
        }
      }
    },
    methods: {
      // 审核
      review(projectTalentId, projectRemindId, flag) {
        this.show = true;
        reviewTalent({
          projectTalentId,
          projectRemindId,
          flag,
          userId: getUserId()
        }).then(data => {
          this.getProjectList(Number(this.$route.query.id));
        }).catch(data => {
          this.show = false;
        })
      },
      setActionData(projectTalentId, status, type, prevStatus, prevType, index, remarkStatus, createUser) {
        this.actionIndex = index;
        this.nickName = createUser;
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
          type: type,
          prevStatus: prevStatus,
          prevType: prevType,
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
          remarkStatus: null,
          recommendation: null,
          killRemark: null,
        };
        if (type == 6 || type == 9 || type == 666) {
          this.addRemind();
        } else {
          toggleShow(this, 'remind', true);
        }
        // this.actionData = {
        //   projectTalentId,
        //   status,
        //   type,
        //   prevStatus,
        //   prevType,
        //   remark: ''
        // };
        // toggleShow(this, 'remind')
      },
      // 撤销回退到上一个状态
      reBack(projectTalentId, status, index) {
        this.$Modal.confirm({
          title: '操作确认',
          content: '是否撤销，撤销后将根据进展记录回退到上一个状态！',
          onOk: () => {
            this.show = true;
            reBack({projectTalentId, status}).then(data => {
              this.show = false;
              if (data > -1) {
                this.projectList[index].status = data;
              }
            }).catch(data => this.show = false);
          }
        })
      },
      // 添加跟踪记录
      addRemind() {
        // 特定状态验证
        const {remarkStatus, type, status, interviewTime, yearSalary, sureTime, workTime, entryTime, probationTime, talentRemark, customerRemark, recommendation, killRemark} = this.actionData;
        if (type == 666) {
          this.$Modal.confirm({
            title: '确认推荐',
            content: `您确认推荐当前人才吗?`,
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
              this.remind.talentId = this.talent.id;
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
            roleId: getUserInfoByKey('roleId'),
            talentRemind: flag ? this.remind : null
          }).then(data => {
            // Object.assign(this.projectList[this.actionIndex], {status: this.actionData.status, type: this.actionData.type, remarkStatus: this.actionData.remarkStatus});
            // this.projectList[this.actionIndex].reminds.unshift({
            //   ...data,
            //   createUser: getUserInfoByKey('nickName')
            // });
            // this.projectList[this.actionIndex].status = this.actionData.status;
            toggleShow(this, 'remind', false);
            this.getProjectList(Number(this.$route.query.id));
          }).catch(data => {this.show = false;})
        }
      },
      renderAction(projectTalentId, projectStatus, type, remarkStatus) {
        let action = [];
        const roleId = this.roleId;
        // 添加选项
        const getAction = (text, status, actionType) => {
          action.push({
            projectTalentId,
            text,
            status: Number(status),
            remark: '',
            type: actionType,
            prevStatus: Number(projectStatus)
          });
        };
        getAction('补充跟踪', projectStatus, 99);
        switch (projectStatus) {
          case 0:
            // type != 100 ? getAction('推荐给客户', 0, 100) : action.push(h('span', {class: {'cl-error': true}}, '等待项目总监审核'));
            type != 100 ? (roleId == 3 ? getAction('推荐给客户', '0', 100) : null) : roleId == 3 ? getAction('通过', '666', 666) : action.push(h('span', {class: {'cl-error': true, block: true}}, '等待项目总监审核'));
            break;
          case 1:
            getAction('安排面试',3, 2);
            // getAction('确认面试',2, 3);
            break;
          case 3:
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
        if ([0,1,3,4,5,6].indexOf(projectStatus)>-1) {
          getAction('淘汰', 8, 15);
        }
        if (projectStatus=='7' || projectStatus=='8') {
          action.push(h('span',{
            class: {
              'cl-success': projectStatus=='7',
              'cl-error': projectStatus=='8'&&type!=200,
              'cl-primary': projectStatus=='8'&&type==200
            }
          }, projectStatus=='7'?'已通过保证期':type == 200 ? '已在其他项目入职':'已淘汰'))
        }
        // if (status != '0' && type != 200) {
        //   action.push(h('Button', {
        //     props: {
        //       type: 'text'
        //     },
        //     on: {
        //       click: () => {
        //         this.reBack(projectTalentId, status);
        //       }
        //     }
        //   }, '撤销'))
        // }
        return action;
      },
      getDateTime: getDateTime,
      getDateTime2: getDateTime2,
      getProjectTalentStatus: getProjectTalentStatus,
      getType(status) {
        if (status == 0) {
          return 'warning';
        } else if (status == 1 || status == 7) {
          return 'success';
        } else if (status == 8) {
          return 'error';
        } else {
          return 'primary';
        }
      },
      // 获取项目经历
      getProjectList(id) {
        getTalentProjects({id}).then(data => {
          this.projectList = (data || []).map(item => {
            item.reminds = item.reminds || [];
            let interviewLen = item.reminds.filter(r => [2,4,8].indexOf(r.type) > -1);
            item.reminds.forEach(remind => {
              if ([2,4,8].indexOf(remind.type) > -1) {
                remind.index = interviewLen--;
              }
            });
            return Object.assign(item, {show: true});
          });
          this.$emit('input', this.projectList.length);
          this.show = false;
        }).catch(data => {this.show = false});
      },
    },
    created() {
      const id = (this.$route.query || {}).id;
      if (id) {
        this.getProjectList(Number(id));
      }
    }
  }
</script>

<style scoped>

</style>
