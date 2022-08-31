<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-cascades"></i> 角色管理
                </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-delete" class="handle-del mr10" @click="delAllSelection">批量删除
                </el-button>
                <el-button type="primary" icon="el-icon-add" class="handle-del mr10" @click="saveMenu">新增</el-button>
                <el-input v-model="roleForm.roleName" placeholder="角色名称" class="handle-input mr10"></el-input>
                <el-input v-model="roleForm.roleKey" placeholder="用户权限名称" class="handle-input mr10"></el-input>
                角色状态： <el-select v-model="roleForm.status" placeholder="菜单状态" class="handle-select mr10">
                    <el-option label="正常" :value='0'></el-option>
                    <el-option label="停用" :value='1'></el-option>
                </el-select>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            </div>
            <el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleKey" label="角色权限"></el-table-column>
                <el-table-column label="角色状态：" align="center">
                    <template slot-scope="scope">
                        <el-tag :type="scope.row.status === 0 ? 'success' : (scope.row.status === 1 ? 'danger' : '')">
                            {{ scope.row.status === 0 ? '正常' : (scope.row.status === 1 ? '停用' : '') }}</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
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
                     :total="pageTotal" @current-change="handlePageChange">
                </el-pagination>
            </div>
        </div>

        <!-- 编辑弹出框 -->
        <el-dialog title="新增" :visible.sync="saveVisible" width="50%">
            <el-form ref="roleForm" :rules="rules" :model="roleForm" label-width="100px">
                <el-form-item label="角色名称:" prop="roleName">
                    <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色权限:" prop="roleKey">
                    <el-input v-model="roleForm.roleKey"></el-input>
                </el-form-item>
                <el-form-item label="功能权限:">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                    </el-input>
                    <el-tree class="filter-tree" :data="menuList" :props="defaultProps" :show-checkbox=true
                        node-key="id" highlight-current :filter-node-method="filterNode" ref="menuTree"
                        @check="getMenuData">
                    </el-tree>
                </el-form-item>
                <el-form-item label="角色状态:">
                    <el-radio-group v-model="roleForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" rows="5" v-model="roleForm.note"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="saveVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveMenuForm">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="roleForm" :model="roleForm" label-width="70px">
                <el-form-item label="用户名">
                    <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="roleForm.roleKey"></el-input>
                </el-form-item>
                <el-form-item label="功能权限:">
                    <el-input placeholder="输入关键字进行过滤" v-model="filterText">
                    </el-input>
                    <el-tree class="filter-tree" :data="menuList" :props="defaultProps" :show-checkbox=true
                        node-key="id" highlight-current :filter-node-method="filterNode" ref="menuTree"
                        :check-strictly="isCheck" @check="getMenuData">
                    </el-tree>
                </el-form-item>
                <el-form-item label="角色状态:">
                    <el-radio-group v-model="roleForm.status">
                        <el-radio :label='0'>正常</el-radio>
                        <el-radio :label='1'>停用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input type="textarea" rows="5" v-model="roleForm.note"></el-input>
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
    name: 'roletable',
    components: {
        TreeSelect,
    },
    data() {
        return {
            query: {
                status: '全部',
                roleName: '',
                roleKey: '',
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
            roleForm: {
                status: 0,
                pageIndex: 1,
                pageSize: 10
            },
            idx: -1,
            id: -1,
            rules: {
                roleName: [
                    { required: true, message: '请输入角色名称', trigger: 'blur' },
                    { max: 10, message: '长度不得超过 10 个字符', trigger: 'blur' }
                ],
                roleKey: [
                    { required: true, message: '请输入角色权限', trigger: 'blur' }
                ]
            },
            list: [],
            defaultProps: {
                children: 'children',
                label: 'menuName',
                id: "id",
            },
            filterText: '',
            menuList: [],
            isCheck: false,

        };
    },
    watch: {
        filterText(val) {
            this.$refs.menuTree.filter(val);
        }
    },
    created() {
        this.getData();
    },
    methods: {
        getMenuData(currentObj, treeStatus) {
            const AllcheckedNodes = this.$refs.menuTree.getCheckedNodes(false, true); // 利用这个方法就可以获取到子节点+父节点
            console.log(AllcheckedNodes)
            var array = [];
            for (let i = 0; i < AllcheckedNodes.length; i++) {
                console.log('moduleDataList[i].id  in getAllNodeId: ', AllcheckedNodes[i].id)
                array.push(AllcheckedNodes[i].id)
            }
            this.roleForm.menuIds = array;
        },
        getMenuList() {
            this.$post("/system/menu/getAllList", { "status": 0 }).then(res => {
                console.log(res);
                this.menuList = res.list;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.menuName.indexOf(value) !== -1;
        },
        // 获取 easy-mock 的模拟数据
        getData() {
            this.$post("/system/role/findAllRole", this.roleForm).then(res => {
                console.log(res);
                this.pageTotal = res.page.totalElements;
                // this.roleForm.pageIndex =res.page
                // this.roleForm.pageSize =res.page.numberOfElements;
                this.tableData = res.page.content;
            }).catch(err => {
                console.log(res);
                console.log("err=>", err)
            })
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.roleForm, 'pageIndex', 1);
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
                    this.$post("/system/role/deleteRole", param).then(res => {
                        console.log(res);
                        if (res) {
                            this.$message.success('删除成功');
                            this.tableData.splice(index, 1);
                        } else {
                            this.$message.success('删除失败');
                        }

                    }).catch(err => {
                        console.log("err=>", err)
                        this.$message.error('删除失败');
                    })

                })
                .catch(() => {
                    console.log("err=>" + err)
                });
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
            this.roleForm = row;
            console.log(row)
            this.getMenuList();
            this.editVisible = true;

            this.getMenu(row);
        },
        getMenu(row) {
            this.$post("/system/menu/findMenuRolesByRoleId", { "roleId": row.id }).then(res => {
                console.log(res);
                this.roleForm.menuIds = res.list;

                this.isCheck = true
                this.$nextTick(() => {
                    debugger
                    console.log("修改回显====>" + this.roleForm.menuIds);
                    this.$refs.menuTree.setCheckedKeys(this.roleForm.menuIds);
                    this.isCheck = false;
                })
            }).catch(err => {
                console.log("err=>", err)
            })
        },

        saveMenu() {
            // this.idx = index;
            // this.form = row;
            this.saveVisible = true;
            this.getMenuList()
        },
        // 保存编辑
        saveEdit() {
            // this.$set(this.tableData, this.idx, this.form);
            this.$post("/system/role/updateRole", this.roleForm).then(res => {
                console.log(res);
                this.$message.success(`修改第 ${this.idx + 1} 行成功`);
                this.editVisible = false;
            }).catch(err => {
                console.log("err=>", err)
            })
        },
        saveMenuForm(formName) {
            this.$refs.roleForm.validate((valid) => {
                if (valid) {
                    //alert('submit!');
                    this.$post("/system/role/saveRole", this.roleForm).then(res => {
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
            this.$set(this.roleForm, 'pageIndex', val);
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
