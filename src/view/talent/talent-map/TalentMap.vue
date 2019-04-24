<template>
  <Card>
    <Tabs v-model="status" :animated="false">
      <TabPane :label="`我的人才地图（${list.length}）`" name="0"></TabPane>
      <TabPane :label="`收藏的人才地图（${folderList.length}）`" name="2"></TabPane>
      <TabPane :label="`推荐的人才地图（${statusList.filter(item => item.status == 1).length}）`" name="1"></TabPane>
      <TabPane :label="`面试的人才地图（${statusList.filter(item => item.status == 3).length}）`" name="3"></TabPane>
      <TabPane :label="`offer人才地图（${statusList.filter(item => item.status == 4).length}）`" name="4"></TabPane>
      <TabPane :label="`成功人才地图（${statusList.filter(item => item.status == 7).length}）`" name="7"></TabPane>
    </Tabs>
    <div class="mt-20">
      <Collapse v-if="treeMap.length > 0">
        <Panel v-for="(c, indexC) of treeMap" :name="'customer' + indexC" :key="'customer' + indexC">
          {{c.name}}{{` (${c.zsCount}/${c.allCount})`}}
          <div slot="content">
            <Collapse :key="'collapse' + indexC">
              <Panel v-for="(d, indexD) of c.children" :name="'department' + indexD" :key="'department' + indexD">
                {{d.name}}{{` (${d.zsCount}/${d.allCount})`}}
                <div slot="content">
                  <Table class="talent-manager " :columns="columns" :data="d.children" border></Table>
                </div>
              </Panel>
            </Collapse>
          </div>
        </Panel>
      </Collapse>
      <div class="center pd-40" v-else>暂无相关人才</div>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { talentMap, folderTalent, statusTalent } from "../../../api/count";
  import { getUserId, getStatusRender, getRenderList, getDateTime } from "../../../libs/tools";

  export default {
    name: "TalentMap",
    data() {
      return {
        show: false,
        status: '0',
        list: [], // 所有相关人才
        statusList: [], // 经历过各个状态的
        folderList: [], // 收藏的人才,
        columns: [
          {
            title: '人才名称',
            key: 'talentName',
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
            title: '人才状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '职位',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).position)
            }
          },
          {
            title: '最近跟踪记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind;
              if (remind && remind.type){
                let arr = [];
                switch (remind.type) {
                  case 1:
                    arr = [`负责人：${remind.createUser}`, `跟踪记录：${remind.remark}`];
                    break;
                  case 2:
                    arr = [`负责人：${remind.createUser}`, `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                  case 3:
                    arr = [`负责人：${remind.createUser}`, `面试时间：${getDateTime(remind.meetTime)}`, `面试地点：${remind.meetAddress}`, `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                }
                return getRenderList(h, JSON.stringify(arr));
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '跟踪时间',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind;
              if (remind && remind.type){
                return h('span', getDateTime(remind.createTime));
              }
            }
          }
        ],
        projectColumns: [

        ]
      }
    },
    // 根据状态从数据中过滤出树状所需数据
    computed: {
      map() {
        if (this.status == 0) {
          return this.list;
        } else if (this.status == 2) {
          return this.folderList;
        } else {
          return this.statusList.filter(item => item.remindStatus == Number(this.status));
        }
      },
      treeMap() {
        const mapCustomers = [];
        this.map.forEach(item => {
          const info = item.info || {};
          const index = mapCustomers.findIndex(c => c.id == info.customerId);
          if (index < 0) {
            const id = info.customerId;
            const cusDepartments = this.map.filter(item => (item.info || {}).customerId == id).map(item => {return {departmentId: item.departmentId, departmentName: item.departmentName }});
            const departmentsSet = [];
            // 公司部门去重
            cusDepartments.forEach(item => {
              let flag = true;
              departmentsSet.forEach(d => {
                if (d.departmentId == item.departmentId) {
                  flag = false;
                }
              });
              if (flag) {
                departmentsSet.push(item);
              }
            });
            let custAllCount = 0;
            let custZsCount = 0;
            const departments = departmentsSet.map(item => {
              const children = this.map.filter(talent => (talent.info || {}).departmentId == item.departmentId);
              const allCount = children.length;
              const zsCount = children.filter(item => !!item.followUserId).length;
              custAllCount = custAllCount + allCount;
              custZsCount = custZsCount + zsCount;
              return {
                name: item.departmentName,
                allCount,
                zsCount,
                children
              }
            });
            mapCustomers.push({
              id,
              allCount: custAllCount,
              zsCount: custZsCount,
              name: item.customerName,
              children: departments
            })
          }
        });
        return mapCustomers;
      }
    },
    methods: {
      getTalentMap() {
        this.show = true;
        talentMap({ userId: getUserId() }).then(data => {
          this.show = false;
          data = data || [];
          data.forEach(item => {
            item.talentId = item.id;
            Object.assign(item, item.info);
          });
          this.list = data;
        }).catch(data => {this.show = false;})
      },
      getFolderTalentMap() {
        folderTalent({ userId: getUserId() }).then(data => {
          data = data || [];
          data.forEach(item => {
            item.talentId = item.id;
            Object.assign(item, item.info);
          });
          this.folderList = data;
        }).catch(data => {})
      },
      getProjectTalentMap() {
        statusTalent({userId: getUserId()}).then(data => {
          data = data || [];
          data.forEach(item => {
            Object.assign(item, item.info);
          });
          this.statusList = data;
        }).catch(data => {});
      }
    },
    created() {
      this.getTalentMap();
      this.getFolderTalentMap();
      this.getProjectTalentMap();
    }
  }
</script>

<style scoped>

</style>
