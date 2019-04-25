<template>
  <CustomerManage :userId="userId"/>
</template>

<script>
  import {getUserId} from "../../../libs/tools";
  import CustomerManage from './../CustomerManage';
  export default {
    name: 'CustomerListeeAll',
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
