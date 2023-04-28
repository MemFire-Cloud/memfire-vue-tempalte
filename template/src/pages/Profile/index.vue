<script setup>
import { message } from "ant-design-vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { SignOut, DownloadImage, GetProfile } from "./api";
import HeaderComponent from "../../components/HeaderComponent.vue";
const router = useRouter();
const profile = ref({});
const avatarUrl = ref(null);
const email = ref("");
onMounted(() => {
  getProfile();
});
const getProfile = () => {
  GetProfile(router.currentRoute.value.query.id)
    .then((res) => {
      if (res) {
        downloadImage(res[0].avatar);
        profile.value = res[0];
      }
    })
    .catch((err) => {
      message.error(err);
    });
};
const downloadImage = (path) => {
  DownloadImage(path)
    .then((res) => {
      if (res) {
        avatarUrl.value = res;
      }
    })
    .catch((err) => {
      message.info('暂无完整个人信息，请前去修改个人信息！');
    });
};
const signout = () => {
  SignOut()
    .then((res) => {
      router.push("/");
    })
    .catch((err) => {});
};
</script>

<template>
  <a-layout>
    <HeaderComponent :type="4" />
    <div className="bg-gray-100">
      <!-- {/* <button onClick={signout} className="bg-white-600 hover:bg-white-700 text-black py-2 px-4 rounded-full float-right border border-transparent text-base">退出登录</button> */} -->
      <div
        className="container mx-auto pt-10 pb-12 px-4 md:pt-16 md:pb-16 xl:pt-20 xl:pb-28 xl:px-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4">
            <img
              :src="avatarUrl || 'https://via.placeholder.com/300'"
              alt="Profile picture"
              className="max-w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="md:col-span-8">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              {{ profile?.user_name || "暂无" }}
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              {{ profile?.email || "暂无" }}
            </p>
            <p className="mt-5 text-lg text-gray-600">
              {{ profile?.introduction || "暂无" }}
            </p>
            <div className="mt-8 flex">
              <a
                :href="'#/updateProfile?id=' + router.currentRoute.value.query.id"
                className="w-full md:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600  md:py-4 md:text-lg md:px-10"
              >
                修改个人信息
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-layout>
</template>