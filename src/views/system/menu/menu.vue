<template>
  <n-card class="n-layout-page-header">
    <n-flex>
      <span class="text-query">标题:</span>
      <n-input style="width: 15%" v-model:value="formValue.name" placeholder="输入标题" clearable />
      <n-button attr-type="button"> 查 询 </n-button>
    </n-flex>
  </n-card>
  <n-card class="mt-4 proCard">
    <n-flex justify="space-between">
      <n-button type="primary" v-if="hasPermission(['menu.add'])" @click="addMenu">
        新增菜单
      </n-button>
    </n-flex>
    <n-data-table
      class="mt-2"
      :loading="loading"
      :row-key="(row) => row.id"
      :columns="columns"
      :data="treeData"
      :pagination="pagination"
      :bordered="false"
    />
  </n-card>
  <CreateModal ref="createModalRef" />
</template>

<script setup lang="ts">
  import { NButton, NTag } from 'naive-ui';
  // import { constantRouterIcon } from '@/router/icons';
  import { h, onMounted, ref } from 'vue';
  import { getMenuList } from '@/api/system/menu';
  import { Menu } from '@/router/types';
  import { usePermission } from '@/hooks/web/usePermission';
  import CreateModal from './CreateModal.vue';
  const treeData = ref<Menu[]>([]);
  const loading = ref(false);
  const columns = createColumns();
  const pagination = false as const;
  const { hasPermission } = usePermission();
  const createModalRef = ref();
  const formValue = ref({
    name: '',
  });
  function createColumns() {
    return [
      {
        title: '标题',
        key: 'title',
        width: 200,
      },
      {
        title: '名称',
        key: 'name',
        width: 200,
      },
      {
        title: '类型',
        key: 'menuType',
        width: 100,
        render(row) {
          switch (row.menuType) {
            case 10:
              return h(NTag, { type: 'info' }, () => '目录');
            case 20:
              return h(NTag, { type: 'success' }, () => '菜单');
            case 30:
              return h(NTag, { type: 'warning' }, () => '按钮');
            default:
              return h(NTag, { type: 'error' }, () => '未知');
          }
        },
      },
      // {
      //   title: '图标',
      //   key: 'ico',
      //   width: 100,
      //   render(row) {
      //     if (row.icon) {
      //       return h(NIcon, null, constantRouterIcon[row.icon]);
      //     }
      //   },
      // },
      {
        title: '路由',
        key: 'path',
      },

      {
        title: '组件',
        key: 'component',
      },
      {
        title: '操作',
        key: 'action',
        width: 150,
        render(row) {
          return h('div', { style: { display: 'flex', gap: '8px' } }, [
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => {
                  console.log(row);
                },
              },
              { default: () => '编辑' }
            ),
            h(
              NButton,
              {
                type: 'error',
                size: 'small',
                onClick: () => {
                  console.log(row);
                },
              },
              { default: () => '删除' }
            ),
          ]);
        },
      },
    ];
  }

  const addMenu = () => {
    createModalRef.value.openModal();
  };
  const loadingData = async () => {
    loading.value = true;
    const treeMenuList = await getMenuList();
    treeData.value = treeMenuList;
    loading.value = false;
  };
  onMounted(async () => {
    loadingData();
  });
</script>
<style scoped>
  .text-query {
    align-items: center;
    display: flex;
  }
</style>
