import { getRequest, postRequest } from "../libs/axios";

/**
 * 公共模块
 * @param params
 */

// 根据表名和name按需获取模块列表
export const getListByTableName = (params) => {
  return getRequest('/common/list', params);
};

// 下载文件
export const uploadFile = (params) => {
  return postRequest('/common/file', params);
};

