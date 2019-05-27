<template>
  <Card>
    <div>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId" clearable>
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Select placeholder="客户" filterable v-model="searchData.customerId" clearable>
          <Option v-for="(item, index) of customerList" :key="'customer' + index" :value="item.id">{{ item.name }}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Select placeholder="项目总监" class="w200" v-model="searchData.teamId" clearable>
          <Option v-for="(item, index) of teamList" :value="item.id" :key="'team' + index">{{ item.name }}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Cascader clearable placeholder="城市" v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.name" clearable/>
      </SearchItem>
      <SearchItem>
        关注状态：
        <RadioGroup v-model="searchData.follow">
          <Radio :label="0">全部</Radio>
          <Radio :label="1">已关注</Radio>
          <Radio :label="2">未关注</Radio>
        </RadioGroup>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="search">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="resetSearch">重置查询条件</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" v-if="roleId == 3" @click="showFavoriteSetting = true">项目收藏夹管理</Button>
      </SearchItem>
    </div>
    <ManagerView ref="manager" :del="false" :save="{save: roleId == 3}" route="/project/project-edit" :columns="columns" :searchData="searchParams" />
    <Drawer :width="360" title="项目收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting :type="3" @on-change="setFolders"/>
    </Drawer>
  </Card>
</template>

<script>
  import { globalSearch, getDateTime, getUserInfoByKey, getUserId } from "../../../libs/tools";
  import { getListByTableName } from "../../../api/common";
  import { projectList, toggleFollow } from "../../../api/project";
  import cityList from '../../../libs/cityList';
  import FavoriteSetting from '../../components/favorite-setting';

  export default {
    name: "ProjectManage",
    components: {
      FavoriteSetting
    },
    data() {
      return {
        roleId: null, // 角色id
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        teamList: [],
        customerList: [],
        searchData: {
          folderId: null,
          customerId: null,
          teamId: null,
          city: [],
          industry: '',
          follow: 0,
        },
        columns: [
          {
            title: '项目ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '项目名称',
            align: 'center',
            key: 'name',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small',
                },
                class: 'cl-primary',
                on: {
                  click: () => {
                    this.$router.push('/project/project-detail?id=' + params.row.id);
                  }
                }
              }, params.row.name)
            }
          },
          {
            title: '项目负责人',
            align: 'center',
            key: 'createUser',
          },
          {
            title: '创建时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              const btn = [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/project/project-detail', query: {id: params.row.id}});
                    }
                  }
                }, '查看详情'),
              ];
              const userId = getUserId();
              if (params.row.createUserId == userId) {
                btn.push(
                  h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'primary',
                      size: 'small',
                    },
                    on: {
                      click: () => {
                        this.$router.push({ path: '/project/project-edit', query: {id: params.row.id}});
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggle', {
                          params: {
                            id: params.row.id,
                            follow: !params.row.follow
                          }
                        });
                      }
                    }
                  }, params.row.follow ? '取消关注' : '关注')
                )
              }
              return h('div', btn);
            }
          }
        ]
      }
    },
    computed: {
      searchParams() {
        const { folderId, customerId, teamId, city, industry, follow } = this.searchData;
        return {
          folderId,
          customerId,
          teamId,
          city: city.length ? JSON.stringify(city) : null,
          industry: industry.trim(),
          follow: follow == 0 ? null : follow == 1,
          userId: getUserId(),
          status: 4,
        }
      }
    },
    methods: {
      setFolders(list) {
        this.folders = list;
      },
      resetSearch() {
        this.searchData = {
          folderId: null,
          customerId: null,
          teamId: null,
          city: [],
          industry: '',
          follow: 0
        }
      },
      search() {
        globalSearch(this);
      }
    },
    created() {
      this.roleId = getUserInfoByKey('roleId');
      getListByTableName({ type: 1 }).then(data => {
        this.customerList = data || [];
      }).catch(data => {});
      getListByTableName({ type: 5 }).then(data => {
        this.teamList = data || [];
      }).catch(data => {});
    },
    provide() {
      return {
        handlers: {
          search: projectList,
          toggle: toggleFollow
        }
      }
    }
  }
</script>

<style scoped>

</style>
