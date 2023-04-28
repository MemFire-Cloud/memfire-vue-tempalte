



<script>
import { toRefs, ref } from "vue";
import { useRouter } from "vue-router";
import { SignOut } from "../pages/Profile/api";
export default {
  props: {
    type: String,
  },
  setup(props) {
    const router = useRouter();
    const type = ref([]);
    if (props.type == "1") {
      type.value.push("1");
    } else if (props.type == "2") {
      type.value.push("2");
    } else if (props.type == "3") {
      type.value.push("3");
    } else if (props.type == "4") {
      type.value.push("4");
    }
    const signout = () => {
      SignOut()
        .then((res) => {
          router.push("/");
        })
        .catch((err) => {});
    };
    return {
      signout,
      type,
      router,
    };
  },
};
</script>
<template>
  <div>
    <a-layout-header className="a-layout-header">
      <div className="logo" />
      <a-menu theme="dark" mode="horizontal" v-model:selectedKeys="type">
        <a-menu-item key="1"
          ><a :href="'#/crud?id=' + router.currentRoute.value.query.id">CRUD</a>
        </a-menu-item>

        <a-menu-item key="2"
          ><a :href="'#/filestorage?id=' + router.currentRoute.value.query.id"
            >网盘</a
          ></a-menu-item
        >
        <a-menu-item key="3"
          ><a :href="'#/chatroom?id=' + router.currentRoute.value.query.id"
            >聊天室</a
          ></a-menu-item
        >
        <a-menu-item key="4"
          ><a :href="'#/profile?id=' + router.currentRoute.value.query.id"
            >个人信息</a
          ></a-menu-item
        >
        <a className="absolute right-5" @click="signout">退出登录</a>
      </a-menu>
    </a-layout-header>
  </div>
</template>
