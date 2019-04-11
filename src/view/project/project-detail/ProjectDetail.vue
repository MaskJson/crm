<template>
  <Card>
    <Row>
      <Col span="12">
        <h2>{{entity.name}}</h2>
      </Col>
      <Col span="12" class="t-right">
        <Button type="primary" class="ml-10" icon="md-star" v-if="entity.createUerId == userId" :disabled="!entity.id" @click="toggleFollow">{{entity.follow ? '取消关注' : '关注项目'}}</Button>
        <Button type="primary" class="ml-10" :disabled="!entity.id" @click="toggleBind('talent')">关联项目候选人</Button>
        <Button type="primary" class="ml-10" :disabled="!entity.id" v-if="entity.createUerId == userId" @click="toggleBind('bind')">加入到收藏夹</Button>
        <Button type="primary" class="ml-10" v-if="roleId != 8" :disabled="!entity.id" @click="newProjectTalent">新建项目候选人</Button>
        <Button type="primary" class="ml-10" v-if="roleId == 2" :disabled="!entity.id" @click="toggleBind('choose')">新增项目诊断报告</Button>
        <Button type="primary" v-if="entity.createUerId == userId" @click="showFavoriteSetting = true" class="ml-10">项目收藏夹管理</Button>
      </Col>
    </Row>
    <Row class="mt-20">
      <Tabs>
        <TabPane label="项目详情">
          <project-info ref="detail" @on-change="setEntity" @show="show = true"/>
        </TabPane>
        <TabPane label="人才进展情况">
          <talent-process ref="process" />
        </TabPane>
      </Tabs>
    </Row>

    <!-- 加入收藏夹 -->
    <ModalUtil ref="bind" title="加入收藏夹" @reset="folderId = null" @on-ok="bindFolder" :loading="show">
      <Form :label-width="100">
        <FormItem label="项目名称：">
          {{ entity.name }}
        </FormItem>
        <FormItem label="收藏夹：">
          <Select v-model="folderId" class="w300">
            <Option :value="item.id" v-for="(item, index) of folderListFilter" :key="'folder' + index">{{`${item.name} (${item.remark})`}}</Option>
          </Select>
        </FormItem>
      </Form>
    </ModalUtil>
    <!-- 关联人才 -->
    <ModalUtil ref="talent" title="添加候选人" @reset="talentId = null" @on-ok="bindProjectTalent" :loading="show">
      <Form :label-width="100">
        <FormItem label="添加候选人：">
          <Select v-model="talentId" placeholder="请选择" filterable remote :remote-method="talentRemote">
            <Option v-for="(item, index) of talents" :key="'talent' + index" :value="item.id">
              {{item.name}}
              <span v-show="projectTalents.indexOf(item.id) > -1" class="cl-error">（已关联）</span>
            </Option>
          </Select>
        </FormItem>
      </Form>
    </ModalUtil>
    <!--  诊断报告 -->
    <ModalUtil ref="choose" title="选择跟踪类型" @reset="reportType = 1" @on-ok="changeReportType" :loading="show">
      <div class="pt-10 pb-10">
        <RadioGroup v-model="reportType">
          <div class="mt-5 mb-5"><Radio :label="1">项目诊断前通知项目顾问提交诊断报告再诊断</Radio></div>
          <div class="mt-5 mb-5"><Radio :label="2">直接诊断后写诊断建议推送给项目顾问</Radio></div>
        </RadioGroup>
      </div>
    </ModalUtil>
    <!--  诊断报告 -->
    <ModalUtil ref="report1" title="通知顾问诊断" @reset="report.remark = ''" @on-ok="addProjectReport(1)" :loading="show">
      <div class="pt-10 pb-10">
        <RadioGroup v-model="reportType">
          <div>
            <Input class="w500" v-model="report.remark" type="textarea" :rows="6" :maxlength="200" placeholder="请填写诊断报告(200字以内)"/>
          </div>
        </RadioGroup>
      </div>
    </ModalUtil>
    <!--  诊断报告 -->
    <ModalUtil ref="report2" title="项目经理直接诊断" @reset="report.remark = ''" :footerHide="true">
      <Row>
        <Col span="12">
          <p>总人数：{{reportCounts.allCount}}</p>
          <p>推荐给客户的人数：{{reportCounts.recommendCount}}</p>
          <p>面试人数：{{reportCounts.interviewCount}}</p>
          <p>offer人数：{{reportCounts.offerCount}}</p>
          <p>入职人数：{{reportCounts.workingCount}}</p>
          <p>保证期人数：{{reportCounts.qualityCount}}</p>
          <p>通过保证期人数：{{reportCounts.qualityPassCount}}</p>
        </Col>
        <Col span="12">
          <!--<p>推荐率：<Progress :percent="diagnosis.relationCount?Number(diagnosis.relationCount):0"/></p>-->
          <!--<p>面试率：<Progress :percent="diagnosis.auditionRate?Number(diagnosis.auditionRate):0"/></p>-->
          <!--<p>offer率：<Progress :percent="diagnosis.offerRate?Number(diagnosis.offerRate):0"/></p>-->
        </Col>
      </Row>
      <Row class="mt-10 mb-10">
        <p>
          <Input class="w500" v-model="report.remark" type="textarea" :rows="6" :maxlength="200" placeholder="项目经理必须填写诊断建议，项目组成员可见(200字以内)"/>
        </p>
        <Button type="primary" class="w120 mt-10" :loading="show" @click="addProjectReport(2)">提交诊断报告</Button>
      </Row>
      <Row class="mt-10" :class="{borderB: index < reportList.length - 1}" v-if="reportList && reportList.length > 0" v-for="(item, index) of reportList" :key="'report' + index">
        <Col span="8">诊断编号：{{item.id}}</Col>
        <Col span="8">报告人：{{item.userName}}</Col>
        <Col span="8">报告时间：{{getDateTime(item.createTime)}}</Col>
        <Col span="24">
          <p>诊断内容：</p>
          <div class="bgf2 pd-10">{{item.remark}}</div>
        </Col>
      </Row>
      <Row v-if="!reportList.length" class="mt-10">
        <Col>该项目暂无顾问诊断记录</Col>
      </Row>
    </ModalUtil>
    <Drawer :width="360" title="项目收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting ref="favorite" @on-change="setFolders" :type="3"/>
    </Drawer>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import ProjectInfo from './components/ProjectInfo';
  import TalentProcess from './components/TalentProcess';
  import { getUserId, getUserInfoByKey, toggleShow } from "../../../libs/tools";
  import { bindFolder } from "../../../api/folder";
  import { getListByTableName } from "../../../api/common";
  import { toggleFollow, allProjectTalent, addProjectTalent, getReportData, addReport } from "../../../api/project";
  import FavoriteSetting from '../../components/favorite-setting';

  export default {
    name: "ProjectDetail",
    components: {
      ProjectInfo,
      TalentProcess,
      FavoriteSetting
    },
    computed: {
      folderListFilter() {
        return this.folderList.filter(item => item.status);
      },
    },
    data() {
      return {
        show: false,
        showFavoriteSetting: false,
        roleId: null,
        userId: null,
        selectLoading: false,
        folderId: null, // 绑定收藏夹id
        talentId: null, // 关联的人才id
        folderList: [], // 项目收藏夹
        projectTalents: [], // 项目已关联人才 ids
        talents: [], // select动态查询人才
        entity: {

        },
        reportType: 1, // 1：提醒顾问、2：直接诊断
        report: {
          remark: '',
        },
        reportCounts: { // 各个状态下的人才数

        },
        reportList: [], // 诊断记录
        // 诊断报告
      }
    },
    methods: {
      setFolders(list) {
        this.folderList = list;
      },
      setEntity(entity) {
        this.show = false;
        this.entity = entity;
      },
      toggleBind(key, flag) {
        toggleShow(this, key, flag);
      },
      // 加入收藏夹
      bindFolder() {
        if (this.folderId) {
          this.show = true;
          bindFolder({
            itemId: this.entity.id,
            folderId: this.folderId,
            type: 1
          }).then(data => {
            this.show = false;
            this.toggleBind('bind', false);
          }).catch(data => { this.show = false; })
        } else {
          this.$Message.error('请选择收藏夹');
        }
      },
      // 关注-取消关注
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
      // 添加候选人
      bindProjectTalent() {
        const talentId = this.talentId;
        if (!talentId) {
          this.$Message.error('请选择人才');
          return false;
        }
        if (this.projectTalents.indexOf(talentId) > -1) {
          this.$Modal.confirm({
            title: '人才已关联项目提醒',
            content: '该人才已属于当前项目，重新添加候选人将会重置其在项目中的状态，是否添加？',
            onOk: () => {
              this.projectTalentAdd();
            }
          });
        } else {
          this.projectTalentAdd();
        }
      },
      projectTalentAdd() {
        const talentId = this.talentId;
        this.show = true;
        addProjectTalent({
          talentId,
          projectId: this.entity.id,
          status: 0,
          type: 1,
          createUserId: getUserId()
        }).then(data => {
          this.show = false;
          toggleShow(this, 'talent', false);
          this.$refs['process'].getProjectTalent();
          if (this.projectTalents.indexOf(talentId) < 0) {
            this.projectTalents.push(talentId);
          }
        }).catch(data => {this.show = false;})
      },
      // 动态查询，根据name获取人才
      talentRemote(query) {
        if (query) {
          this.selectLoading = true;
          getListByTableName({
            type: 2,
            name: query.trim()
          }).then(data => {
            this.selectLoading = false;
            this.talents = data || [];
          }).catch(data => {this.selectLoading = false;})
        }
      },
      // 获取该项目已关联的非淘汰人才
      getAllProjectTalent() {
        const id = Number((this.$route.query || {}).id);
        allProjectTalent({id}).then(data => {
          this.projectTalents = data || [];
        }).catch(data => {});
      },
      // 新建项目候选人
      newProjectTalent() {
        this.$router.push({path: '/talent/talent-edit', query: {projectId: this.entity.id}});
      },
      // 选择跟踪类型
      changeReportType() {
        if (this.reportType == 1) {
          toggleShow(this, 'choose');
          toggleShow(this, 'report1');
        } else {
          this.show = true;
          getReportData({id: this.entity.id}).then(data => {
            this.show = false;
            toggleShow(this, 'choose');
            data = data || {};
            this.reportCounts = data.counts;
            this.reportList = data.list;
            toggleShow(this, 'report2', true);
          }).catch(data => {this.show = false;})
        }
      },
      // 添加诊断
      addProjectReport(flag) {
        if (!this.report.remark.trim()) {
          this.$Message.error('请填写诊断报告');
          return ;
        }
        const params = {
          remark: this.report.remark,
          createUserId: getUserId(),
          type: flag,
          status: flag != 2
        };
        if (flag == 2) {
          Object.assign(params, this.reportCounts);
        }
        this.show = true;
        addReport(params).then(data => {
          this.show = false;
          toggleShow(this, 'report' + flag, false);
        }).catch(data => {this.show = false;})
      }
    },
    created() {
      this.getAllProjectTalent();
      this.userId = getUserId();
      this.roleId = getUserInfoByKey('roleId');
    }
  }
</script>

<style scoped>

</style>
