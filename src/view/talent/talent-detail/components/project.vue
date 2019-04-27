<template>
  <div class="pd10">
    <div class="border" v-for="(item, index) of projectList">
      <div class="bgf2 pd-5">
        <span class="cl-primary">{{item.projectName}}(ID：{{item.projectId}})</span>
        <span class="ml-5 mr-5">of</span>
        <span class="cl-primary">{{item.customerName}}</span>
        <div class="inline-block action relative ml-10" style="height: 32px;">
          <Button size="small" icon="ios-apps">操作</Button>
          <div class="hide btns w120 border radius4 bgfff">
            <Button
              type="text"
              class="block"
              v-for="action of renderAction(item.id, item.status, item.type)"
              @click="setActionData(item.id, action.status, action.type, item.status, item.type, index)"
            >{{action.text}}</Button>
            <Button type="text" @click="reBack(item.id, item.status, index)">撤销</Button>
          </div>
        </div>
      </div>
      <div class="pd-10">
        <div v-for="remind of item.reminds" class="mb-15">
          <div class="inline-block w160 pt-5">
            {{getDateTime(remind.createTime)}}
          </div>
          <div class="inline-block alignT">
            <div>
              <Button size="small" class="mr-5" v-if="remind.type == 99">补充跟踪</Button>
              <Button :type="getType(remind.status)" size="small" class="mr-5">{{getProjectTalentStatus(false, remind.status)}}</Button>
              <Button type="text">{{remind.createUser}}</Button>
            </div>
            <p class="mt-10">{{remind.remark}}</p>
          </div>
        </div>
      </div>
    </div>
    <ModalUtil ref="remind" title="新增项目人才跟踪记录" :loading="show" :width="600" @on-ok="addRemind">
      <Form ref="form" :model="actionData" :label-width="110">
        <FormItem label="本次跟踪状态" prop="remindType">
          <Select v-model="actionData.type" :disabled="true">
            <Option v-for="(type, index) of projectTalentRemindStatus" :value="type.id" :key="'remindType'+index">{{type.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="备注">
          <Input type="textarea" :rows="3" v-model="actionData.remark"/>
        </FormItem>
      </Form>
    </ModalUtil>
    <SpinUtil :show="show"/>
  </div>
</template>

<script>
  import {projectProgress} from "../../../../libs/constant";
  import {getTalentProjects} from "../../../../api/talent";
  import {reBack, addProjectTalentRemind} from "../../../../api/project";
  import {getDateTime, getProjectTalentStatus, toggleShow, getUserId, getUserInfoByKey} from "../../../../libs/tools";

  export default {
    name: "project",
    data() {
      return {
        show: false,
        projectTalentRemindStatus: projectProgress,
        projectList: [],// 项目经历
        actionData: {

        },
        actionIndex: null
      }
    },
    methods: {
      setActionData(projectTalentId, status, type, prevStatus, prevType, index) {
        this.actionIndex = index;
        this.actionData = {
          projectTalentId,
          status,
          type,
          prevStatus,
          prevType,
          remark: ''
        };
        toggleShow(this, 'remind')
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
        this.show = true;
        addProjectTalentRemind({
          ...this.actionData,
          createUserId: getUserId(),
          roleId: getUserInfoByKey('roleId')
        }).then(data => {
          this.show = false;
          this.projectList[this.actionIndex].reminds.unshift({
            ...data,
            createUser: getUserInfoByKey('nickName')
          });
          this.projectList[this.actionIndex].status = this.actionData.status;
          toggleShow(this, 'remind', false);
        }).catch(data => {this.show = false;})
      },
      renderAction(projectTalentId, projectStatus, type) {
        let action = [];
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
            type != 100 ? getAction('推荐给客户', 0, 100) : action.push(h('span', {class: {'cl-error': true}}, '等待项目总监审核'));
            break;
          case 1:
            getAction('通知人才面试',1, 2);
            getAction('确认面试',2, 3);
            break;
          case 2:
            getAction('通知人才面试',2, 2);
            getAction('面试改期',2, 4);
            getAction('放弃面试',8, 5);
            getAction('人才确认面试',3, 6);
            break;
          case 3:
            getAction('面试待定',3, 7);
            getAction('复试',3, 8);
            getAction('offer谈判',3, 9);
            getAction('签订offer确定入职',4, 10);
            break;
          case 4:
            getAction('辞职中',4, 11);
            getAction('确认入职',5, 12);
            break;
          case 5:
            getAction('进入保证期',6, 13);
            break;
          case 6:
            getAction('通过保证期',7, 14);
            break;
          default:break;
        }
        if ([1,2,4,5,6].indexOf(projectStatus)>-1) {
          getAction('淘汰', 8, 15);
        }
        return action;
      },
      getDateTime: getDateTime,
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
            return Object.assign(item, {show: true});
          });
          this.$emit('input', this.projectList.length);
        }).catch(data => {});
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
  .btns {
    position: absolute;
    top: 30px;
    left: 0;
  }
  .action:hover .btns{
    display: block;
  }
</style>
