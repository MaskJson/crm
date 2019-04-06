import { getRequest, postRequest, postJson } from "../libs/axios";



// 获取团队列表
export const getTeamList = (params) => {
  return getRequest('/team/list', params);
};

// 获取团队管理所需用户列表
export const getTeamManagerUsers = (params) => {
  return getRequest('/team/users', params);
};

// 获取团队信息
export const getTeamMembers = (params) => {
  return getRequest('/team/members', params);
};

// 编辑团队
export const save = (params) => {
  return postJson('/team/save', params);
};
