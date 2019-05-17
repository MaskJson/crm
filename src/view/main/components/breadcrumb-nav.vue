<template>
  <Breadcrumb>
    <BreadcrumbItem
      v-for="item in currentPath"
      :href="item.path"
      :key="item.name"
    ><span class="cursor" @click="goto(item)">{{ itemTitle(item) }}</span>
    </BreadcrumbItem>
  </Breadcrumb>
</template>

<script>
  export default {
    name: 'breadcrumbNav',
    props: {
      currentPath: Array
    },
    methods: {
      itemTitle(item) {
        if (typeof item.title === 'object') {
          return this.$t(item.title.i18n);
        } else {
          return item.title;
        }
      },
      goto(item) {
        if (item.name == 'home') {
          this.$router.push('/home');
        }
      }
    },
  };
</script>

