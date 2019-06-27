<template>
  <Card>
    <Row class="container clear">
      <div class="pd-10 w300 left mr-20" v-if="roleId != 8">
        <div class="radius4 border pd-10">
          <h3 class="cl-error">{{roleId == 1 ? '所有待办项' : '个人待办项'}}</h3>
          <h3 class="cursor mt-10" @click="goto('/talent/talent-pending')">人才常规跟踪待办项：<span class="cl-primary">{{count.talentFirst + count.talentSecond + count.talentThird}}</span></h3>
          <h3 class="cursor mt-10" @click="goto('/customer/customer-pending')">客户常规跟踪待办项：<span class="cl-primary">{{count.customerFirst + count.customerSecond + count.customerThird}}</span></h3>
          <h3 class="cursor mt-10" @click="showInterview = true">今日面试提醒：<span class="cl-primary">{{interview.length}}</span></h3>
        </div>
      </div>
      <div class="pd-10 w300 left" v-if="roleId == 3">
        <div class="radius4 border pd-10">
          <h3 class="cl-error">团队待办项</h3>
          <h3 class="cursor mt-10" @click="goto('/talent/talent-pending?team=110')">人才常规跟踪待办项：<span class="cl-primary">{{countTeam.talentFirst + countTeam.talentSecond + countTeam.talentThird}}</span></h3>
          <h3 class="cursor mt-10" @click="goto('/customer/customer-pending?team=110')">客户常规跟踪待办项：<span class="cl-primary">{{countTeam.customerFirst + countTeam.customerSecond + countTeam.customerThird}}</span></h3>
          <h3 class="cursor mt-10" @click="showInterviewTeam = true">今日面试提醒：<span class="cl-primary">{{interviewTeam.length}}</span></h3>
          <!--<p class="mt-10">-->
          <!--<span class="inline-block">电话沟通：</span>-->
          <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '1')">{{count.talentFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
          <!--<span class="inline-block">顾问面试（内）：</span>-->
          <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '2')">{{count.talentSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
          <!--<span class="inline-block">顾问面试（外）：</span>-->
          <!--<span class="ml-10 cl-primary cursor" @click="goto('/talent/talent-pending', '3')">{{count.talentThird}}</span>-->
          <!--</p>-->
        </div>
      </div>
      <!--<Col span="4" class="pd-10" v-if="roleId != 8">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto('/customer/customer-pending')">客户常规跟踪待办项</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">电话沟通：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '1')">{{count.customerFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">拜访客户：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '2')">{{count.customerSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">客户上门：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto('/customer/customer-pending', '3')">{{count.customerThird}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
      <!--<Col span="4" class="pd-10">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto2('/project/progress-pending', '1')">项目启动阶段</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">进展中：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1', '1')">{{count.qiDongFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">停滞中：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1',  '2')">{{count.qiDongSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">缓慢：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '1',  '3')">{{count.qiDongThird}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
      <!--<Col span="4" class="pd-10">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto2('/project/progress-pending', '2')">项目攻坚阶段</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">进展中：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '2', '1')">{{count.gongJianFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">缓慢：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '2', '2')">{{count.gongJianSecond}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
      <!--<Col span="4" class="pd-10">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto2('/project/progress-pending', '3')">项目收尾阶段</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">签订offer：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '4')">{{count.shouWeiFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">入职：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '5')">{{count.shouWeiSecond}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">保证期：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '3', '6')">{{count.shouWeiThird}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
      <!--<Col span="4" class="pd-10">-->
        <!--<div class="radius4 border pd-10">-->
          <!--<h3 class="cursor" @click="goto2('/project/progress-pending', '4')">项目结束</h3>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">通过保证期：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '4', '7')">{{count.jieShuFirst}}</span>-->
          <!--</p>-->
          <!--<p class="mt-10">-->
            <!--<span class="inline-block">淘汰：</span>-->
            <!--<span class="ml-10 cl-primary cursor" @click="goto2('/project/progress-pending', '4', '8')">{{count.jieShuSecond}}</span>-->
          <!--</p>-->
        <!--</div>-->
      <!--</Col>-->
    </Row>
    <Row v-show="list.length > 0">
      <h2>项目进展</h2>
      <TalentProgress flag="yes" home="yes" :project-talents="list" @change="getProjectTalent"/>
    </Row>
    <Modal title="今日面试提醒" v-model="showInterview" :width="960">
      <Table border :data="interview" :columns="columns" />
    </Modal>
    <Modal title="今日面试提醒" v-model="showInterviewTeam" :width="960">
      <Table border :data="interviewTeam" :columns="columnsTeam" />
    </Modal>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import {getUserId, getUserInfoByKey, getDateTime, getDateTime2, getRenderList} from "../../libs/tools";
  import { homeCount, interviewList } from "../../api/count";
  import {getProjectTalentByStatus} from "../../api/project";
  import TalentProgress from './../project/project-detail/components/TalentProcess';

  export default {
    name: "home",
    components: {
      TalentProgress
    },
    data() {
      return {
        show: false,
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        count: {
          talentFirst: 0,
          talentSecond: 0,
          talentThird: 0,
          customerFirst: 0,
          customerSecond: 0,
          customerThird: 0
        },
        countTeam: {
          talentFirst: 0,
          talentSecond: 0,
          talentThird: 0,
          customerFirst: 0,
          customerSecond: 0,
          customerThird: 0
        },
        list: [],
        interview: [],
        interviewTeam: [],
        showInterview: false,
        showInterviewTeam: false,
        columns: [
          {
            title: '姓名',
            key: 'talentName',
            width: 120,
            align: 'center',
            render: (h, params) => {
              const name = params.row.name || params.row.talentName;
              return h('div', {
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
                }, name)
              ]);
            }
          },
          {
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
                }, params.row.customerName)
              ]);
            }
          },
          {
            title: '面试时间',
            width: 150,
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind || {};
              return h('span', getDateTime(remind.interviewTime));
            }
          },
          {
            title: '沟通记录',
            align: 'center',
            // width: 420,
            render: (h, params) => {
              // const remind = this.getLastRemind(params.row.reminds || [], !!this.home ? params.row.status : this.status) || {};
              const remind = params.row.remind || {};
              const {type,status,createTime,recommendation,killRemark,interviewTime,interviewTone,remark,
                isLast,position,yearSalary,charge,sureTime,workTime,entryTime,probationTime,talentRemark,customerRemark,remarkStatus} = remind;
              const interview = [`面试时间：${getDateTime(interviewTime) || ''}`,`提醒对象：${params.row.createUser}`,`${!!interviewTone?'面试官：'+interviewTone:''}`].filter(item => !!item);
              const offer = [`岗位：${position}`,!!yearSalary?`年薪：${yearSalary}`:'',!!charge?`收费：${charge}`:'',`确认日期：${getDateTime2(sureTime) || ''}`,`预计上班时间：${getDateTime2(workTime) || ''}`].filter(item => !!item);
              const pass = [`入职时间：${getDateTime2(entryTime)}`,`试用期结束：${getDateTime2(probationTime)}`];
              const fk = [`人才反馈：${talentRemark}`,`客户反馈：${customerRemark}`];
              const recommend = [`推荐理由：${recommendation}`];
              const kill = [`淘汰：${killRemark}`];
              const rmk = [!!remark?`备注：${remark}`:'',`创建时间：${getDateTime2(createTime) || ''}`].filter(item => !!item);
              let arr;
              switch (type) {
                case 2:
                case 4:
                case 8: arr = interview;break;
                case 10: arr = offer;break;
                case 12: arr = pass;break;
                case 16:
                  arr = fk;
                  remarkStatus == 2 && arr.push(...interview);
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
        ],
        columnsTeam: [
          {
            title: '姓名',
            key: 'talentName',
            width: 120,
            align: 'center',
            render: (h, params) => {
              const name = params.row.name || params.row.talentName;
              return h('div', {
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
                }, name)
              ]);
            }
          },
          {
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
                }, params.row.customerName)
              ]);
            }
          },
          {
            title: '面试时间',
            width: 150,
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind || {};
              return h('span', getDateTime(remind.interviewTime));
            }
          },
          {
            title: '沟通记录',
            align: 'center',
            // width: 420,
            render: (h, params) => {
              // const remind = this.getLastRemind(params.row.reminds || [], !!this.home ? params.row.status : this.status) || {};
              const remind = params.row.remind || {};
              const {type,status,createTime,recommendation,killRemark,interviewTime,interviewTone,remark,
                isLast,position,yearSalary,charge,sureTime,workTime,entryTime,probationTime,talentRemark,customerRemark,remarkStatus} = remind;
              const interview = [`面试时间：${getDateTime(interviewTime) || ''}`,`提醒对象：${params.row.createUser}`,`${!!interviewTone?'面试官：'+interviewTone:''}`].filter(item => !!item);
              const offer = [`岗位：${position}`,!!yearSalary?`年薪：${yearSalary}`:'',!!charge?`收费：${charge}`:'',`确认日期：${getDateTime2(sureTime) || ''}`,`预计上班时间：${getDateTime2(workTime) || ''}`].filter(item => !!item);
              const pass = [`入职时间：${getDateTime2(entryTime)}`,`试用期结束：${getDateTime2(probationTime)}`];
              const fk = [`人才反馈：${talentRemark}`,`客户反馈：${customerRemark}`];
              const recommend = [`推荐理由：${recommendation}`];
              const kill = [`淘汰：${killRemark}`];
              const rmk = [!!remark?`备注：${remark}`:'',`创建时间：${getDateTime2(createTime) || ''}`].filter(item => !!item);
              let arr;
              switch (type) {
                case 2:
                case 4:
                case 8: arr = interview;break;
                case 10: arr = offer;break;
                case 12: arr = pass;break;
                case 16:
                  arr = fk;
                  remarkStatus == 2 && arr.push(...interview);
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
        ]
      }
    },
    methods: {
      goto(path, type) {
        this.$router.push({path, query: {type}});
      },
      goto2(path, type, status) {
        this.$router.push({path, query: {type, status}});
      },
      getProjectTalent() {
        this.show = true;
        getProjectTalentByStatus({
          userId: this.userId,
        }).then(data => {
          this.show = false;
          this.list = data || [];
        }).catch(data => {this.show = false;})
      },
    },
    created() {
      this.show = true;
      homeCount({ userId: this.userId, roleId: this.roleId==1 ? 1 : null }).then(data => {
        this.show = false;
        this.count = data || {};
      }).catch(data => {this.show = false;});
      interviewList({userId: this.userId, roleId: this.roleId==1 ? 1 : null }).then(data => {
        this.interview = data || [];
      }).catch(data =>{});
      if (this.roleId == 3) {
        homeCount({ userId: this.userId, roleId: 3 }).then(data => {
          this.show = false;
          this.countTeam = data || {};
        }).catch(data => {this.show = false;});
        interviewList({userId: this.userId, roleId: 3 }).then(data => {
          this.interviewTeam = data || [];
        }).catch(data =>{});
      }
      this.getProjectTalent();
    }
  }
</script>

<style scoped>
  .container {
    height: 180px;
  }
  .container .pd-10 {
    height: 100%;
  }
</style>
