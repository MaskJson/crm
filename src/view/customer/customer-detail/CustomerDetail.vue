<template>
  <Card>
    <Row>
      <Col span="8">
        <h2>{{entity.name}}</h2>
      </Col>
      <Col span="16" class="t-right">
        <Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" :disabled="!entity.id" @click="toggleBindFollowUser">{{entity.followUserId ? '取消列名' : '列名'}}</Button>
        <Button type="primary" v-if="entity.followUserId == userId || !entity.followUserId" class="ml-10" icon="md-star" :disabled="!entity.id" @click="toggleFollow">{{entity.follow ? '取消关注' : '关注客户'}}</Button>
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
                <p class="line mb-10"><span class="label">添加时间：</span><span>{{getDateTime(entity.createTime)}}</span></p>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane :label="`客户跟踪摘要 (${remindList.length})`">
          <Timeline v-if="remindList && remindList.length > 0" class="mt-10">
            <TimelineItem v-for="(item, index) of remindList" :key="'remind' + index">
              <p class="fs16">{{item.type | typeFilter}}</p>
              <p class="mt-5"><span class="mR10">创建者：{{item.createUser}}</span><span class="ml-20">创建时间：{{getDateTime(item.createTime)}}</span></p>
              <p class="bgf2 mt-5">内容：{{item.type == 2 ? item.meetNotice : item.remark}}</p>
            </TimelineItem>
          </Timeline>
          <div v-else>暂无跟踪记录</div>
        </TabPane>
        <TabPane :label="`人才库 (${talents.length})`">
          <Collapse v-model="name">
            <Panel v-for="(group, index) of talentGroupByDepartment" :key="'panel' + index" :name="(index + 1).toString()">
              {{group.department}}
              <Table slot="content" :columns="columns" :data="group.talents || []"></Table>
            </Panel>
          </Collapse>
        </TabPane>
        <TabPane :label="`联系人 (${contactLen})`">
          <Contact :id="entity.id" @on-change="setContactLen"/>
        </TabPane>
        <TabPane label="合同">
          <Project :id="entity.id"/>
        </TabPane>
        <TabPane label="项目列表">

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
            <Option v-for="(item, index) of typeFilter" :key="'type' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
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
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { getDateTime, getCustomerInfoUtil, toggleShow, getUserId, getCustomerType } from "../../../libs/tools";
  import { get, toggleFollow, addRemind, remindList, getCustomerTalent, toggleBindFollowUser } from "../../../api/customer";
  import { bindFolder } from "../../../api/folder";
  import { customerTypes } from "../../../libs/constant";
  import Contact from './components/concat';
  import Project from './components/project';
  import FavoriteSetting from '../../components/favorite-setting';

  export default {
    name: "CustomerDetail",
    components: {
      Contact,
      Project,
      FavoriteSetting
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
        return getCustomerType(false, v);
      }
    },
    computed: {
      folderListFilter() {
        return this.folderList.filter(item => item.status);
      },
      userId() {
        return getUserId();
      },
      typeFilter() {
        if (!this.entity.type) {
          return customerTypes.slice(0, 1);
        } else if (this.entity.type == 6) {
          return [customerTypes[6]];
        } else {
          return customerTypes.slice(1, 6);
        }
      }
    },
    data() {
      return {
        show: false,
        showFavoriteSetting: false,
        name: null,
        folderList: [],
        folderId: null,
        entity: {

        },
        talentGroupByDepartment: [], // 人才库，按部门分类
        talents: [],
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
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择跟踪类别', trigger: 'blur' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择客户状态', trigger: 'blur' }
          ]
        },
        columns: [
          {
            title: '入职时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.startTime));
            }
          },
          {
            title: '离职时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.endTime));
            }
          },
          {
            title: '姓名',
            render: (h, params) => {
              return h('span', params.row.talent.name)
            }
          }
        ],
        contactLen: 0,
      }
    },
    methods: {
      setFolders(list) {
        this.folderList = list;
      },
      // 获取联系人数量
      setContactLen(len) {
        this.contactLen = len;
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
            remind.createUserId = getUserId();
            remind.customerId = this.entity.id;
            this.show = true;
            addRemind(remind).then(data => {
              this.show = false;
              toggleShow(this, 'remind');
              this.getRemindList(this.entity.id);
            }).catch(data => {this.show = false;})
          }
        });
      },
      toggleBind(key, flag) {
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
          getCustomerTalent({ id: this.entity.id }).then(data => {
            this.filterTalentGroup(data || []);
          }).catch(data => {});
        }).catch(data => { this.show = false; });
        this.getRemindList(id);
      },
      getRemindList(id) {
        remindList({id}).then(data => {
          this.remindList = data || [];
        }).catch(data => {});
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
