<template>
  <n-modal
    v-model:show="showModal"
    :mask-closable="false"
    preset="dialog"
    title="确认"
    content="你确认"
    positive-text="确认"
    negative-text="算了"
    @positive-click="onPositiveClick"
    @negative-click="onNegativeClick"
  />
</template>

<script setup lang="ts">
  import { useMessage } from 'naive-ui';
  import { ref } from 'vue';

  const message = useMessage();
  const showModal = ref(false);

  function onNegativeClick() {
    message.success('Cancel');
    showModal.value = false;
  }

  function onPositiveClick() {
    message.success('Submit');
    showModal.value = false;
  }
  function openModal() {
    showModal.value = true;
  }
</script>
