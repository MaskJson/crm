<template>
  <Card>
    <div>
      <SearchItem>
        <InputNumber placeholder="客户id" class="w200" :min="1" :parser="value = value => value ? Math.floor(value) : value" v-model="searchData.id"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="客户名称" class="w200" v-model="searchData.name"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry"/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId">
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        <Cascader v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        <Button type="primary">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary">重置查询条件</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary">客户收藏夹管理</Button>
      </SearchItem>
    </div>
    <ManagerView :del="false" :save="null" :columns="columns"/>
  </Card>
</template>

<script>
  import { jsonArray, getCity } from "../../../libs/tools";
  import cityList from '../../../libs/cityList';

  export default {
    name: "CustomerManage",
    computed: {
      searchParams() {
        const { id, name, industry, folderId, city } = this.searchData;
        return {
          id,
          name,
          industry,
          folderId,
          city: JSON.stringify(city)
        }
      }
    },
    data() {
      return {
        folders: [], // 客户收藏夹
        cityList: cityList,
        searchData: {
          id: null,
          name: null,
          folderId: null,
          industry: null,
          city: []
        },
        columns: [
          {
            title: '公司名称',
            align: 'center',
            key: 'name'
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
            title: '行业',
            align: 'center',
            key: 'industry',
            render: (h, params) => {
              const industry = jsonArray(params.row.industry);
              return h('span', industry ? industry.join('、'): '--')
            }
          },
          {
            title: '类型',
            align: 'center',
            key: 'type',
            render: (h, params) => {
              const type = params.row.type;
              return h('span', type == 0 ? '普通客户' : type == 1 ? '拓展客户' : '签约客户')
            }
          },
          {
            title: '关联项目',
            align: 'center',
            key: 'projectCount'
          },
          // {title: '进展中', align: 'center', key: 'projecting'},
          // {title: '联系跟踪摘要', align: 'center', key: 'remindRecod'},
          {
            title: '最新跟踪时间',
            align: 'center',
            key: 'remindTime'
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '查看详情'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '取消关注')
              ])
            }
          }
        ]
      }
    },
    methods: {

    },
    provide() {
      return {
        handlers: {

        }
      }
    }
  }
</script>

<style scoped>

</style>
