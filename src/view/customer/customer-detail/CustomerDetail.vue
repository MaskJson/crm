<template>
  <Card>
    <Row>
      <Col span="12">
        <h2>{{entity.name}}</h2>
      </Col>
      <Col class="t-right">
        <Button type="primary" icon="md-star" :disabled="!entity.id" @click="toggleFollow">{{entity.follow ? '取消关注' : '关注客户'}}</Button>
        <Button type="primary" class="ml-10" :disabled="!entity.id" @click="toggleBind('remind')">添加跟踪摘要</Button>
        <Button type="primary" class="ml-10" :disabled="!entity.id" @click="toggleBind('bind')">加入到收藏夹</Button>
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
                <p class="line mb-10"><span class="label">创建人：</span><span>{{entity.createUser}}</span></p>
                <p class="line mb-10"><span class="label">添加时间：</span><span>{{getDateTime(entity.createTime)}}</span></p>
              </Col>
            </Row>
          </div>
        </TabPane>
        <TabPane label="客户跟踪摘要">
          <Timeline v-if="remindList && remindList.length > 0" class="mt-10">
            <TimelineItem v-for="(item, index) of remindList" :key="'remind' + index">
              <p class="fs16">{{item.type | typeFilter}}</p>
              <p class="mt-5"><span class="mR10">创建者：{{item.createUser}}</span><span class="ml-20">创建时间：{{getDateTime(item.createTime)}}</span></p>
              <p class="bgf2 mt-5">内容：{{item.type == 2 ? item.meetNotice : item.remark}}</p>
            </TimelineItem>
          </Timeline>
          <div v-else>暂无跟踪记录</div>
        </TabPane>
        <TabPane label="人才库">
          <Form :label-width="150" labelPosition="left">
            <FormItem v-for="(group, index) of talentGroupByDepartment" :key="'formitem' + index" :label="group.department + '：'">
              <Table :columns="columns" :data="group.talents || []"></Table>
            </FormItem>
          </Form>
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
    <ModalUtil ref="remind" title="添加客户跟踪" @reset="resetRemind" @on-ok="addRemind">
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
            <Option :value="0">普通公司</Option>
            <Option :value="1">列名</Option>
            <Option :value="2">联系中</Option>
            <Option :value="3">合作洽谈</Option>
            <Option :value="4">先推人再签约</Option>
            <Option :value="5">签约</Option>
            <Option :value="6">客户</Option>
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
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { getDateTime, getCustomerInfoUtil, toggleShow, getUserId } from "../../../libs/tools";
  import { get, toggleFollow, addRemind, remindList, getCustomerTalent } from "../../../api/customer";
  import { list, bindFolder } from "../../../api/folder";

  export default {
    name: "CustomerDetail",
    filters: {
      cityFilter(v) {
        return (v || []).join(' ');
      },
      industryFilter(v) {
        return (v || []).join('、');
      },
      typeFilter(v) {
        return v == 1 ? '电话沟通' : v == 2 ? '客户上门' : '拜访客户';
      }
    },
    computed: {
      folderListFilter() {
        return this.folderList.filter(item => item.status);
      }
    },
    data() {
      return {
        show: false,
        folderList: [],
        folderId: null,
        entity: {

        },
        talentGroupByDepartment: [], // 人才库，按部门分类
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
        ]
      }
    },
    methods: {
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
            if (remind.type == '2' && (!remind.meetTime || !remind.meetAddress || !remind.meetNotice)) {
              this.$Message.warning('拜访客户必须填拜访信息');
              return false;
            }
            if ((remind.nextRemindTime && remind.nextType) || (!remind.nextRemindTime && !remind.nextType)) {
              this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
              return false;
            }
            remind.createUerId = getUserId();
            remind.customerId = this.entity.id;
            addRemind(remind).then(data => {
              this.show = false;
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
        const departments = Array.from(new Set(data.map(item => item.department)));
        this.talentGroupByDepartment = departments.map(item => {
          return {
            department: item,
            talents: data.filter(d => d.department == item)
          }
        });
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
        list({ type: 1 }).then(data => {
          this.folderList = data;
        }).catch(data => {});
        remindList({id}).then(data => {
          this.remindList = data || [];
        }).catch(data => {});
      }
    },
    created() {
      const id = (this.$route.query || {}).id;
      if (id) {
        this.init(id);
      }
    }
  }
</script>

<style scoped>
  .label {
    display: inline-block;
    width: 150px;
    text-align: right;
  }
</style>
