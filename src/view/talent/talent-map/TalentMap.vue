<template>
  <Card>
    <Tabs v-model="status" :animated="false">
      <TabPane label="我的人才地图" name="0"></TabPane>
      <TabPane label="收藏的人才地图" name="2"></TabPane>
      <TabPane label="推荐的人才地图" name="1"></TabPane>
      <TabPane label="面试的人才地图" name="3"></TabPane>
      <TabPane label="offer人才地图" name="4"></TabPane>
      <TabPane label="成功人才地图" name="7"></TabPane>
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
                  <Table :columns="columns" :data="d.children" border></Table>
                </div>
              </Panel>
            </Collapse>
          </div>
        </Panel>
      </Collapse>
      <div class="center pd-40" v-else>暂无相关人才</div>
    </div>
  </Card>
</template>

<script>
  import { talentMap, statusTalent, folderTalent } from "../../../api/count";
  import { getUserId, getStatusRender, getProjectTalentStatus, getDateTime } from "../../../libs/tools";

  export default {
    name: "TalentMap",
    data() {
      return {
        status: '0',
        list: [], // 所有相关人才
        statusList: [], // 经历过各个状态的
        folderList: [], // 收藏的人才,
        columns: [
          {
            title: '姓名',
            key: 'name',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                class: {
                  talent: params.row.followUserId
                }
              }, params.row.talentName)
            }
          },
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center'
          },
          {
            title: '客户名称',
            key: 'customerName',
            align: 'center'
          },
          {
            title: '部门名称',
            key: 'departmentName',
            align: 'center'
          },
          {
            title: '人才状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.talentStatus);
            }
          },
          {
            title: '项目进展状态',
            align: 'center',
            render: (h, params) => {
              return getProjectTalentStatus(h, params.row.status);
            }
          },
          {
            title: '最后跟进时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime));
            }
          },
        ],
      }
    },
    // 根据状态从数据中过滤出树状所需数据
    computed: {
      map() {
        if (this.status == 0) {
          return this.list;
        } else if (this.status == 2) {
          const folderIds = this.folderList.map(item => item.id);
          return this.list.filter(item => folderIds.indexOf(item.talentId) > -1);
        } else {
          return this.statusList.filter(item => item.remindStatus == Number(this.status));
        }
        return [];
      },
      treeMap() {
        const mapCustomers = [];
        this.map.forEach(item => {
          const index = mapCustomers.findIndex(c => c.id == item.customerId);
          if (index < 0) {
            const id = item.customerId;
            const departmentsSet = new Set(this.map.filter(item => item.customerId == id).map(item => item.departmentName));
            let custAllCount = 0;
            let custZsCount = 0;
            const departments = Array.from(departmentsSet).map(item => {
              const children = this.map.filter(talent => talent.departmentName == item);
              const allCount = children.length;
              const zsCount = children.filter(item => !!item.followUserId).length;
              custAllCount = custZsCount + allCount;
              custZsCount = custZsCount + zsCount;
              return {
                name: item,
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
          this.list = data || [];
        }).catch(data => {this.show = false;})
      },
      getStatusTalentMap() {
        statusTalent({ userId: getUserId() }).then(data => {
          this.statusList = data || [];
        }).catch(data => {})
      },
      getFolderTalentMap() {
        folderTalent({ userId: getUserId() }).then(data => {
          this.folderList = data || [];
        }).catch(data => {})
      }
    },
    created() {
      this.getTalentMap();
      this.getStatusTalentMap();
      this.getFolderTalentMap();
    }
  }
</script>

<style scoped>

</style>
