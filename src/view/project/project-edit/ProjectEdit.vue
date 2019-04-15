<template>
  <Card>
    <Form ref="form" :label-width="100" :model="entity" :rules="entityRule">
      <h2 class="mb-10">项目基本信息</h2>
      <Row>
        <Col span="8">
          <FormItem label="客户" prop="customerId">
            <Select filterable v-model="entity.customerId" @on-change="customerChange">
              <Option v-for="(item, index) of customerList" :key="'customer' + index" :value="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="匹配条件">
            <Select multiple v-model="entity.matches">
              <Option v-for="(item, index) of match" :key="'match' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="项目优先级" prop="priority">
            <Select v-model="entity.priority">
              <Option :value="1">高</Option>
              <Option :value="2">中</Option>
              <Option :value="3">低</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="项目名称" prop="name">
            <Input placeholder="项目名称" v-model="entity.name"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="招聘数量" prop="amount">
            <InputNumber  v-model="entity.amount" :activeChange="false" :min="1" :parser="value => value ? Math.ceil(value).toString() : ''"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="项目费用(万)">
            <InputNumber  :min="0" v-model="entity.fee"/>
          </FormItem>
        </Col>
        <Col span="8" v-if="entity.id">
          <FormItem label="首推时间" prop="firstApplyTime">
            <DatePicker plactholder="首推时间" v-model="entity.firstApplyTime"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="计划完成时间" prop="finishTime">
            <DatePicker plactholder="计划完成时间" v-model="entity.finishTime"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="保证期">
            <Select v-model="entity.qualityType" placeholder="保证期">
              <Option v-for="(item, index) of qualityList" :key="'quality' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="项目开放属性">
            <RadioGroup v-model="entity.openType">
              <Radio :label="1">不开放（一周后自动开放）</Radio>
              <Radio :label="2">团队成员全部开放</Radio>
              <Radio :label="3">特定兼职开放</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <h2 class="mb-10">项目要求</h2>
      <Row>
        <Col span="8">
          <FormItem label="城市" prop="city">
            <Cascader v-model="entity.city" :data="cityList"></Cascader>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="名企背景">
            <Select placeholder="名企背景" v-model="entity.background">
              <Option v-for="(item, index) of background" :key="'back' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="24">
          <FormItem label="行业" class="ivu-form-item-required" prop="industry">
            <industry-select :model="entity.industry" :industry-list="industryList" @on-select="selectHandle"></industry-select>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="职能" class="ivu-form-item-required" prop="aptness">
            <aptness-select :model="entity.aptness" :aptness-list="aptnessList" @on-select="selectHandle2"></aptness-select>
          </FormItem>
        </Col>
        <Col span="24"></Col>
        <Col span="8">
          <FormItem label="国籍">
            <Select placeholder="国籍" v-model="entity.country">
              <Option v-for="(item, index) of countries" :key="'country' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="学历">
            <Select placeholder="学历" v-model="entity.education">
              <Option v-for="(item, index) of educationList" :key="'back' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="语言能力">
            <Select placeholder="语言能力" v-model="entity.language">
              <Option v-for="(item, index) of languageList" :key="'back' + index" :value="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="年龄要求(岁)">
            <InputNumber v-model="entity.ageStart" :min="1" :parser="value => value ? Math.ceil(value).toString() : ''"/> -
            <InputNumber v-model="entity.ageEnd" :min="(entity.ageStart || 1) + 1" :parser="value => value ? Math.ceil(value).toString() : ''"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="工作年限(年)">
            <InputNumber v-model="entity.yearStart" :min="0" :parser="value => value ? Math.ceil(value).toString() : ''"/> -
            <InputNumber v-model="entity.yearEnd" :min="(entity.yearStart || 1) + 1" :parser="value => value ? Math.ceil(value).toString() : ''"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="年薪范围(万)">
            <InputNumber v-model="entity.salaryStart" :min="0"/> -
            <InputNumber v-model="entity.salaryEnd" :min="(entity.salaryStart || 0) + 0.1"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="性别要求">
            <RadioGroup v-model="entity.sex">
              <Radio :label="1">无</Radio>
              <Radio :label="2">男</Radio>
              <Radio :label="3">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="是否独家">
            <RadioGroup v-model="entity.isOneself">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="是否保密">
            <RadioGroup v-model="entity.isSecrecy">
              <Radio :label="0">否</Radio>
              <Radio :label="1">是</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="新增/替代岗">
            <RadioGroup v-model="entity.isNew">
              <Radio :label="0">替代</Radio>
              <Radio :label="1">新增</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="职责范围&任职资格">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="职责范围&任职资格" v-model="entity.situation"/>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="职位亮点及优势">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="职位亮点及优势" v-model="entity.advantage"/>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="面试流程及领导介绍">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="面试流程及领导介绍" v-model="entity.introduce"/>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="薪资架构">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="薪资架构" v-model="entity.structure"/>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="寻访方向">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="寻访方向" v-model="entity.visit"/>
          </FormItem>
        </Col>
        <Col span="24">
          <FormItem label="客户在此岗位涉及业务领域的现状">
            <Input type="textarea" :maxlength="200" :rows="3" placeholder="客户在此岗位涉及业务领域的现状" v-model="entity.actuality"/>
          </FormItem>
        </Col>
      </Row>
      <h2 class="mb-10">项目推荐</h2>
      <Row>
        <!--<Col span="12">-->
          <!--<FormItem label="项目总监">-->
            <!--<Select placeholder="请选择项目总监" v-model="entity.teamId" filterable clearable>-->
              <!--<Option v-for="(item, index) of teamList" :key="'team' + index" :value="item.id">{{ item.name }}</Option>-->
            <!--</Select>-->
          <!--</FormItem>-->
        <!--</Col>-->
        <Col span="12">
          <FormItem label="特定兼职">
            <Select placeholder="请选择特定兼职" v-model="entity.partId" filterable clearable>
              <Option v-for="(item, index) of pts" :key="'pt' + index" :value="item.id">{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
    </Form>
    <div class="center mt-10">
      <Button type="primary" class="w120" @click="submit">提交</Button>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import IndustrySelect from '@/view/components/industry-select/industry-select.vue';
  import AptnessSelect from '@/view/components/industry-select/aptness-select.vue';
  import { industryList, aptnessList, background, language, educationList, countries, matches, projectPass } from "../../../libs/constant";
  import cityList from '../../../libs/cityList';
  import { getUserId, getProjectInfoUtil } from "../../../libs/tools";
  import { getListByTableName } from "../../../api/common";
  import { saveProject, getProjectInfo } from "../../../api/project";
  import { getCustomerDepartments, findProjectCustomers } from "../../../api/customer";

  export default {
    name: "ProjectEdit",
    components: {
      IndustrySelect,
      AptnessSelect
    },
    data() {
      return {
        show: false,
        showDepartment: false,
        customerList: [], // 客户列表
        cityList: cityList, // 城市
        industryList: industryList, // 行业
        aptnessList: aptnessList, // 职能
        languageList: language, // 语言
        background: background, // 企业背景
        educationList: educationList, // 学历
        countries: countries, // 国家
        teamList: [], // 团队
        match: matches, // 匹配条件
        qualityList: projectPass, // 保证期
        pts: [], // 兼职
        departments: [], // 部门
        departmentsFilter: [], // select部门过滤
        entity: {
          customerId: null, // 关联客户
          // department: null, // 部门
          name: null, // 名称
          matches: [], // 匹配条件
          amount: null, //招聘数量
          fee: null, // 项目费用
          priority: null, // 项目优先级
          firstApplyTime: null, // 首推时间
          finishTime: null, // 计划完成时间
          qualityType: null, // 保证期
          openType: null, // 开放类型
          city: [], // 城市
          industry: [], // 行业
          aptness: [], // 职能
          background: null, // 名企背景
          country: null, // 国籍
          education: null, // 学历
          language: null, // 语言
          ageStart: null, // 起始年龄
          ageEnd: null, // 截止年龄
          yearStart: null, // 起始年限
          yearEnd: null, // 截止年限
          salaryStart: null, // 起始年薪
          salaryEnd: null, // 截止年薪
          sex: null, // 性别要求
          isSecrecy: null, // 是否保密
          isOneself: null, // 是否独家
          isNew: null, // 新增或替代岗位
          situation: null, // 职责和任职资格
          advantage: null, // 职位亮点
          introduce: null, // 面试流程
          structure: null, // 薪资架构
          visit: null, // 寻访方向
          actuality: null, // 客户在该领域的情况
          teamId: null, // 关联团队id
          partId: null, // 兼职人id
        },
        entityRule: {
          name: [
            { required: true, type: 'string', message: '请输入项目名', trigger: 'blur' }
          ],
          customerId: [
            { required: true, type: 'number', message: '请选择客户', trigger: 'change' }
          ],
          amount: [
            { required: true, type: 'number', message: '请填写招聘人数', trigger: 'change' }
          ],
          priority: [
            { required: true, type: 'number', message: '请选择项目优先级', trigger: 'change' }
          ],
          city: [
            { required: true, type: 'array', message: '请选择城市', trigger: 'change' }
          ],
          industry: [
            { required: true, type: 'array', message: '请选择行业', trigger: 'change' }
          ],
          aptness: [
            { required: true, type: 'array', message: '请选择职能', trigger: 'change' }
          ],
          firstApplyTime: [
            { required: true, type: 'date', message: '请选择首推时间', trigger: 'change' }
          ],
          finishTime: [
            { required: true, type: 'date', message: '请选择预计完成时间', trigger: 'change' }
          ]
        },
      }
    },
    methods: {
      // 项目客户及部门相关
      customerChange(id) {
        this.departments = [];
        getCustomerDepartments({id}).then(data => {
          this.departments = data || [];
        }).catch(data => {});
      },
      setName(department) {
        this.entity.department = department;
      },
      focusHandler() {
        this.showDepartment = true;
        this.findDepartment();
      },
      blurHandler() {
        setTimeout(() => {
          this.showDepartment = false;
        }, 150);
      },
      // 输入过滤部门
      findDepartment() {
        const department = (this.entity.department || '').trim();
        if (!department) {
          this.$set(this.departmentsFilter, this.departments);
          this.departmentsFilter = this.departments;
        } else {
          this.$set(this.departmentsFilter, this.departments.filter(item => item.name.indexOf(department) > -1));
          this.departmentsFilter = this.departments.filter(item => item.name.indexOf(department) > -1);
        }
      },
      selectHandle (value) {
        this.entity.industry = value;
        this.$refs['form'].validate(valid => {});
      },
      selectHandle2 (value) {
        this.entity.aptness = value;
        this.$refs['form'].validate(valid => {});
      },
      submit() {
        this.$refs['form'].validate(valid => {
          if (valid) {
            const entity = JSON.parse(JSON.stringify(this.entity));
            // if (entity.openType == 2 && !entity.teamId) {
            //   this.$Message.error('开放属性为团队开放，请选择项目总监');
            //   return;
            // }
            if (entity.openType == 3 && !entity.teamId) {
              this.$Message.error('开放属性为特定兼职开放，请选择兼职人员');
              return;
            }
            entity.city = JSON.stringify(entity.city);
            entity.matches = JSON.stringify(entity.matches);
            entity.industry = JSON.stringify(entity.industry);
            entity.aptness = JSON.stringify(entity.aptness);
            if (!entity.id) {
              entity.createUserId = getUserId();
            }
            this.show = true;
            saveProject(entity).then(data => {
              this.show = false;
              this.$router.push('/project/project-manage');
            }).catch(data => {this.show = false;});
          } else {
            this.$Message.error('请填写带*的必选项');
          }
        });
      }
    },
    created() {
      findProjectCustomers({}).then(data => {
        this.customerList = data || [];
      }).catch(data => {});
      getListByTableName({ type: 4 }).then(data => {
        this.pts = data || [];
      }).catch(data => {});
      getListByTableName({ type: 5 }).then(data => {
        this.teamList = data || [];
      }).catch(data => {});
      const id = (this.$route.query || {}).id;
      if (id) {
        this.show = true;
        getProjectInfo({id}).then(data => {
          this.show = false;
          this.entity = getProjectInfoUtil(data || {});
          getCustomerDepartments({id: this.entity.customerId}).then(data => {
            this.departments = data || [];
          }).catch(data => {});
        }).catch(data => {
          this.show = false;
          this.$Message.error('获取项目详情失败');
        });
      }
    },
    mounted() {
      document.addEventListener('click', (event) => {
        const e = event || window.event;
        if (e.srcElement.className.indexOf('input') < 0) {
          setTimeout(() => {
            this.showDepartment = false
          }, 100);
        }
      });
    }
  }
</script>

<style scoped>
  .company-item {
    list-style: none;
    border-bottom: none;
    padding: 3px 6px;
    font-size: 12px;
  }
  .company-item:hover {
    background: #f2f2f2;
  }
  .nameList {
    position: absolute;
    left: 0;
    top: 35px;
    width: 300px;
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
    border: solid 1px #9ea7b4 !important;
  }
</style>
