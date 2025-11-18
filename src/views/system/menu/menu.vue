<template>
  <n-card class="n-layout-page-header"> 312 </n-card>
  <n-card class="mt-4 proCard">
    <n-data-table
      :loading="loading"
      :row-key="(row) => row.id"
      :columns="columns"
      :data="treeData"
      :pagination="pagination"
      :bordered="false"
    />
  </n-card>
</template>

<script setup lang="ts">
  import { NButton, NTag } from 'naive-ui';
  import { h, onMounted, ref } from 'vue';
  import { getMenuList } from '@/api/system/menu';
  import { Menu } from '@/router/types';
  const treeData = ref<Menu[]>([]);
  const loading = ref(false);
  const columns = createColumns();
  const pagination = false as const;
  function createColumns() {
    return [
      {
        title: '标题',
        key: 'title',
      },
      {
        title: '名称',
        key: 'name',
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
      {
        title: '图标',
        key: 'ico',
        width: 100,
      },
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
  const loadingData = async () => {
    loading.value = true;
    const treeMenuList = await getMenuList();
    console.log(treeMenuList);
    treeData.value = treeMenuList;
    loading.value = false;
  };
  onMounted(async () => {
    loadingData();
  });
</script>
