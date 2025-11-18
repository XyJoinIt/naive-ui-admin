import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_SCREENLOCKED } from '@/store/mutation-types';

import { getUserInfo as getUserInfoApi, login } from '@/api/system/user';
import { storage } from '@/utils/Storage';

export type UserInfoType = {
  // TODO: add your own data
  id: number | undefined;
  account: string;
  name: string;
  phone: string | undefined;
  tenantId: number;
  email: string | undefined;
};
export type TokenInfo = {
  accessToken: string;
  refreshToken: number;
};

export interface IUserState {
  token: TokenInfo;
  account: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: UserInfoType;
}
const ex = 7 * 24 * 60 * 60;
export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, {}),
    account: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
  }),
  getters: {
    getToken(): TokenInfo {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.account;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): UserInfoType {
      return this.info;
    },
  },
  actions: {
    setToken(token: TokenInfo) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info: UserInfoType) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      storage.set(ACCESS_TOKEN, response, ex); //用户token
      this.setToken(response);
      // 
      return response;
    },
    // 获取用户信息
    async getInfo() {
      const data = await getUserInfoApi();
      const permissionsList = data.permissions;
      this.setPermissions(permissionsList);
      storage.set(CURRENT_USER, data, ex); //当前用户信息
      this.setUserInfo(data);
      this.setAvatar(data.avatar);
      storage.set(IS_SCREENLOCKED, false); //是否锁屏
      return data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({
        id: 0,
        account: '',
        email: '',
        name: '',
        phone: '',
        tenantId: 0,
      });
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(store);
}
