<template>
  <CustomerManage :userId="userId" :type="1"/>
</template>

<script>
  import {getUserId} from "../../../libs/tools";
  import CustomerManage from './../CustomerManage';
  export default {
    name: 'CustomerListee',
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
