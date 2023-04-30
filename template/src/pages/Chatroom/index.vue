<script setup>
import { GetInitialMessages, SendMessages, GetProfile } from "./api";
import HeaderComponent from "../../components/HeaderComponent.vue";
import { supabase } from '../../supabaseClient'
import { message } from "ant-design-vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();
const messages = ref([]);
const userInfo = ref(null);
const messagetext = ref("");
//创建一个侦听所有事件的处理程序。
onMounted(() => {
  supabase
    .channel("public:messages")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "messages",
      },
      (payload) => {
        GetInitialMessages()
          .then((res) => {
            messages.value = res;
          })
          .catch((err) => {
            message.error(err);
          });
      }
    )
    .subscribe();
    //查询个人信息
  if (router.currentRoute.value.query.id) {
    GetProfile(router.currentRoute.value.query.id).then((res) => {
      userInfo.value = res;
    });
  } else {
    message.error("请先登录");
  }
  //获取聊天数据
  GetInitialMessages()
    .then((res) => {
      messages.value = res;
    })
    .catch((err) => {
      message.error(err);
    });
});
//发送数据
const sendMessage = (values) => {
  SendMessages({
    user_id: userInfo.value.id,
    message: messagetext.value,
    avatar: userInfo.value.avatar,
    user_name: userInfo.value.user_name,
  })
    .then((res) => {
      if (res) {
        messagetext.value = "";
      }
    })
    .catch((err) => {
      message.error(err);
    });
};
</script>

<template>
  <a-layout style="height: 100vh">
    <HeaderComponent :type="3" />
    <a-content style="padding: 50px;width:70%">
      <a-row :gutter="16" class="overflow-y-auto bg-white">
        <a-col :span="16">
          <a-list item-layout="horizontal" v-if="messages.length>0" :data-source="messages">
            <template #renderItem="{ item }">
            <a-list-item>
              <a-list-item-meta :description="item.message">
                <template #avatar>
                  <a-avatar :src="item.imgUrl" />
                </template>
                <template #title>
                  <span>{{ item.profile.user_name }}</span>
                </template>
              </a-list-item-meta>
            </a-list-item>
            </template>
          </a-list>
        </a-col>
      </a-row>
      <a-form @submit="sendMessage" class="w-4/5 relative -bottom-6">
        <a-row :gutter="16">
          <a-col :span="16">
            <a-form-item name="message">
              <a-input
                v-model:value="messagetext"
                placeholder="Type your message here"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <a-button type="primary" htmlType="submit"> 发送 </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-content>
  </a-layout>
</template>
