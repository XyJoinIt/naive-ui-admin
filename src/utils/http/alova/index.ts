import { createAlova } from 'alova';
import VueHook from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { createAlovaMockAdapter } from '@alova/mock';
import { isString } from 'lodash-es';
import mocks from './mocks';
import { useUser } from '@/store/modules/user';
import { storage } from '@/utils/Storage';
import { useRouter, useRoute } from 'vue-router';
import { useGlobSetting, useLocalSetting } from '@/hooks/setting';
import { PageEnum } from '@/enums/pageEnum';
import { ResultEnum } from '@/enums/httpEnum';
import { isUrl } from '@/utils';

const { apiUrl, urlPrefix } = useGlobSetting();
const { useMock, loggerMock } = useLocalSetting();
const router = useRouter();
const route = useRoute();
const mockAdapter = createAlovaMockAdapter([...mocks], {
  // 全局控制是否启用mock接口，默认为true
  enable: useMock,
  // 非模拟请求适配器，用于未匹配mock接口时发送请求
  httpAdapter: adapterFetch(),
  // mock接口响应延迟，单位毫秒
  delay: 1000,
  mockRequestLogger: loggerMock,
  onMockError(error, currentMethod) {
    console.error('🚀 ~ onMockError ~ currentMethod:', currentMethod);
    console.error('🚀 ~ onMockError ~ error:', error);
  },
});

export const Alova = createAlova({
  baseURL: apiUrl,
  statesHook: VueHook,
  timeout: 20000,
  // 在开发环境开启缓存命中日志
  cacheLogger: process.env.NODE_ENV === 'development',
  requestAdapter: mockAdapter,
  beforeRequest(method) {
    const userStore = useUser();
    const token = userStore.getToken;
    // 添加 token 到请求头
    if (!method.meta?.ignoreToken && token.accessToken) {
      method.config.headers['Authorization'] = `Bearer ` + token.accessToken;
    }
    // 处理 api 请求前缀
    const isUrlStr = isUrl(method.url as string);
    if (!isUrlStr && urlPrefix) {
      method.url = `${urlPrefix}${method.url}`;
    }
    if (!isUrlStr && apiUrl && isString(apiUrl)) {
      method.url = `${apiUrl}${method.url}`;
    }
  },
  responded: {
    onSuccess: async (response, method) => {
      const res = (response.json && (await response.json())) || response.body;
      // 是否返回原生响应头 比如：需要获取响应头时使用该属性
      if (method.meta?.isReturnNativeResponse) {
        return res;
      }
      // @ts-ignore
      const Message = window.$message;
      // @ts-ignore
      const Dialog = window.$dialog;
      // 不进行任何处理，直接返回
      // 用于需要直接获取 code、result、 message 这些信息时开启
      if (method.meta?.isTransformResponse === false) {
        return res.data;
      }
      const LoginPath = PageEnum.BASE_LOGIN;
      if (ResultEnum.SUCCESS === res.code) {
        return res.data;
      }
      //业务错误
      if (ResultEnum.BUSINESS_ERROR === res.code) {
        Message?.error(res.msg);
        throw new Error(res.msg);
      }
      // 需要登录
      if (res.code === ResultEnum.UNAUTHORIZED) {
        Dialog?.warning({
          title: '警告',
          content: '未授权：登录状态已失效,请重新登录。',
          positiveText: '确定',
          draggable: true,
          closable: false,
          onPositiveClick: () => {
            storage.clear();
            window.location.href = LoginPath;
            router.replace({
              name: 'Login',
              query: {
                redirect: route.fullPath,
              },
            });
          },
          onMaskClick: () => {
            storage.clear();
            window.location.href = LoginPath;
            router.replace({
              name: 'Login',
              query: {
                redirect: route.fullPath,
              },
            });
          },
        });
        throw new Error('未授权：登录状态已失效');
      } else {
        Message?.error(res.msg);
        throw new Error(res.msg);
      }
    },
    onError: (err, _) => {
      // @ts-ignore
      const Message = window.$message;
      Message?.error(
        '连接后台接口失败，可能由以下原因造成：后端不支持跨域CORS、接口地址不存在、请求超时等，请联系管理员排查后端接口问题 '
      );
      throw new Error(err);
    },
  },
});
