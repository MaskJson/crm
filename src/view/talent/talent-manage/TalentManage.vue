<template>
  <Card>
    <div>
      <SearchItem>
        <Cascader v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        <Input placeholder="姓名" class="w200" v-model="searchData.name"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="职能" class="w200" v-model="searchData.aptness"/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId">
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="search">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="resetSearch">重置查询条件</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="showFavoriteSetting = true">客户收藏夹管理</Button>
      </SearchItem>
    </div>
    <ManagerView ref="manager" :del="false" :save="{save: true}" route="/talent/talent-edit" :columns="columns" :searchData="searchParams"/>
    <Drawer :width="360" title="客户收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting :type="2" @on-change="setFolders"/>
    </Drawer>
  </Card>
</template>

<script>
  import { jsonArray, getCity, globalSearch, getStatusRender } from "../../../libs/tools";
  import { list, toggleFollow } from "../../../api/talent";
  import cityList from '../../../libs/cityList';
  import FavoriteSetting from '../../components/favorite-setting';
  import talentLogo from '@/assets/images/talent.png'

  export default {
    name: "TalentManage",
    components: {
      FavoriteSetting
    },
    computed: {
      searchParams() {
        const { name, industry, aptness, folderId, city } = this.searchData;
        return {
          aptness,
          name,
          industry,
          folderId,
          city: JSON.stringify(city),
        }
      },
    },
    data() {
      return {
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        searchData: {
          aptness: null,
          name: null,
          folderId: null,
          industry: null,
          city: []
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            align: 'center',
            key: 'name'
          },
          {
            title: '职能',
            align: 'center',
            key: 'aptness',
            render: (h, params) => {
              const aptness = jsonArray(params.row.aptness);
              return h('span', aptness ? aptness.join('、'): '--')
            }
          },
          {
            title: '行业',
            align: 'center',
            key: 'industry',
            render: (h, params) => {
              const industry = jsonArray(params.row.industry);
              return h('span', industry ? industry.join('、'): '--')
            }
          },
          {
            title: '城市',
            align: 'center',
            key: 'city',
            render: (h, params) => {
              return getCity(h, params.city);
            }
          },
          {
            title: '年薪',
            align: 'center',
            key: 'salary'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '标签',
            align: 'center',
            key: 'tag'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 200,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.id}});
                    }
                  }
                }, '查看详情'),
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/talent/talent-edit', query: {id: params.row.id}});
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
              ])
            }
          }
        ]
      }
    },
    methods: {
      setFolders(list) {
        this.folders = list;
      },
      resetSearch() {
        this.searchData = {
          aptness: null,
          name: null,
          folderId: null,
          industry: null,
          city: []
        }
      },
      search() {
        globalSearch(this);
      }
    },
    provide() {
      return {
        handlers: {
          search: list,
          toggle: toggleFollow
        }
      }
    }
  }
</script>

<style scoped>

</style>
