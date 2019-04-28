<template>
  <Card>
    <Row>
      <Col span="8">
        <h2>{{entity.name}}</h2>
      </Col>
      <Col span="16" class="t-right">
        <Button type="primary" class="mr-10" @click="edit" v-if="entity.id && (!entity.followUserId || entity.followUserId == userId)">编辑</Button>
        <Button type="primary" icon="md-star" :disabled="!entity.id || (entity.followUserId && entity.followUserId != userId)" @click="toggleFollow">{{entity.follow ? '取消关注' : '关注客户'}}</Button>
        <Button type="primary" class="ml-10" v-if="!entity.projectCount" :disabled="!entity.id || !entity.progress || (entity.followUserId && entity.followUserId != userId)" @click="toggleBind('remind')">添加跟踪摘要</Button>
        <Button type="primary" class="ml-10" :disabled="!entity.id || (entity.followUserId && entity.followUserId != userId)" @click="toggleBind('bind')">加入到收藏夹</Button>
        <Button type="primary" class="ml-10" v-if="!entity.followUserId" @click="toggleType(true)">设为专属</Button>
        <Button type="primary" class="ml-10" v-if="entity.followUserId == userId" @click="toggleType(false)">取消专属</Button>
        <Button type="primary" @click="showFavoriteSetting = true" class="ml-10">人才收藏夹管理</Button>
      </Col>
    </Row>
    <Row>
      <Tabs>
        <TabPane label="简历原件">
          <div class="pd100 center" v-if="!entity.resume">
            <div class="center" v-if="!entity.followUserId || entity.followUserId == userId">
              <Upload
                v-if="!entity.resume"
                action="/api/common/upload"
                :on-success="resumeSuccess"
                :on-error="resumeError"
                :format="['doc', 'docx', 'pdf']"
                :show-upload-list="false"
                :max-size="5120"
                :on-format-error="formatErrorResume"
                :on-exceeded-size="sizeError"
              >
                <Button icon="ios-cloud-upload-outline">上传简历</Button>
              </Upload>
            </div>
            <span v-else>暂无上传简历</span>
            <div class="download cursor border pd-40" v-else @click="downloadFile(entity.resume)">
              <p class="center">
                <Icon type="md-cloud-download" size="24"/>
              </p>
              <p class="center">下载简历</p>
            </div>
          </div>
        </TabPane>
        <TabPane label="简历附件">
          <div class="pd100 center" v-if="!entity.resume2">
            <div class="center" v-if="!entity.followUserId || entity.followUserId == userId">
              <Upload
                v-if="!entity.resume"
                action="/api/common/upload"
                :on-success="resumeSuccess2"
                :on-error="resumeError"
                :format="['doc', 'docx', 'pdf']"
                :show-upload-list="false"
                :max-size="5120"
                :on-format-error="formatErrorResume"
                :on-exceeded-size="sizeError"
              >
                <Button icon="ios-cloud-upload-outline">上传附件</Button>
              </Upload>
            </div>
            <span v-else>暂无上传附件</span>
            <div class="download cursor border pd-40" v-else @click="downloadFile(entity.resume2)">
              <p class="center">
                <Icon type="md-cloud-download" size="24"/>
              </p>
              <p class="center">下载简历</p>
            </div>
          </div>
        </TabPane>
        <TabPane label="基本信息">
          <Detail :entity="entity"/>
        </TabPane>
        <TabPane :label="`跟踪摘要（${remindList.length}）`">
          <Select class="w300 mb-20" placeholder="请选择状态查看对应跟踪记录" clearable v-model="remindStatus">
            <Option v-for="(item, index) of talentStatus" :key="'statusr' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
          <Timeline v-if="remindFilter && remindFilter.length > 0" class="mt-10">
            <TimelineItem v-for="(item, index) of remindFilter" :key="'remind' + index">
              <p class="fs16">{{ item.type | typeFilter }}</p>
              <p class="mt-5">跟踪状态：{{ item.status | talentStatusFilter }}</p>
              <p class="mt-5"><span class="mR10">创建者：{{item.createUser}}</span><span class="ml-20">创建时间：{{getDateTime(item.createTime)}}</span></p>
              <p class="mt-5">人才状态：{{item.status | talentStatusFilter}}</p>
              <div class="bgf2 mt-5 pd-5" v-if="item.type == 1">内容：{{item.remark}}</div>
              <div class="bgf2 mt-5 pd-5" v-else-if="item.type == 2">
                <p class="mt-5">候选人基本情况：{{item.situation}}</p>
                <p class="mt-5">求职方向不离职原因：{{item.cause}}</p>
                <p class="mt-5">薪资架构：{{item.salary}}</p>
                <p class="mt-5">面试时间：{{getDateTime(item.meetTime)}}</p>
                <p class="mt-5">面试地点：{{item.meetAddress}}</p>
              </div>
              <div class="bgf2 mt-5 pd-5" v-else>
                <p class="mt-5">面试时间：{{getDateTime(item.meetTime)}}</p>
                <p class="mt-5">面试地点：{{item.meetAddress}}</p>
              </div>
            </TimelineItem>
          </Timeline>
          <div v-else>暂无跟踪记录</div>
        </TabPane>
        <TabPane :label="`项目经历（${projectLen}）`">
          <Project v-model="projectLen"/>
        </TabPane>
      </Tabs>
    </Row>
    <SpinUtil :show="show"/>
    <!-- 加入收藏夹 -->
    <ModalUtil ref="bind" title="加入收藏夹" @reset="folderId = null" @on-ok="bindFolder" :loading="show">
      <Form>
        <FormItem label="客户名称：">
          {{ entity.name }}
        </FormItem>
        <FormItem label="收藏夹：">
          <Select v-model="folderId" class="w300">
            <Option :value="item.id" v-for="(item, index) of folderListFilter" :key="'folder' + index">{{`${item.name} (${item.remark})`}}</Option>
          </Select>
        </FormItem>
      </Form>
    </ModalUtil>
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
        <div  v-if="remind.type == 2 || remind.type == 3">
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
            <Option :disabled="item.value == 10 && !!entity.offerCount" v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">
              {{ item.label }}<span v-show="!!entity.offerCount">{{`（该人才已在其他项目入职）`}}</span>
            </Option>
          </Select>
        </FormItem>
        <FormItem label="项目：" prop="projectId" v-if="remind.status == 10" class="ivu-form-item-required" filterable clearable>
          <Select v-model="remind.projectId" placeholder="请选择项目">
            <Option :disabled="talentProjects.indexOf(item.id) > -1" v-for="(item, index) of projects" :value="item.id" :key="'project' + index">
              {{ item.name }}{{`（${item.customerName}）`}}
              <span v-show="talentProjects.indexOf(item.id) > -1">{{`（已处于该项目进展中）`}}</span>
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
        <!--<FormItem label="提醒对象" prop="adviserId">-->
          <!--<Select v-model="remind.adviserId" placeholder="请选择">-->
            <!--<Option v-for="(user, index) of teamUserList" :value="user.id" :key="'user'+index">{{user.name}}</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
      </Form>
    </ModalUtil>
    <Drawer :width="360" title="人才收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting ref="favorite" @on-change="setFolders" :type="2"/>
    </Drawer>
  </Card>
</template>

<script>
  import { getTalentInfoUtil, getProjectStatus, getDateTime, getStatusRender, toggleShow, getUserId, getProjectTalentStatus, getUserInfoByKey } from "../../../libs/tools";
  import { getDetail, toggleFollow, getAllRemind, addRemind, toggleType, getTalentProjects } from "../../../api/talent";
  import { talentStatus } from "../../../libs/constant";
  import { getListByTableName, uploadFile } from "../../../api/common";
  import Detail from './components/detail';
  import Project from './components/project';
  import { bindFolder } from "../../../api/folder";
  import FavoriteSetting from '../../components/favorite-setting';
  import { openByUserId } from "../../../api/project";

  export default {
    name: "TalentDetail",
    components: {
      Detail,
      Project,
      FavoriteSetting
    },
    computed: {
      folderListFilter() {
        return this.folderList.filter(item => item.status);
      },
      remindFilter() {
        if (this.remindStatus == null) {
          return this.remindList;
        }
        return this.remindList.filter(item => item.status == this.remindStatus);
      }
    },
    filters: {
      projectStatusFilter(v) {
        return getProjectStatus(false, v);
      },
      typeFilter(v) {
        return v == 1 ? '电话沟通' : v == 2 ? '顾问面试内' : '顾问面试外';
      },
      talentStatusFilter(v) {
        return getStatusRender(false, v);
      }
    },
    data() {
      return {
        userId: null,
        entity: {

        },
        projectLen: null,
        talentStatus: talentStatus,
        remindStatus: null,
        show: false,
        showFavoriteSetting: false,
        folderList: [],
        teamUserList: [],
        folderId: null,
        talentProject: [],
        remindList: [], // 跟踪记录
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
          projectId: null
        },
        projects: [], // 所有对当前用户开放的项目
        talentProjects: [], // 当前人才已关联的项目
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
      getDateTime: getDateTime,
      resumeSuccess(res) {
        if (res.code == 200) {
          this.show = true
          uploadFile({
            type: 1,
            flag: true,
            id: this.entity.id,
            path: res.data
          }).then(data => {
            this.entity.contractUrl = res.data;
            this.show = false;
          }).catch(data => {this.show = false;});
          // this.entity.contractUrl = res.data;
        }
      },
      resumeSuccess2(res) {
        if (res.code == 200) {
          this.show = true
          uploadFile({
            type: 1,
            flag: false,
            id: this.entity.id,
            path: res.data
          }).then(data => {
            this.entity.contractUrl = res.data;
            this.show = false;
          }).catch(data => {this.show = false;});
          // this.entity.contractUrl = res.data;
        }
      },
      resumeError(res) {

      },
      formatErrorResume() {
        this.$Message.error('请上传doc,docx,pdf等格式的文件');
      },
      sizeError() {
        this.$Message.error('请上传5M以内的文件');
      },
      edit() {
        this.$router.push({ path: '/talent/talent-edit' , query: {id: this.entity.id}});
      },
      setFolders(list) {
        this.folderList = list;
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
          followRemindId: null,
          projectId: null
        };
      },
      toggleBind(key, flag) {
        toggleShow(this, key, flag);
      },
      init(id) {
        this.show = true;
        getDetail({ id }).then(data => {
          this.show = false;
          this.entity = getTalentInfoUtil(data);
          this.talentProjects = this.entity.projects || [];
        }).catch(data => { this.show = false; });
        this.getAllRemind(id);
      },
      getAllRemind(id) {
        getAllRemind({id}).then(data => {
          this.remindList = data || [];
        }).catch(data => {});
      },
      toggleFollow() {
        this.show = true;
        toggleFollow({
          id: this.entity.id,
          follow: !this.entity.follow
        }).then(data => {
          this.show = false;
          this.entity.follow = !this.entity.follow;
        }).catch(data => { this.show = false; })
      },
      toggleType(flag) {
        this.show = true;
        toggleType({
          id: this.entity.id,
          userId: getUserId(),
          flag
        }).then(data => {
          this.show = false;
          this.init(this.entity.id);
        }).catch(data => {this.show = false;});
      },
      bindFolder() {
        if (this.folderId) {
          this.show = true;
          bindFolder({
            itemId: this.entity.id,
            folderId: this.folderId,
            type: 2
          }).then(data => {
            this.show = false;
            this.toggleBind('bind', false);
          }).catch(data => { this.show = false; })
        } else {
          this.$Message.error('请选择收藏夹');
        }
      },
      addRemind() {
        this.$refs['addRemind'].validate(valid => {
          if (valid) {
            const talentType = this.entity.type;
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
            params.talentId = this.entity.id;
            params.createUserId = getUserId();
            params.roleId = getUserInfoByKey('roleId');
            this.show = true;
            addRemind(params).then(data => {
              this.show = false;
              this.getAllRemind(this.entity.id);
              this.entity.status = params.status;
              if (!!params.projectId) {
                this.talentProjects.push(params.projectId);
              }
              toggleShow(this, 'remind', false);
            }).catch(data => { this.show = false; })
          }
        })
      },
      downloadFile(fileName) {
        window.open('/api/common/download?path=' + fileName);
      }
    },
    created() {
      openByUserId({ userId: getUserId() }).then(data => {
        this.projects = data || [];
      }).catch(data => {});
      this.userId = getUserId();
      const id = Number((this.$route.query || {}).id);
      if (id) {
        this.init(id);
      }
    }
  }
</script>

<style scoped>
  .pd100{
    padding: 100px;
  }
</style>
