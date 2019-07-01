<template>
  <Card>
    <Row>
      <Col span="8">
        <h2>{{entity.name}}</h2>
      </Col>
      <Col span="16" class="t-right">
        <Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" :disabled="!entity.id" @click="edit">编辑</Button>
        <Button type="primary" v-if="(entity.followUserId == userId || !entity.followUserId) && entity.type != 6" :disabled="!entity.id" class="ml-10" @click="toggleBindFollowUser">{{entity.followUserId ? '取消列名' : '列名'}}</Button>
        <!--<Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" class="ml-10" icon="md-star" :disabled="!entity.id" @click="toggleFollow">{{entity.follow ? '取消关注' : '关注客户'}}</Button>-->
        <Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" class="ml-10" :disabled="!entity.id" @click="toggleBind('remind')">添加跟踪摘要</Button>
        <Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" class="ml-10" :disabled="!entity.id" @click="toggleBind('bind')">加入到收藏夹</Button>
        <Button type="primary" @click="showFavoriteSetting = true" class="ml-10">客户收藏夹管理</Button>
      </Col>
    </Row>
    <Row>
      <Tabs>
        <TabPane label="基本信息">
          <div class="border mb-10">
            <div class="pd-10 bgf2 borderB">基本信息</div>
            <Row class="pd-10">
              <Col span="12">
                <p class="line mb-10"><span class="label">公司名称：</span><span>{{entity.name}}</span></p>
                <p class="line mb-10"><span class="label">行业：</span><span>{{entity.industry | industryFilter}}</span></p>
                <p class="line mb-10"><span class="label">网址：</span><span>{{entity.website}}</span></p>
                <p class="line mb-10"><span class="label line">联系电话：</span><span>{{entity.phone}}</span></p>
              </Col>
              <Col span="12">
                <p class="line mb-10"><span class="label">城市：</span><span>{{entity.city | cityFilter}}</span></p>
                <p class="line mb-10"><span class="label">公司邮箱：</span><span>{{entity.email}}</span></p>
                <!--<p class="line mb-10"><span class="label">创建人：</span><span>{{entity.createUser}}</span></p>-->
                <p class="line mb-10">
                  <span class="label">公司状态：</span><span>{{entity.type | customerTypeFilter}}</span>
                  <span v-if="entity.type && entity.type!=6"> (拓展中)</span>
                  <span v-if="entity.type">--{{entity.followUser}}</span>
                </p>
                <p class="line mb-10" v-if="entity.type == 5 || entity.type == 6">
                  <span class="label">合同期：</span>
                  <span>
                    {{getDateTime(entity.contactTimeStart)}}
                    <span class="mlr5"></span>
                    {{getDateTime(entity.contactTimeEnd)}}
                  </span>
                </p>
                <p class="line mb-10"><span class="label">添加时间：</span><span>{{getDateTime(entity.createTime)}}</span></p>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane :label="`客户跟踪摘要 (${remindList.length})`">
          <Select class="w300 mb-20" clearable v-model="remindStatus">
            <Option placeholder="请选择客户状态查看对应跟踪记录" v-for="(item, index) of customerTypes" :value="item.value" :key="'reminds' + index">{{ item.label }}</Option>
          </Select>
          <Timeline v-if="remindFilter && remindFilter.length > 0" class="mt-10">
            <TimelineItem v-for="(item, index) of remindFilter" :key="'remind' + index">
              <p class="fs16">{{item.type | typeFilter}} <span class="ml-40">客户状态：{{item.status == 0 ? '普通公司' : item.status == 6 ? '客户' : '拓展中' + `(${getCustomerType(false, item.type)})`}}</span></p>
              <!--<p class="mt-5">跟踪状态：{{item.status | customerTypeFilter}}</p>-->
              <p class="mt-5" v-if="item.status == 5">
                合同期：
                {{getDateTime(entity.contactTimeStart)}}
                <span class="mlr5"></span>
                {{getDateTime(entity.contactTimeEnd)}}
              </p>
              <!--<p class="mt-5"><span class="mR10">创建者：{{item.createUser}}</span><span class="ml-20">创建时间：{{getDateTime(item.createTime)}}</span></p>-->
              <p class="bgf2 mt-5">
                内容：{{item.type == 2 ? item.meetNotice : item.remark}}
                <span class="ml-20">{{item.createUser}}</span>
                <span class="ml-20">{{getDateTime(item.createTime)}}</span></p>
            </TimelineItem>
          </Timeline>
          <div v-else>暂无跟踪记录</div>
        </TabPane>
        <TabPane :label="`人才库 (${talents.length})`">
          <Collapse v-model="name">
            <Panel v-for="(group, index) of talentGroupByDepartment" :key="'panel' + index" :name="(index + 1).toString()">
              {{group.department}}
              <Table class="talent-manager " slot="content" :columns="columns" :data="group.talents || []"></Table>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane :label="`联系人 (${contactLen})`">
          <Contact :id="entity.id" @on-change="setContactLen"/>
        </TabPane>
        <TabPane label="合同">
          <div class="pd100 center" v-if="!entity.contractUrl">
            <div class="center" v-if="!entity.followUserId || entity.followUserId == userId">
              <Upload
                v-if="!entity.contractUrl"
                action="/api/common/upload"
                :on-success="resumeSuccess"
                :on-error="resumeError"
                :format="['doc', 'docx', 'pdf']"
                :show-upload-list="false"
                :max-size="5120"
                :on-format-error="formatErrorResume"
                :on-exceeded-size="sizeError"
              >
                <Button icon="ios-cloud-upload-outline">上传合同</Button>
              </Upload>
            </div>
            <span v-else>暂无上传合同</span>
          </div>
          <div class="download cursor border pd-40" v-else @click="downloadFile">
            <p class="center">
              <Icon type="md-cloud-download" size="24"/>
            </p>
            <p class="center">下载合同</p>
          </div>
        </TabPane>
        <TabPane :label="`项目列表 (${projectLength})`">
          <Project ref="project" @on-change="setProjectLength" :id="entity.id"/>
        </TabPane>
      </Tabs>
    </Row>
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
    <!--  添加跟踪  -->
    <ModalUtil ref="remind" title="添加客户跟踪" @reset="resetRemind" :loading="show" @on-ok="addRemind">
      <Form ref="addRemind" :model="remind" :rules="remindRule" :label-width="100" >
        <FormItem label="本次跟踪类别" prop="type">
          <Select v-model="remind.type" placeholder="请选择">
            <Option :value="1">电话</Option>
            <Option :value="2">拜访客户</Option>
            <Option :value="3">客户上门</Option>
          </Select>
        </FormItem>
        <FormItem label="联系人：" prop="contactId">
          <Select v-model="remind.contactId" placeholder="选择联系人">
            <Option v-for="(item, index) of contacts" :key="'contact' + index" :value="item.id">{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="沟通记录" class="ivu-form-item-required" v-if="remind.type == 1 || remind.type == 3">
          <Input type="textarea" placeholder="沟通了解情况" :rows="3" v-model="remind.remark"/>
        </FormItem>
        <FormItem label="拜访时间" class="ivu-form-item-required" v-if="remind.type == '2'">
          <DatePicker type="datetime" placeholder="拜访日期" v-model="remind.meetTime"></DatePicker>
        </FormItem>
        <FormItem label="拜访地点" class="ivu-form-item-required" v-if="remind.type == '2'">
          <Input v-model="remind.meetAddress"/>
        </FormItem>
        <FormItem label="拜访记录" class="ivu-form-item-required" v-if="remind.type == '2'">
          <Input type="textarea" :rows="3" v-model="remind.meetNotice"/>
        </FormItem>
        <FormItem label="状态" prop="status" class="ivu-form-item-required">
          <Select placeholder="请选择" v-model="remind.status">
            <Option v-for="(item, index) of typesFilter" :key="'type' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="合同期：" v-if="remind.status == 5">
          <DateUtil :start="remind.contactTimeStart" :end="remind.contactTimeEnd" @change="timeChange"></DateUtil>
        </FormItem>
        <FormItem label="下次跟踪类别">
          <Select v-model="remind.nextType" placeholder="请选择">
            <Option :value="1">电话</Option>
            <Option :value="2">拜访客户</Option>
            <Option :value="3">客户上门</Option>
          </Select>
        </FormItem>
        <FormItem label="下次联系时间">
          <DatePicker type="datetime" placeholder="下次跟踪时间" v-model="remind.nextRemindTime"></DatePicker>
        </FormItem>
      </Form>
    </ModalUtil>
    <Drawer :width="360" title="客户收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting ref="favorite" @on-change="setFolders" :type="1"/>
    </Drawer>
    <TalentRemind ref="talentRemind" :talentProjects="talentProjects" :talentType="talentType" :talentId="talentId" :offerCount="offerCount" :followRemindId="followRemindId" @on-ok="okHandler"/>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { getDateTime, getCustomerInfoUtil, toggleShow, getUserId, getCustomerType, getRenderList, getStatusRender } from "../../../libs/tools";
  import { get, toggleFollow, addRemind, remindList, getCustomerTalent, toggleBindFollowUser } from "../../../api/customer";
  import { bindFolder } from "../../../api/folder";
  import { customerTypes } from "../../../libs/constant";
  import Contact from './components/concat';
  import Project from './components/project';
  import FavoriteSetting from '../../components/favorite-setting';
  import { uploadFile } from "../../../api/common";
  import TalentRemind from './../../components/TalentRemind';

  export default {
    name: "CustomerDetail",
    components: {
      Contact,
      Project,
      FavoriteSetting,
      TalentRemind
    },
    filters: {
      cityFilter(v) {
        return (v || []).join(' ');
      },
      industryFilter(v) {
        return (v || []).join('、');
      },
      typeFilter(v) {
        return v == 1 ? '电话沟通' : v == 3 ? '客户上门' : '拜访客户';
      },
      customerTypeFilter(v) {
        return getCustomerType(false, v) || '列名未联系';
      }
    },
    computed: {
      folderListFilter() {
        return this.folderList.filter(item => item.status);
      },
      userId() {
        return getUserId();
      },
      typesFilter() {
        const type = this.entity.type;
        if (!type) {
          return customerTypes.slice(0, 1);
        } else if (type == 6) {
          return [customerTypes[5]];
        } else {
          if (type == 1 || type == 2) {
            return customerTypes.slice(1, 3);
          } else if (type == 3) {
            return customerTypes.slice(2, 5);
          } else if (type == 4) {
            return customerTypes.slice(3, 5);
          }
        }
      },
      remindFilter() {
        if (this.remindStatus == null) {
          return this.remindList;
        } else {
          return this.remindList.filter(item => item.status == this.remindStatus);
        }
      }
    },
    data() {
      return {
        remindIndex: null,
        offerCount: 0,
        talentProjects: [],
        talentType: null,
        talentId: null,
        followRemindId: null,
        customerTypes: customerTypes,
        show: false,
        showFavoriteSetting: false,
        name: null,
        folderList: [],
        folderId: null,
        entity: {

        },
        talentGroupByDepartment: [], // 人才库，按部门分类
        talents: [],
        remindStatus: null,
        remindList: [],
        remind: {
          type: 1,
          status: null,
          remark: null,
          meetTime: null,
          meetAddress: null,
          meetNotice: null,
          nextType: null,
          nextRemindTime: null,
          contactId: null,
          contactTime: null
        },
        contacts: [],
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择跟踪类别', trigger: 'change' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择客户状态', trigger: 'change' }
          ],
          contactId: [
            { required: true, type: 'number', message: '请选择联系人', trigger: 'change' }
          ]
        },
        columns: [
          {
            title: '人才名称',
            key: 'talentName',
            width: 100,
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
                      this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
                    }
                  }
                }, params.row.talentName)
              ]);
            }
          },
          {
            title: '岗位',
            align: 'center',
            width: 150,
            key: 'position'
          },
          {
            title: '状态',
            align: 'center',
            width: 100,
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '最近跟踪记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind || {};
              if (remind && remind.type){
                let str = '';
                switch (remind.type) {
                  case 1:
                    str = `${remind.remark}--${getDateTime(remind.createTime)}`;
                    break;
                  case 2:
                    str = `${remind.situation}--${remind.cause}--${remind.salary}--${getDateTime(remind.createTime)}`;
                    break;
                  case 3:
                    str = `${getDateTime(remind.meetTime)}--${remind.meetAddress}--${remind.situation}--${remind.cause}${remind.salary}--${getDateTime(remind.createTime)}`;
                    break;
                }
                return h('div', {
                  class: 'line',
                  domProps: {
                    title: str
                  }
                }, str);
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '跟踪用户',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const remind = params.row.remind || {};
              return h('span', remind.createUser);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 100,
            render: (h, params) => {
              const {projects, progress, followUserId, talentId, talentType, offerCount} = params.row;
              return h('Button', {
                props: {
                  type: 'primary',
                  size: 'small',
                  disabled: progress>0 && (!!followUserId && followUserId != getUserId())
                },
                on: {
                  click: () => {
                    this.remindIndex = params.row._index;
                    this.offerCount = offerCount;
                    this.talentProjects = projects;
                    this.talentId = talentId;
                    this.talentType = talentType;
                    if (!!params.row.followRemind) {
                      this.followRemindId = params.row.followRemind.id;
                    } else {
                      this.followRemindId = null;
                    }
                    toggleShow(this, 'talentRemind');
                  }
                }
              }, '常规跟踪')
            }
          }
        ],
        contactLen: 0,
        projectLength: 0
      }
    },
    methods: {
      getCustomerType:getCustomerType,
      getDateTime: getDateTime,
      okHandler(talentId, status, projectId) {
        // const len = this.talents.length;
        // for (let i=0;i<len;i++) {
        //   if (this.talents[i].talentId == talentId) {
        //     const o = Object.assign(this.talents[i], {status: status});
        //     if (!!projectId) {
        //       o.projects.push(projectId);
        //     }
        //     this.talents.splice(i, 1, o);
        //     break;
        //   }
        // }
        this.getCustomerTalent(this.entity.id);
      },
      timeChange(start, end) {
        this.remind.contactTimeStart = start;
        this.remind.contactTimeEnd = end;
      },
      edit() {
        this.$router.push('/customer/customer-edit?id=' + this.entity.id);
      },
      resumeSuccess(res) {
        if (res.code == 200) {
          this.show = true
          uploadFile({
            type: 2,
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
      setProjectLength(len) {
        this.projectLength = len;
      },
      setFolders(list) {
        this.folderList = list;
      },
      // 获取联系人数量
      setContactLen(contacts) {
        this.contacts = contacts;
        this.contactLen = contacts.length;
      },
      // 重置跟踪
      resetRemind() {
        this.remind = {
          type: 1,
          status: null,
          remark: null,
          meetTime: null,
          meetAddress: null,
          meetNotice: null,
          nextType: null,
          nextRemindTime: null,
          contactId: null,
          contactTimeStart: null,
          contactTimeEnd: null,
        };
      },
      addRemind() {
        this.$refs['addRemind'].validate(valid => {
          if (valid) {
            const remind = {...this.remind};
            if ((remind.type == 1 || remind.type == 3) && !remind.remark) {
              this.$Message.warning('电话沟通和面谈必须填写沟通记录');
              return false;
            }
            if (remind.type == 2 && (!remind.meetTime || !remind.meetAddress || !remind.meetNotice)) {
              this.$Message.warning('拜访客户必须填拜访信息');
              return false;
            }
            if ((remind.nextRemindTime || remind.nextType) && (!remind.nextRemindTime || !remind.nextType)) {
              this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
              return false;
            }
            if (remind.status == 5 && (!remind.contactTimeStart || !remind.contactTimeEnd)) {
              this.$Message.warning('签约状态下，请选择合同时间');
              return false;
            }
            remind.createUserId = getUserId();
            remind.customerId = this.entity.id;
            this.show = true;
            addRemind(remind).then(data => {
              this.show = false;
              this.entity.type = remind.status == 5 || remind.status == 6 ? 6 : remind.status;
              toggleShow(this, 'remind');
              this.getRemindList(this.entity.id);
            }).catch(data => {this.show = false;})
          }
        });
      },
      toggleBind(key, flag) {
        if (key == 'remind') {
          if (this.contactLen == 0) {
            this.$Message.warning('请添加客户联系人');
            return;
          }
          if (this.entity.type == 6) {
            this.remind.status = 6;
          }
        }
        toggleShow(this, key, flag);
      },
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
      getDateTime: getDateTime,
      filterTalentGroup(data) {
        this.talents = data;
        const departments = Array.from(new Set(data.map(item => item.department)));
        this.talentGroupByDepartment = departments.map(item => {
          return {
            department: item,
            talents: data.filter(d => d.department == item)
          }
        });
        if (this.talentGroupByDepartment.length) {
          this.name = '1';
        }
      },
      // 取消列名或列名
      toggleBindFollowUser() {
        this.show = true;
        toggleBindFollowUser({
          customerId: this.entity.id,
          userId: this.userId,
          status: !this.entity.type
        }).then(data => {
          this.freshCustomer();
        }).catch(data => {this.freshCustomer()});
      },
      // 刷新客户信息
      freshCustomer() {
        get({id: this.entity.id}).then(data => {
          this.show = false;
          this.entity = getCustomerInfoUtil(data);
        }).catch(data => {this.show = false;});
      },
      init(id) {
        this.show = true;
        get({id}).then(data => {
          this.show = false;
          this.entity = getCustomerInfoUtil(data);
          this.getCustomerTalent(id);
        }).catch(data => { this.show = false; });
        this.getRemindList(id);
      },
      getCustomerTalent(id) {
        getCustomerTalent({ id: this.entity.id }).then(data => {
          this.filterTalentGroup(data || []);
        }).catch(data => {});
      },
      getRemindList(id) {
        remindList({id}).then(data => {
          this.remindList = data || [];
        }).catch(data => {});
      },
      downloadFile() {
        window.open('/api/common/download?path=' + this.entity.contractUrl);
      }
    },
    mounted() {
      const id = (this.$route.query || {}).id;
      if (id) {
        this.init(id);
      }
    },
  }
</script>

<style scoped>
  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
  }
</style>
