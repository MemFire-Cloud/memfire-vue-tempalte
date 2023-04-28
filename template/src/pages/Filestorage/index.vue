



<script setup>
import { message } from "ant-design-vue";
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { UploadOutlined } from '@ant-design/icons-vue';
import HeaderComponent from "../../components/HeaderComponent.vue";
import { UploadFile, DownloadFile, removeFile, ListFile, ListProfixFile } from './api'
    const router = useRouter();
    const fileList= ref([]);
    const openKeys = ref(['all']);
    onMounted(() => {
        listFile()
    })
    const handleUpload = (file) => {
        const fileSize = file.size / 1024 / 1024 < 5;
        if (!fileSize) {
            message('图片应当小于5MB!', 1000)
        }
        return fileSize;
    };
    const customRequest = (option) => {
        UploadFile(option.file).then(res => {
            message.success('上传成功');
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const listFile = () => {
        ListFile().then(res => {
            fileList.value = res
        }).catch(err => {
            message.error(err);
        });
    };
    const downloadFile = (record) => {
        DownloadFile(record.name).then(res => {
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const deleteFile = (record) => {
        removeFile(record.name).then(res => {
            listFile()
        }).catch(err => {
            message.error(err);
        });
    };
    const changeMenu = (key) => {
        if (key.key === 'all') {
            listFile()
        } else {
            ListProfixFile(key.key).then(res => {
                fileList.value = res
            }).catch(err => {
                message.error(err);
            });
        }

    };
    const columns = [
        {
            title: "文件名称",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "大小",
            dataIndex: "size",
            key: "size",
        },
        {
            title: "创建时间",
            dataIndex: "created_at",
            key: "created_at",
        },
        {
            dataIndex: "action",
            title: "操作",
            key: "action",
        },
    ];
    
</script>

<template>
    <a-layout style="height: 100vh">
            <HeaderComponent type='2'/>
            <a-content>
            <a-layout>
                <a-layout-sider width="200px" className="site-layout-background">
                    <a-menu mode="inline" v-model:selectedKeys="openKeys" style="height: 100%;border-right: 0" @click="changeMenu">
                        <a-menu-item key="all">全部文件</a-menu-item>
                        <a-menu-item key="file">文件</a-menu-item>
                        <a-menu-item key="img">图片</a-menu-item>
                        <a-menu-item key="mp4">视频</a-menu-item>
                    </a-menu>
                </a-layout-sider>
                <a-layout style="padding: 0 24px 24px">
                    <a-content
                        className="site-layout-background"
                        style="padding: 24px;
                            margin: 0;
                            min-height: 280px"
                    >
                        <div style="margin-bottom: 16px">
                            <a-upload accept=".doc,.xml,.docx,.jpg,.mp4" :showUploadList="false" :customRequest="customRequest" :before-upload="handleUpload">
                                <a-button @click="downloadFile(record)">
                                    <upload-outlined></upload-outlined>上传文件
                                    </a-button>
                                
                            </a-upload>
                        </div>
                        <a-table :columns="columns" :dataSource="fileList" >
                        <template #bodyCell="{ column, record }">
                            <template v-if="column.dataIndex === 'action'">
                                <div class="editable-row-operations">
                                <span>
                                    <a-button type="link" @click="downloadFile(record)">
                                    <download-outlined></download-outlined>
                                        下载
                                    </a-button>
                                    <a-divider type="vertical" />
                                    <a-popconfirm title="确认删除？" @confirm="deleteFile(record)" >
                                        <a-button danger>删除</a-button>
                                    </a-popconfirm>
                                </span>
                                </div>
                            </template>
                            </template>
                        </a-table>
                    </a-content>
                </a-layout>
            </a-layout>
            </a-content>
            
        </a-layout>
</template>