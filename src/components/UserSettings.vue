<template>
    <div>
        <b-loading :is-full-page="true" v-model="isUserModalLoading" :can-cancel="false"></b-loading>
        <b-modal 
        :active.sync="showUserModal"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-modal
            :can-cancel=[]
        >
            <div class="card __user-settings">
                <div class="__card-header">
                    <p>User Settings</p>
                    <b-icon
                        class="__add-user"
                        pack="fas"
                        title="Add User"
                        icon="user-plus" 
                        @click.native="toggleAddUserModal"                       
                        size="is-large">
                    </b-icon>

                </div>

                <div class="card-content">
                    <div class="content">
                       
                       <b-table :data="users"
                        :paginated="true"            
                        :pagination-position="paginationPosition"
                        :default-sort-direction="defaultSortDirection"                       
                        per-page="7"
                        :pagination-simple="true"                             
                        aria-next-label="Next page"
                        aria-previous-label="Previous page"
                        aria-page-label="Page"    
                        aria-current-label="Current page"   
                        :striped="false"
                        :hasMobileCards="hasMobileCards"
                        :hoverable="true"
                        
                        >                           
                            <b-table-column field="username" sortable centered label="User" width="40" v-slot="props">
                                {{ props.row.username }}
                            </b-table-column>

                            <b-table-column field="Active" centered label="Is Active?" width="40" v-slot="props">
                                {{ props.row.Active | formatActive }}
                            </b-table-column>

                            <b-table-column field="Action" centered label="Action" width="40" v-slot="props">
                                <b-icon
                                    pack="fas"
                                    class="__user-delete"
                                    title="Delete User"
                                    @click.native="onDeleteButtonClick(props.row._id)"
                                    icon="user-times">
                                </b-icon>
                            </b-table-column>

                       </b-table>


                    </div>
                </div>
                <div class="__card-footer">
                    <b-button type="is-danger"
                        @click="toggleUserSettingsModal"
                        title="Close"
                        icon-left="ban">
                        Close
                    </b-button>
                </div>
            </div>
        </b-modal>


        <b-modal 
        :active.sync="showAddUserModal"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-modal
            :can-cancel=[]
        >
            <div class="card __add-user-settings">
                <div class="__card-header">
                    <p>Add User</p>
                </div>

                <div class="card-content">
                    <div>

                        <div class="__add-user-control">
                            <p>Username</p>
                            <b-input v-model="user.Username" icon="user" placeholder="Enter username" rounded></b-input>
                        </div>

                        <div class="__add-user-control">
                            <p>Password</p>
                            <b-input v-model="user.Password" icon="lock" placeholder="Click generate password" readonly rounded></b-input>
                           
                        </div>

                        
                        <div class="__add-user-control pw-generator">
                            <b-button type="is-success"
                                @click="onGeneratePasswordClick"
                                title="Generate Password"
                                icon-left="sync">
                                Generate Password
                            </b-button>
                           
                        </div>


                    </div>
                </div>
                <div class="__card-footer">

                  

                    <b-button type="is-primary"
                        @click="onSaveButtonClick"
                        title="Save"
                        icon-left="save">
                        Save
                    </b-button>

                    <b-button type="is-danger"
                        @click="toggleAddUserModal"
                        title="Cancel"
                        icon-left="ban">
                        Cancel
                    </b-button>
                </div>
            </div>
        </b-modal>

    </div>
</template>

<script>

import axios from 'axios'
import mixin from '../mixins/ShowMessageMixin'

export default {
    mixins: [mixin],
    props: {
        showUserModal: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            users: [],
            isUserModalLoading: false,
            defaultSortDirection : 'asc',
            totalPage : 0,
            perPage : 5,
            currentPage : 1, 
            paginationPosition : 'top',  
            hasMobileCards: true,
            showAddUserModal: false,
            user: {
                Username: '',
                Password: ''
            }
        }
    },
    computed: {
        appUsers() {
            return this.users
        }
    },
    watch: {
        showUserModal(newValue) {
            if(newValue) this.getAllUsers()
        }
    },
    methods: {
        toggleUserSettingsModal() {
            this.$emit('toggleUserSettingsModal')
        },
        getAllUsers() {

            this.isUserModalLoading = true
            this.users = []
            axios.get(`${this.$store.getters.getAppUrl}/user/getall`)
                .then((response) => {
                    
                    const result = response.data.users
                    this.users = result.filter(x=>x.Active == true)                   
                    this.isUserModalLoading = false
                })
                .catch((error) => {
                    this.isUserModalLoading = false
                    console.log(error)
                })
        },
        onDeleteButtonClick(id) {            
            this.confirmDelete(id)
        },
        confirmDelete(id) {
            this.$buefy.dialog.confirm({
                title: 'Delete User',
                message: 'Are you sure you want to <b>delete</b> this user?',
                confirmText: 'Delete User',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa',
                ariaRole: 'alertdialog',
                ariaModal: true,
                onConfirm: () => {
                    
                    this.isUserModalLoading = true
                    axios.post(`${this.$store.getters.getAppUrl}/user/deactivate/${id}`)
                        .then(() => {
                            
                            this.getAllUsers()
                            this.showMessage(false,'User has been removed.')
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }


            })
        },      
        toggleAddUserModal() {
            this.clearFields()
            this.showAddUserModal = !this.showAddUserModal
        },
        onGeneratePasswordClick() {
            
            const password = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
          
            this.user.Password = password.substring(0,7).toUpperCase()
            
        },
        onSaveButtonClick() {
            if(this.user.Username == '' || this.user.Password == '') {
                this.showMessage(true,'Username / Password is required.')
            } else {

                const isUsernameAlreadyExist = this.appUsers.filter(x=>x.username == this.user.Username)
              
                if(isUsernameAlreadyExist.length > 0) {
                    this.showMessage(true,'Username already exist. Please choose another username.')
                } else {                   
                    this.isUserModalLoading = true
                    this.addUserCommit()
                }
                
            }
        },
        addUserCommit() {

            const userCredential = {
                    Username: this.user.Username,
                    Password: this.user.Password
            }

            axios.post(`${this.$store.getters.getAppUrl}/user/add/`,userCredential)
            .then(() => {                
               
               this.isUserModalLoading = false
                this.showMessage(false,'User has been successfuly added.')
                this.clearFields()
                this.getAllUsers()
            })
            .catch((error) => {
                this.isUserModalLoading = false
                console.log(error)
            })

        },
        clearFields() {
            this.user.Password = ''
            this.user.Username = ''
        }
        
        
    },
    filters: {
       formatActive() {
           return 'Yes'
       }
    }
}
</script>

<style scoped>

.__user-settings {
    width: 650px;
    height: 500px;
    display: flex;
    flex-direction: column;
}

.__card-header {
    padding: 10px;
    background-color: #4d148c;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.__card-header > p {
    color: white;
    display: flex;
    font-size: 1.2rem;
 
}

.__card-header > .icon:hover {
    cursor: pointer;
}

.__card-footer {
    height: 80px;
    display: flex;
    align-items: center;
    padding: 1.5rem;
    justify-content: flex-end;
    gap: 10px;
}

.card-content  {
    margin-bottom: 20px;
}

.card-content,
.__add-user-control > .control {
    flex: 1;
    overflow: auto;
}

.__add-user {
    color: white;
}

.__user-delete {
    color: red;
}

.__user-delete:hover {
    cursor: pointer;
}

.__add-user-settings {
    width: 450px;
    height: 350px;
    display: flex;
    flex-direction: column;
}

.__add-user-control {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
    margin-bottom: 10px;

}

.pw-generator {
    justify-content: flex-end !important;
}


</style>