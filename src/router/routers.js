import Main from '@/view/main/Main.vue'

/**
 * iview-admin中meta除了原生参数外可配置的参数:
 * meta: {
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面不会缓存
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 * }
 */


// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里


export const otherRouter = {
  path: '/',
  name: 'otherRouter',
  redirect: '/home',
  component: Main,
  title: '首页',
  meta: {
    title: '首页'
  },
  children: [
    {
      path: 'home',
      name: 'home',
      title: '首页',
      meta: {
        hideInMenu: true,
        title: '首页',
        notCache: true,
      },
      component: () => import('@/view/home/home.vue')
    }
  ]
};

export const routers = [
  {
    ...otherRouter
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/401',
    name: 'error_401',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    meta: {
      hideInMenu: true
    },
    component: () => import('@/view/error-page/500.vue')
  },
  // {
  //   path: '*',
  //   name: 'error_404',
  //   meta: {
  //     hideInMenu: true
  //   },
  //   component: () => import('@/view/error-page/404.vue')
  // },
  {

    path: '/403',
    meta: {
      title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@/view/error-page/403.vue')
  },
  {
    path: '/locking',
    name: 'locking',
    component: () => import('@/view/main/components/lockscreen/components/locking-page.vue')
  }
]


