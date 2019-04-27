<!-- 人才进展情况 -->
<template>
  <div class="talent-progress">
    <Tabs v-model="status">
      <TabPane v-for="(tab, index) of projectTalentStatus" :key="'tab'+index" :label="tab.label" :name="tab.value"></TabPane>
    </Tabs>
    <Table :data="list" :columns="column" border></Table>

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
  import { projectTalentStatus, projectProgress } from "../../../../libs/constant";
  import { getCity, getDateTime, getStatusRender, toggleShow, getUserId, getUserInfoByKey } from "../../../../libs/tools";
  import { getProjectTalentByStatus, addProjectTalentRemind, reBack } from "../../../../api/project";

  export default {
    name: 'talent-progress',
    props: ['userList', 'flag'],
    data () {
      // 获取操作选项
      function renderAction(h, projectTalentId, type) {
        let action = [];
        // 添加选项
        const getAction = (text, status, actionType) => {
          const handler = () => {
            this.actionData = {
              projectTalentId,
              status: Number(status),
              remark: '',
              type: actionType,
              prevStatus: Number(this.status),
              prevType: type
            };
            toggleShow(this, 'remind', true);
          };
          action.push(h('Button', {
            props: {
              type: 'text'
            },
            on: {
              click: handler
            }
          }, text));
        };
        getAction('补充跟踪', this.status, 99);
        switch (this.status) {
          case '0':
            type != 100 ? getAction('推荐给客户', '0', 100) : action.push(h('span', {class: {'cl-error': true}}, '等待项目总监审核'));
            break;
          case '1':
            getAction('通知人才面试','1', 2);
            getAction('确认面试','2', 3);
            break;
          case '2':
            getAction('通知人才面试','2', 2);
            getAction('面试改期','2', 4);
            getAction('放弃面试','8', 5);
            getAction('人才确认面试','3', 6);
            break;
          case '3':
            getAction('面试待定','3', 7);
            getAction('复试','3', 8);
            getAction('offer谈判','3', 9);
            getAction('签订offer确定入职','4', 10);
            break;
          case '4':
            getAction('辞职中','4', 11);
            getAction('确认入职','5', 12);
            break;
          case '5':
            getAction('进入保证期','6', 13);
            break;
          case '6':
            getAction('通过保证期','7', 14);
            break;
          default:break;
        }
        if (['1','3','4','5','6'].indexOf(this.status)>-1) {
          getAction('淘汰', '8', 15);
        }
        if (this.status=='7' || this.status=='8') {
          action.push(h('span',{
            class: {
              'cl-success': this.status=='7',
              'cl-error': this.status=='8'&&type!=200,
              'cl-primary': this.status=='8'&&type==200
            }
          }, this.status=='7'?'已通过保证期':type == 200 ? '已在其他项目入职':'已淘汰'))
        }
        if (this.status != '0' && type != 200) {
          action.push(h('Button', {
            props: {
              type: 'text'
            },
            on: {
              click: () => {
                this.reBack(projectTalentId, this.status);
              }
            }
          }, '撤销'))
        }
        return action;
      }
      return {
        projectTalentStatus: projectTalentStatus,
        projectTalentRemindStatus: projectProgress,
        roleId: null,
        show: false,
        id: null,
        status: '0',
        current: 1,
        pageSize: 10,
        total: 0,
        list: [],
        column: [
          {
            title: '姓名',
            key: 'name',
            align: 'center'
          },
          {
            title: '职位',
            key: 'position',
            align: 'center',
          },
          {
            title: '城市',
            key: 'city',
            align: 'center',
            render: (h, params) => {
              return getCity(h, params.row.city);
            }
          },
          {
            title: '年薪（万元）',
            key: 'salary',
            align: 'center'
          },
          {
            title: '手机号',
            key: 'phone',
            align: 'center',
          },
          {
            title: '标签',
            key: 'tag',
            align: 'center',
          },
          {
            title: '人才状态',
            key: 'status',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '最后联系',
            key: 'updateTime',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
          {
            title: '操作',
            key: 'actions',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return renderAction.call(this, h, params.row.id, params.row.type);
            }
          }
        ],
        actionData: {
          projectTalentId: null,
          status: null,
          type: null,
          remark: null,
        }
      }
    },
    computed: {

    },
    methods: {
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
      // 添加跟踪记录
      addRemind() {
        this.show = true;
        addProjectTalentRemind({
          ...this.actionData,
          createUserId: getUserId(),
          roleId: this.roleId
        }).then(data => {
          this.show = false;
          toggleShow(this, 'remind', false);
          this.getProjectTalent();
        }).catch(data => {this.show = false;})
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
        this.column.unshift({
            title: '公司名称',
            key: 'customerName',
            align: 'center'
          },
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
          });
      }
      this.getProjectTalent();
      this.roleId = getUserInfoByKey('roleId');
    },
    watch: {
      status() {
        this.getProjectTalent();
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
