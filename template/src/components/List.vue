<script setup>
import { onMounted, ref ,watch } from "vue";
import { supabase } from "../supabaseClient";

const uploading = ref(false);
const loglist = ref([]);
const query = ref('');
const avatarUrl = ref(null);
const list = ref([]);
const filePath = ref(null);
onMounted(() => {
    getData();
    getMessagesAndSubscribe()
})
const getMessagesAndSubscribe = async () => {
    //创建一个侦听更改的事件处理程序
    supabase
        .channel('public:list')
        .on(
            'postgres_changes', {
            event: '*',
            schema: 'public',
            table: 'list'
        },
            async (payload) => {
                const { data, error } = await supabase
                    .from('log_list')
                    .insert([
                        { operat: payload.type }
                    ])
                getlogData()
            }
        ).subscribe();
}

const getlogData = async () => {
    try {
        let { data, error } = await supabase
            .from('log_list')
            .select("*")
        loglist.value = data
    } catch (error) {
        alert(error.message);
    }
}
const getData = async () => {
    try {
        let { data, error } = await supabase
            .from('list')
            .select("*")
        list.value = data
    } catch (error) {
        alert(error.message);
    }
}
// 执行添加操作
const handleAddRow = async () => {
    try {
        const { data, error } = await supabase
            .from('list')
            .insert([
                { id: Date.now(), content: '', editable: true }
            ])
        getData()
    } catch (error) {
        alert(error.message);
    }

};
//查询操作
const handleQuery = async () => {
    try {
        if (query) {
            let { data, error } = await supabase
                .from('list')
                .select("*").eq('content', query.value)
            list.value = data
        } else {
            let { data, error } = await supabase
                .from('list')
                .select("*")
            list.value = data
        }
    } catch (error) {
        alert(error.message);
    }
}
//删除操作
const handleRemoveRow = async (id) => {
    try {
        const { data, error } = await supabase
            .from('list')
            .delete()
            .eq('id', id)
        getData()
    } catch (error) {
        alert(error.message);
    }

};
//编辑操作
const handleEditRow = async (id) => {
    try {
        const { data, error } = await supabase
            .from('list')
            .update({ editable: true })
            .eq('id', id)
        getData()
    } catch (error) {
        alert(error.message);
    }

};
//编辑操作
const handleSaveRow = async (id, content) => {
    try {
        const { data, error } = await supabase
            .from('list')
            .update([
                { content: content, editable: false },
            ]).eq('id', id)
        getData()
    } catch (error) {
        alert(error.message);
    }
};

const handleInputChange = (id, event) => {
    list.value = list.value.map((item) => (item.id === id ? { ...item, content: event.target.value } : item))
};
// 下载文件

watch(filePath, () => {
  if (filePath.value) downloadImage(filePath.value)
})

async function downloadImage(path) {
    try {
        const { data, error } = await supabase.storage.from('avatars').download(path)
        if (error) {
            throw error
        }
        const url = URL.createObjectURL(data)
        avatarUrl.value = url
    } catch (error) {
        console.log('Error downloading image: ', error.message)
    }
}
//上传文件
async function uploadAvatar(event) {
    try {
        uploading.value = true

        if (!event.target.files || event.target.files.length === 0) {
            throw new Error('请选择一个图片上传')
        }

        const file = event.target.files[0]
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const filePaths = `${fileName}`

        let { error: uploadError } = await supabase.storage.from('avatars').upload(filePaths, file)
        if (uploadError) {
            throw uploadError
        }
        filePath.value = filePaths
    } catch (error) {
        alert(error.message)
    } finally {

        uploading.value = false
    }
}

const signOut = async ()=>{
  await supabase.auth.signOut()
}


</script>

<template>
<div class="container">
    <h2>数据表的增删改查</h2>
    <div class='flex'>
        <input class="search-bar" type="text" placeholder="搜索..." v-model="query" />
        <button class='b-m' @click="handleQuery">
            查询
        </button>
    </div>

    <table class="list-table">
        <thead>
            <tr>
                <th>内容</th>
                <th>操作</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(item) in list" :key="item.id">
                <td>
                    <input v-if="item.editable" type="text" :value="item.content"
                        @change="handleInputChange(item.id, $event)" />
                    <span v-else> {{item.content}} </span>
                </td>
                <td>
                    <button v-if="item.editable" @click="handleSaveRow(item.id, item.content)">保存</button>
                    <button v-else @click="handleEditRow(item.id)">编辑</button>
                    <button @click="handleRemoveRow(item.id)">删除</button>
                </td>
            </tr>
        </tbody>
    </table>
    <button class="add-button" @click="handleAddRow">
        添加
    </button>
    <h2>监听列表的变化（realtime）</h2>
    <table class="list-table">
        <thead>
            <tr>
                <th>操作日志</th>
                <th>时间</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="item in loglist" :key="item.id">
                <td>
                    对列表数据进行了 {{item.operat}}操作
                </td>
                <td>
                    {{item.created_at}}
                </td>
            </tr>
        </tbody>
    </table>
    <h2>文件的上传与下载</h2>

    <div>
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" class="avatar image" style="height: 150px; width: 150px " />
        <div v-else class="avatar no-image" style="height: 150px; width: 150px " />
        <div style="width: 150px">
            <label class="button primary block" htmlFor="single">
                {{uploading ? '上传中 ...' : '上传'}}
            </label>
            <input style="visibility:hidden;position:absolute" type="file" id="single" accept="image/*"
                @change="uploadAvatar" :disabled="uploading" />
        </div>
    </div>
    <button class="button block mt20" type="button" @click="signOut">
        退出登录
    </button>
</div>
</template>
