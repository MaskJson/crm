<!-- 人才进展情况 -->
<template>
  <div class="talent-progress">
    <Tabs v-model="status">
      <TabPane v-for="(tab, index) of projectTalentStatus" :key="'tab'+index" :label="tab.label" :name="tab.value"></TabPane>
    </Tabs>
    <Table :data="list" :columns="column" border></Table>

    <ModalUtil ref="remind" title="新增项目人才跟踪记录" :width="600" @on-ok="addRemind">
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
  import { getProjectTalentByStatus, addProjectTalentRemind } from "../../../../api/project";

  export default {
    name: 'talent-progress',
    props: ['userList'],
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
              type: actionType
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
            getAction('辞职中，确定入职时间','4', 11);
            getAction('确认入职，选择保证期','5', 12);
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
          action.push(h('span', this.status=='7'?'已通过保证期':'已淘汰'))
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
            title: '人才',
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
      // 添加跟踪记录
      addRemind() {
        this.show = true;
        addProjectTalentRemind({
          ...this.actionData,
          createUserId: getUserId(),
          roleId: this.roleId
        }).then(data => {
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
      this.id = Number(this.$route.query.id);
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
