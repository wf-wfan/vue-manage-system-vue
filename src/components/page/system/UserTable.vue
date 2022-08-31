<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 用户管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="saveMenu">新增</el-button>
                <el-input v-model="userForm.userName" placeholder="用户名称" class="handle-input mr10"></el-input>
                <el-input v-model="userForm.phoneNum" placeholder="手机号" class="handle-input mr10"></el-input>
                用户状态：<el-select v-model="userForm.status" placeholder="用户状态" class="handle-select mr10">
                    <el-option label="正常" :value="0"></el-option>
                    <el-option label="异常" :value="1"></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="userName" label="用户名称"></el-table-column>
                <el-table-column prop="nickName" label="用户昵称"></el-table-column>
                <el-table-column prop="phoneNum" label="手机号"></el-table-column>
                <el-table-column label="用户状态" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : (scope.row.status === 1 ? 'danger' : '')">
                            {{ scope.row.status === 0 ? '正常' : (scope.row.status === 1 ? '停用' : '') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间"></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑
                        </el-button>
                        <el-button type="text" icon="el-icon-delete" class="red"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination background layout="total, prev, pager, next" 
                     :total="pageTotal" @current-change="handlePageChange"></el-pagination>
            </div>
        </div>

        <!-- 保存弹出框 -->
        <el-dialog title="新增" :visible.sync="saveVisible" width="50%">
            <el-form ref="userForm" :rules="rules" :model="userForm" label-width="100px">
                <el-form-item label="用户名称:" prop="userName">
                    <el-input v-model="userForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称:" prop="nickName">
                    <el-input v-model="userForm.nickName"></el-input>
                </el-form-item>
                <el-form-item label="用户密码:" prop="passWord">
                    <el-input type="password" show-password v-model="userForm.passWord"></el-input>
                </el-form-item>
                <el-form-item label="角色:">
                    <el-select v-model="userForm.roleIds" multiple collapse-tags  placeholder="请选择角色"  @focus="eqNoClick">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户性别:">
                    <el-select v-model="userForm.sex" placeholder="请选择用户性别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态:">
                    <el-radio-group v-model="userForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="userForm.phoneNum"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="50%">
            <el-form ref="userForm" :model="userForm" label-width="100px">
                <el-form-item label="用户名称:" prop="userName">
                    <el-input v-model="userForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="用户昵称:" prop="nickName">
                    <el-input v-model="userForm.nickName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="用户密码:" prop="passWord">
                    <el-input v-model="userForm.passWord"></el-input>
                </el-form-item> -->
                <el-form-item label="角色:">
                    <el-select v-model="userForm.roleIds" multiple collapse-tags  placeholder="请选择角色"  @focus="eqNoClick">
                        <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户性别:">
                    <el-select v-model="userForm.sex" placeholder="请选择用户性别">
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="用户状态:">
                    <el-radio-group v-model="userForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号">
                    <el-input v-model="userForm.phoneNum"></el-input>
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
    name: 'usertable',
    components: {
        TreeSelect,
    },
    data() { 
    //       const generateData = _ => {
    //     const data = [];
    //     for (let i = 1; i <= 15; i++) {
    //       data.push({
    //         key: i,
    //         label: `备选项 ${ i }`,
    //         disabled: i % 4 === 0
    //       });
    //     }
    //     return data;
    //   };
        return {
           // data: [],
            value: [1, 4],
            query: {},
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            saveVisible: false,
            pageTotal: 0,
            userForm: {
                status: 0,
                pageIndex: 1,
                pageSize: 10
            },
            idx: -1,
            id: -1,
            rules: {
                userName: [
                    { required: true, message: '请输入用户名称', trigger: 'blur' },
                    { max: 10, message: '长度不得超过 10 个字符', trigger: 'blur' }
                ],
                nickName: [
                    { required: true, message: '请输入用户昵称', trigger: 'blur' },
                    { max: 10, message: '长度不得超过 10 个字符', trigger: 'blur' }
                ],
                passWord: [
                    { required: true, message: '请输入用户密码', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度不得少于 5 个字符不得超过 10 个字符', trigger: 'blur' }
                ]
            },
            list: [],
            options: [{
                value: 1,
                label: '男'
            }, {
                value: 2,
                label: '女'
            }, {
                value: 0,
                label: '未知'
            }],

            roleList:[],

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
        //角色调用接口
        eqNoClick(){
        this.$post("/system/role/findRolesByDelFlagAndStatus", {}).then(res => {
            console.log(res)
                        this.roleList = res.list;
                    }).catch(err => {
                        console.log("err=>", err)
                    })
        },

        // 获取 easy-mock 的模拟数据
        getData() {
            this.$post("/system/user/findUserList", this.userForm).then(res => {
                console.log(res);
                this.pageTotal = res.page.totalElements;
                this.tableData = res.page.content;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.userForm, 'pageIndex', 1);
            this.getData();
        },
        // 删除操作
        handleDelete(index, row) {
            var param = {
                "id": row.id
            }
            // 二次确认删除
            this.$confirm('确定要删除吗？', '提示', {
                type: 'warning'
            })
                .then(() => {
                    this.$post("/system/user/deleteUser", param).then(res => {
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
            debugger
            this.idx = index;
            console.log(row)
            this.userForm = row;
            this.getRole(row)
            this.editVisible = true;
        },
        getRole(row){
        this.$post("/system/role/findUserRolesByUserId", {"userId": row.id}).then(res => {
                        console.log(res);
                        this.userForm.roleIds = res.list;
                    }).catch(err => {
                        console.log("err=>", err)
                    })
        },
        saveMenu() {
            // this.idx = index;
            // this.form = row;
            this.saveVisible = true;

            this.getMenuTree();

        },
        getMenuTree() {
            // this.$post("/getMenuTree", {}).then(res => {
            //             console.log(res);
            //             const tree =  res.list;
            //             this.list=tree;
            //         }).catch(err => {
            //             console.log("err=>", err)
            //         })
        },
        // 保存编辑
        saveEdit() {
            // this.$set(this.tableData, this.idx, this.form);
            this.$post("/system/user/updateUser", this.userForm).then(res => {
                console.log(res);
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.editVisible = false;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        saveMenuForm(formName) {
            this.$refs.userForm.validate((valid) => {
                if (valid) {
                    console.log(this.userForm);
                    //alert('submit!');
                    this.$post("/system/user/saveUser", this.userForm).then(res => {
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
            this.$set(this.userForm, 'pageIndex', val);
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
