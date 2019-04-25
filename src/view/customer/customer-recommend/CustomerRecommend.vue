<template>
  <CustomerManage :userId="userId" :type="4"/>
</template>

<script>
  import {getUserId} from "../../../libs/tools";
  import CustomerManage from './../CustomerManage';
  export default {
    name: 'CustomerRecommend',
    components: {
      CustomerManage
    },
    data() {
      return {
        userId: getUserId(),
      }
    }
  }
</script>
