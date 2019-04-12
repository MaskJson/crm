<template>
  <Card>
    <ManagerView ref="manager" :del="false" :save="null" :columns="columns" :searchData="searchData" @on-success="successHandler" @on-error="errorHandler"/>
    <!--  诊断报告 -->
    <ModalUtil ref="report" title="项目诊断" @reset="report.remark = ''" :footerHide="true" :loading="show">
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
  </Card>
</template>

<script>
  import { getDateTime, getUserId, toggleShow } from "../../../libs/tools";
  import { reportPendingList } from "../../../api/count";
  import { getReportData, addReport } from "../../../api/project";

  export default {
    name: "ReportPending",
    data() {
      return {
        show: false,
        projectId: null,
        searchData: {
          userId: getUserId()
        },
        report: {
          remark: '',
          projectId: null,
          followId: null
        },
        reportCounts: { // 各个状态下的人才数

        },
        reportList: [], // 诊断记录
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: {
                  'cl-primary': true
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/project/project-detail', query: {id: params.row.projectId}});
                  }
                }
              }, params.row.projectName);
            }
          },
          {
            title: '提醒时间',
            key: 'createTime',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime))
            }
          },
          {
            title: '提醒者',
            key: 'createUser',
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            align: 'center'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.report.projectId = params.row.projectId;
                      this.report.followId = params.row.id;
                      this.$refs['manager'].emitManagerHandler('reportData', {
                        params: {
                          projectId: params.row.projectId
                        },
                        unFresh: true
                      })
                    }
                  }
                }, '诊断')
              ]);
            }
          },
        ]
      }
    },
    methods: {
      // 添加诊断
      addProjectReport(flag) {
        if (!this.report.remark.trim()) {
          this.$Message.error('请填写诊断报告');
          return ;
        }
        const params = {
          ...this.reportCounts,
          ...this.report,
          createUserId: getUserId(),
          type: 2,
          status: false,
        };
        this.show = true;
        this.$refs['manager'].emitManagerHandler('addReport', {
          params
        });
      },
      successHandler(type, data) {
        this.show = false;
        if (type == 'reportData') {
          data = data || {};
          this.reportCounts = data.counts;
          this.reportList = data.list;
          toggleShow(this, 'report', true);
        }
        if (type == 'addReport') {
          toggleShow(this, 'report', false);
        }
      },
      errorHandler() {
        this.show = false;
      }
    },
    provide() {
      return {
        handlers: {
          search: reportPendingList,
          reportData: getReportData,
          addReport: addReport
        }
      }
    }
  }
</script>

<style scoped>

</style>
