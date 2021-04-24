<template>
    <div class="__container">
        <div class="__header">
            <p class="__app-caption">FEDEX HS CODE CHEATSHEET</p>
            
            <div class="__user-control">

                 <b-icon
                    v-if="isAdmin"
                    @click.native="toggleUserSettingsModal"
                    class="__logout"
                    pack="fas"
                    title="User Settings"
                    icon="users-cog"
                    size="is-large">
                </b-icon>

                <div v-if="!isAdmin" class="__user">
                    <p>Welcome, GUEST</p>
                </div>

                <div v-else class="__user">
                   Welcome, <p> {{ name | upperCase }}</p>
                </div>

                <b-icon
                    @click.native="onLogouClick"
                    class="__logout"
                    pack="fas"
                    title="Logout"
                    icon="sign-out-alt"
                    size="is-large">
                </b-icon>

            </div>

        </div>
        <div class="__main">
            <CheatSheet :name="name"/>
        </div>
        <div class="__footer"></div>
        <UserSettings @toggleUserSettingsModal="toggleUserSettingsModal" :showUserModal="showUserModal"/>       
    </div>
</template>

<script>

import UserSettings from './UserSettings'
import CheatSheet from './Cheatsheet'

export default {
    data() {
        return {
            showUserModal: false,          
            searchSuccessor: '',
            successorList: [],                            
        }
    }, 
    components: {
        UserSettings,
        CheatSheet       
    },    
    computed: {
        isAdmin() {
                        
            const user = JSON.parse(localStorage.getItem('user'))          
            return user.IsAdmin

        },
        name() {

            const user = JSON.parse(localStorage.getItem('user'))
            return user.name
        }
    },
    methods: {
        toggleUserSettingsModal() {           
            this.showUserModal = !this.showUserModal
        },      
        onLogouClick() {
            localStorage.clear()
            this.$router.push('/')
        } 
        
    },
    filters: {
        upperCase(value) {
            return value.toUpperCase()
        }
    }
}
</script>

<style scoped>

.__container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: auto;
}

.__header {
    height: 70px;
    background-color: #4d148c;
    display: flex;
    padding-right: 40px;
    padding-left: 40px;
    justify-content: space-between;
    align-items: center;
}

.__app-caption {
    align-items: center;
    color: white;
    display: flex;
    font-size: 1.7rem;
}

.__main {
    flex: 1;
}

.__logout {
    color: white;
}

.__logout:hover {
    cursor: pointer;
}

.__user-control {
    display: flex;
    gap: 30px;
    color: white;
    align-items: center;
}

.__user {
    font-size: 1.7rem;
    display: flex;
    gap: 10px;
}

.__user > p {
    font-weight: 600;
}

</style>