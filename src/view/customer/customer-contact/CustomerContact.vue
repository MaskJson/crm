<template>
  <CustomerManage :userId="userId" :type="2"/>
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
