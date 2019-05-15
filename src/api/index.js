// 统一请求路径前缀在libs/axios.js中修改
import { getRequest, postJson, postRequest, deleteRequest } from './../libs/axios'

// 个人中心编辑
export const userInfoEdit = (params) => {
  return postRequest('/user/edit', params)
};
// 个人中心修改密码
export const changePass = (params) => {
  return postRequest('/user/modifyPass', params)
};
// 获取全部用户数据
export const getAllUserData = (params) => {
  return getRequest('/user/getAll', params)
};

/********************************系统api**********************************/
// 获取登录用户权限菜单
export const getMenuList = (userId) => {
  return getRequest('/sys/permission/getMenuListByUserId')
};

// 登陆
export const login = (params) => {
  return postRequest('/sys/user/login', params)
};
// 获取用户数据 多条件
export const getUserListData = (params) => {
  return getRequest('/sys/user/getByCondition', params)
};
// 添加用户
export const addUser = (params) => {
  return postJson('/sys/user/add', params)
};
// 编辑用户
export const editUser = (params) => {
  return postJson('/sys/user/edit', params)
};
// 启用-禁用用户
export const enableUser = (params) => {
  return postRequest('/sys/user/editStatus', params);
};
// 删除用户
export const deleteUser = (ids, params) => {
  return deleteRequest(`/sys/user/delByIds/${ids}`, params)
};
// 获取全部角色数据
export const getAllRoleList = (params) => {
  return getRequest('/sys/role/getAllList', params)
};
// 分页获取角色数据
export const getRoleByPage = (params) => {
  return getRequest('/sys/role/getRoleByPage', params)
};
// 添加角色
export const addRole = (params) => {
  return postJson('/sys/role/add', params)
};
// 编辑角色
export const editRole = (params) => {
  return postJson('/sys/role/edit', params)
};
// 分配角色权限
export const editRolePerm = (params) => {
  return postRequest('/sys/role/editRolePerm', params)
};
// 删除角色
export const deleteRole = (ids, params) => {
  return deleteRequest(`/sys/role/delAllByIds/${ids}`, params)
};


// 获取全部权限数据
export const getAllPermissionList = (params) => {
  return getRequest('/sys/permission/getAllList', params)
};
// 添加权限
export const addPermission = (params) => {
  return postJson('/sys/permission/save', params)
};
// 删除权限
export const deletePermission = (ids, params) => {
  return deleteRequest(`/sys/permission/delByIds/${ids}`, params)
};

// 获取所有系统用户
export const getAllUsers = (params) => {
  return getRequest('/sys/user/allUsers', params);
};

// 用户自己修改密码
export const changePassword1 = (params) => {
  return postRequest('/sys/user/changePassword1', params);
};

// 管理员修改密码
export const changePassword2 = (params) => {
  return postRequest('/sys/user/changePassword2', params);
};
/**
 * 绩效管理
 * @param params
 * @returns {*}
 */
// 获取进展业绩
export const getProjectProgressInfo = (params) => {
  return getRequest('/performance/project/info', params);
};

// 上司获取成员进展业绩
export const getProjectProgressInfos = (params) => {
  return getRequest('/performance/project/infos', params);
};
// 获取进展业绩
export const getTalentRemindInfo = (params) => {
  return getRequest('/performance/talent/info', params);
};

// 上司获取成员进展业绩
export const getTalentRemindInfos = (params) => {
  return getRequest('/performance/talent/infos', params);
};
// 获取进展业绩
export const getCustomerRemindInfo = (params) => {
  return getRequest('/performance/customer/info', params);
};

// 上司获取成员进展业绩
export const getCustomerRemindInfos = (params) => {
  return getRequest('/performance/customer/infos', params);
};

// 获取报告
export const getReportInfo = (params) => {
  return getRequest('/performance/report/info', params);
};

// 上司获取成员报告
export const getReportInfos = (params) => {
  return getRequest('/performance/report/infos', params);
};

// 提交报告
export const saveReport = (params) => {
  return postJson('/performance/report/save', params);
};


