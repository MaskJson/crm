<template>
  <CustomerManage :userId="userId" :type="3"/>
</template>

<script>
  import {getUserId} from "../../../libs/tools";
  import CustomerManage from './../CustomerManage';
  export default {
    name: 'CustomerContact',
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
