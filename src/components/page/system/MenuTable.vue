<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 菜单管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="saveMenu">新增</el-button>
                 <!-- <el-input v-model="menuForm.menuName" placeholder="菜单名称" class="handle-input mr10"></el-input> -->
                菜单状态 ：<el-select v-model="menuForm.status" placeholder="菜单状态" class="handle-select mr10">
                    <el-option label="正常" :value="0"></el-option>
                    <el-option  label="停用" :value="1"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
           
            <el-table :data="tableData" class="table" ref="multipleTable" header-cell-class-name="table-header"
                row-key="id" border 
                :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
                <el-table-column prop="menuName" label="菜单名称"></el-table-column>
                <el-table-column prop="menuUrl" label="菜单路径"></el-table-column>
                <el-table-column label="显示状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.visible === 0 ? 'success' : (scope.row.visible === 1 ? 'danger' : '')">
                            {{ scope.row.visible === 0 ? '显示' : (scope.row.visible === 1 ? '隐藏' : '') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="菜单状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : (scope.row.status === 1 ? 'danger' : '')">
                            {{ scope.row.status === 0 ? '正常' : (scope.row.status === 1 ? '停用' : '') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="date" label="注册时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="saveVisible" width="50%">
            <el-form ref="menuForm" :rules="rules" :model="menuForm" label-width="100px">
                <el-form-item label="菜单名称:" prop="menuName">
                    <el-input v-model="menuForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径:" prop="menuUrl">
                    <el-input v-model="menuForm.menuUrl"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型:">
                    <el-radio-group v-model="menuForm.menuType">
                        <el-radio :label='0'>目录</el-radio>
                        <el-radio :label='1'>菜单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上级菜单:">
                    <TreeSelect v-model="menuForm.pid" :data="list" style="width: 240px;"></TreeSelect>
                </el-form-item>

                <el-form-item label="菜单状态:">
                    <el-radio-group v-model="menuForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示状态:">
                    <el-radio-group v-model="menuForm.visible">
                        <el-radio :label='0'>显示</el-radio>
                        <el-radio :label='1'>隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图标:">
                    <el-input v-model="menuForm.icon"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="menuForm" :model="menuForm" label-width="100px">
                <el-form-item label="菜单名称:" prop="menuName">
                    <el-input v-model="menuForm.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单路径:" prop="menuUrl">
                    <el-input v-model="menuForm.menuUrl"></el-input>
                </el-form-item>
                <el-form-item label="菜单类型:">
                    <el-radio-group v-model="menuForm.menuType">
                        <el-radio :label='0'>目录</el-radio>
                        <el-radio :label='1'>菜单</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="上级菜单:">
                    <TreeSelect v-model="menuForm.pid" :data="list" style="width: 240px;"></TreeSelect>
                </el-form-item>

                <el-form-item label="菜单状态:">
                    <el-radio-group v-model="menuForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="显示状态:">
                    <el-radio-group v-model="menuForm.visible">
                        <el-radio :label='0'>显示</el-radio>
                        <el-radio :label='1'>隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="图标:">
                    <el-input v-model="menuForm.icon"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import TreeSelect from '../assembly/treeSelect.vue';
export default {
    name: 'menutable',
    components: {
        TreeSelect,
    },
    data() {
        return {
            query: {
                address: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            saveVisible: false,
            pageTotal: 0,
            form: {
            },
            menuForm: {
                menuType: 0,
                status: 0,
                visible: 0,
                pid: 0,
            },
            idx: -1,
            id: -1,
            rules: {
                menuName: [
                    { required: true, message: '请输入菜单名称', trigger: 'blur' },
                    { max: 10, message: '长度不得超过 10 个字符', trigger: 'blur' }
                ],
                menuUrl: [
                    { required: true, message: '请输入菜单路径', trigger: 'blur' }
                ]
            },
            list: [],

        };
    },
    watch: {
    },
    created() {
        this.getData();
    },
    methods: {
        // 选择器的树节点
        filterNode(value, data) {
            if (!value) return true;
            return data.label.indexOf(value) !== -1;
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            // fetchData(this.query).then(res => {
            //     console.log(res);
            //     this.tableData = res.list;
            //     this.pageTotal = res.pageTotal || 50;
            // });
            this.$post("/system/menu/getAllList", this.menuForm).then(res => {
                console.log(res);
                this.tableData = res.list;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            var param = {
                "id": row.id
            }
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$post("/system/menu/deleteMenu", param).then(res => {
                        console.log(res);
                        if (res) {
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        } else {
                            this.$message.success('删除失败');
                        }

                    }).catch(err => {
                        console.log("err=>", err)
                        this.$message.success('删除失败');
                    })

                })
                .catch(() => { });
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        delAllSelection() {
            const length = this.multipleSelection.length;
            let str = '';
            this.delList = this.delList.concat(this.multipleSelection);
            for (let i = 0; i < length; i++) {
                str += this.multipleSelection[i].name + ' ';
            }
            this.$message.error(`删除了${str}`);
            this.multipleSelection = [];
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.menuForm = row;
            this.editVisible = true;
        },
        saveMenu() {
            // this.idx = index;
            // this.form = row;
            this.saveVisible = true;

            this.getMenuTree();

        },
        getMenuTree() {
            this.$post("/system/menu/getMenuTree", {}).then(res => {
                console.log(res);
                const tree = res.list;
                this.list = tree;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        // 保存编辑
        saveEdit() {
            // this.editVisible = false;
            // this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            // this.$set(this.tableData, this.idx, this.form);
            this.$post("/system/menu/updateMenu", this.menuForm).then(res => {
                console.log(res);

                this.editVisible = false;
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        saveMenuForm(formName) {
            this.$refs.menuForm.validate((valid) => {
                if (valid) {
                    //alert('submit!');
                    this.$post("/system/menu/saveMenu", this.menuForm).then(res => {
                        console.log(res);
                        this.$message.success('保存成功');
                    }).catch(err => {
                        console.log("err=>", err)
                    })


                } else {
                    console.log('error submit!!');
                    return false;
                }
            });

        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}

.table {
    width: 100%;
    font-size: 14px;
}

.red {
    color: #ff0000;
}

.mr10 {
    margin-right: 10px;
}

.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}

.objectTree {
    margin-left: 0px;
    position: absolute;
    overflow: auto;
    z-index: 100;
    height: 200px;
    border: 1px solid #ddd;
    line-height: normal;
    z-index: 204;
}

.width-220 {
    width: 220px
}
</style>
