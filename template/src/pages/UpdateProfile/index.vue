<script setup>
import { message } from 'ant-design-vue';
import { ref ,onMounted ,watch} from "vue";
import { useRouter } from 'vue-router'
import { supabase } from "../../supabaseClient";
import { DownloadImage, UploadImage, UpdateProfile } from './api'
const router = useRouter()
const name = ref("");
const loading = ref(false);
const password = ref("");
const introduction = ref("");
const imageUrl = ref("");
const filePath = ref("");
    // 在这里做更新个人信息的操作
    const handleSubmit = (event) => {
        event.preventDefault();
        UpdateProfile({introduction:introduction.value,avatar:filePath.value,user_name:name.value}).then((res) => {
            if (res) {
                router.push({
                name: "profile"
            });
            message.success('修改成功')
            }
        }).catch(err => {
            message.error(err)
        })
    };
    // 获取个人信息
    onMounted(() => {
        getProfile()
    })
    // 下载文件
    watch(filePath, () => {
    if (filePath.value) downloadImage(filePath.value)
    })
    const handleChange =  (event) => {
        loading.value = true
        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('请选择一个图片上传')
        }
        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const path = `${fileName}`
        UploadImage(path, file).then((res) => {
            if (res) {
                filePath.value = path
            }
        }).catch(err => {
            message.error(err)
        }).finally(()=>{
            loading.value = false
        })
    }

    function downloadImage(path) {
        DownloadImage(path).then((res) => {
            if (res) {
                imageUrl.value = res
            }
        }).catch(err => {
            message.error(err)
        })
    }
    const getProfile =  async (event) => {
        const { data:{session}, error } = await supabase.auth.getSession()
            if (JSON.stringify(session.user.user_metadata) !== '{}') {
                    if(session.user.user_metadata.avatar){
                        downloadImage(session.user.user_metadata.avatar)
                    }
                    filePath.value = session.user.user_metadata.avatar
                    name.value = session.user.user_metadata.user_name
                    introduction.value = session.user.user_metadata.introduction
            }
    }
    const back = () => {
        router.back();
    }
</script>

<template>
        <div class="bg-gray-100 w-full min-h-screen flex flex-col items-center justify-center">
            <div class="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md">
                <h2 class="text-2xl font-bold mb-5">修改个人信息</h2>
                <form @submit="handleSubmit">
                    <div class="mb-5">
                        <label class="block font-bold mb-2" htmlFor="name">
                            头像
                        </label>
                            <img
                                :src="imageUrl"
                                v-if="imageUrl"
                                alt="Avatar"
                                class="avatar image"
                                style="height: 150px;width: 150px"
                            />
                            <div v-else class="avatar no-image" style="height: 150px;width: 150px" />
                        <div style="width: 150px">
                            <label class="button primary block text-center leading-8" htmlFor="single">
                                {{loading ? '上传中 ...' : '上传'}}
                            </label>
                            <a-input
                                style="visibility: hidden;position: absolute"
                                type="file"
                                id="single"
                                accept="image/*"
                                @change="handleChange"
                                :disabled="loading"
                            />
                        </div>
                    </div>
                    <div class="mb-5">
                        <label class="block font-bold mb-2" htmlFor="name">
                            姓名
                        </label>
                        <a-input
                            class="w-full px-3 py-2 border rounded-md"
                            id="name"
                            type="text"
                            v-model:value="name"
                            required
                        />
                    </div>
                    <div class="mb-5">
                        <label class="block font-bold mb-2" htmlFor="password">
                            个人介绍
                        </label>
                        <a-textarea :rows="4" required placeholder="maxLength is 250" v-model:value="introduction"  :maxLength='250' />
                    </div>
                    <div class='flex justify-between'>
                        <button type="submit" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md">
                            保存
                        </button>
                        <button type="text" @click="back" class="px-4 py-2 bg-white text-black rounded-md">
                            返回
                        </button>
                    </div>

                </form>
            </div>
        </div>
</template>
