<template>
  <Card>
    <Form :label-width="100" ref="form" :model="entity" :rules="rules">
      <FormItem label="公司名称：" prop="name">
        <Input v-model="entity.name" placeholder="请输入公司名称" @on-blur="getCustomer(false, entity.name)"/>
        <span class="ml5 cl-error" v-if="checkCustomerStatus">该客户已存在</span>
      </FormItem>
      <FormItem label="公司网址：">
        <Input v-model="entity.website" placeholder="请输入公司网址"/>
      </FormItem>
      <FormItem label="行业：" prop="industry" class="ivu-form-item-required">
        <industry-select :model="entity.industry" :industry-list="industryList" @on-select="selectHandle"></industry-select>
      </FormItem>
      <FormItem label="公司手机号：" prop="telephone">
        <Input v-model="entity.telephone" placeholder="请输入公司联系手机号" :maxlength="11" @on-blur="checkPhone(entity.telephone)"/>
        <span class="ml5 cl-error" v-if="phoneError">手机号格式错误</span>
      </FormItem>
      <FormItem label="城市：" prop="city">
        <Cascader v-model="entity.city" :data="cityList"></Cascader>
      </FormItem>
      <FormItem label="邮箱：">
        <Input v-model="entity.email" placeholder="请输入公司邮箱" @on-blur="checkEmail(entity.email)"/>
        <span class="ml5 cl-error" v-if="emailError">邮箱格式错误</span>
      </FormItem>
      <FormItem label="公司规模：">
        <Input v-model="entity.scale" placeholder="公司规模"/>
      </FormItem>
      <FormItem label="福利：">
        <Input v-model="entity.welfare" placeholder="公司福利"/>
      </FormItem>
      <FormItem label="公司简介：">
        <Input type="textarea" :rows="5" :maxlength="500" v-model="entity.description" placeholder="请输入公司简介(500字以内)"/>
      </FormItem>
      <FormItem label="上传合同：" v-if="entity.type == 2">
        <Upload
          ref="upload"
          :action="action"
          :max-size="4096"
          :format="['doc', 'docx', 'pdf']"
          :default-file-list="[]"
          :show-upload-list="true"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
          :on-remove="uploadResumeRemove"
          :on-format-error="formatError"
          :on-exceeded-size="exceedSize">
          <Button icon="ios-cloud-upload-outline">上传合同</Button>
        </Upload>
        <Input v-model="entity.contractUrl" class="hide"/>
        <span class="mL20" v-if="entity.contractUrl">(已上传)</span>
      </FormItem>
    </Form>
    <div class="center mt-20">
      <Button type="primary" @click="addCustomer" class="w120" :disabled="unableSubmit || checkCustomerStatus">提交</Button>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { save, get } from "../../../api/customer";
  import { industryList } from "../../../libs/constant";
  import { getUserId } from "../../../libs/tools";
  import { getCustomerInfoUtil } from "../../../libs/tools";
  import cityList from '../../../libs/cityList';
  import IndustrySelect from '@/view/components/industry-select/industry-select.vue';

  export default {
    name: "CustomerEdit",
    components: {
      IndustrySelect,
    },
    data() {
      return {
        show: false,
        unableSubmit: false,
        checkCustomerStatus: false, // name去重
        emailError: false,
        phoneError: false,
        industryList: industryList,
        cityList: cityList,
        oldName: null,
        entity: {
          id: null,
          name: null, // 名称
          type: 0, // 类型
          city: [], // 所在城市
          industry: [], // 行业
          phone: '', // 手机
          website: null, // 网址
          scale: null, // 规模
          email: '', // 邮箱
          welfare: null, // 福利
          description: null, // 简介
          contractUrl: null, // 合同
        },
        rules: {
          name: [
            { required: true, type: 'string', message: '请输入客户名称', trigger: 'blur' }
          ],
          email: [
            { required: false, type: 'email', message: '邮箱格式有误', trigger: 'blur' }
          ],
          website: [
            { required: false, type: 'url', message: '网址格式有误', trigger: 'blur' }
          ],
          phone: [
            { required: false, regexp: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式有误', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      addCustomer() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const entity = JSON.parse(JSON.stringify(this.entity));
            entity.city = JSON.stringify(entity.city);
            entity.industry = JSON.stringify(entity.industry);
            if (!entity.id) {
              entity.createUserId = getUserId();
            }
            save(entity).then(data => {
              this.$router.push('/customer/customer-manage');
            }).catch(data => {

            })
          }
        })
      },
      getCustomer(flag, keyValue) {
        if (!flag) {
          if (!this.entity.name.trim() || this.entity.id && this.entity.name == this.oldName) {
            return;
          }
        }
        this.show = true;
        const params = flag ? { id: keyValue } : { name: keyValue };
        get(params).then(data => {
          this.show = false;
          if (flag) {
            this.entity = getCustomerInfoUtil(data || {});
          } else if (data) {
            this.checkCustomerStatus = true;
          } else {
            this.checkCustomerStatus = false;
          }
        }).catch(data => {
          this.show = false;
          this.checkCustomerStatus = false;
        })
      },
      selectHandle (value) {
        this.entity.industry = value;
      },
      checkEmail(val) {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (val.trim() && !reg.test(val)) {
          this.$Message.warning('邮箱格式错误');
          this.emailError = true;
        } else {
          this.emailError = false;
        }
      },
      checkPhone(val) {
        const reg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (val.trim() && !reg.test(val.trim())) {
          this.$Message.warning('手机号格式错误');
          this.phoneError = true;
        } else {
          this.phoneError = false;
        }
      },
      beforeUpload () {
        this.$refs.upload.clearFiles()
      },
      uploadSuccess (response, file, fileList) {

      },
      uploadResumeRemove() {
        this.entity.contractUrl = null;
      },
      uploadError (err, file, fileList) {

      },
      formatError () {
        this.$Message.info('请上传word文件或pdf文件')
      },
      exceedSize () {
        this.$Message.error('此文件大小必须小于4M')
      },
    },
    created() {
      const query = this.$route.query || {};
      if (query.id) {
        this.getCustomer(true, query.id);
      }
    }
  }
</script>

<style scoped>

</style>
