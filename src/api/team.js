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

// 获取团队信息
export const getTeamMembersWithInfo = (params) => {
  return getRequest('/team/membersWithInfo', params);
};

// 编辑团队
export const save = (params) => {
  return postJson('/team/save', params);
};

// 获取所有团队，团队管理页面和用户管理页面辞职交接
export const allTeam = (params) => {
  return getRequest('/team/all', params);
};

// 团队交接
export const connectTeam = (params) => {
  return postRequest('/team/connect/cp', params);
};

// 普通用户交接
export const connectTeamCommon = (params) => {
  return postRequest('/team/connect/common', params);
};
