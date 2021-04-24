<template>
    <div class="__container">
        <b-loading :is-full-page="true" v-model="isLoginLoading" :can-cancel="false"></b-loading>
        <div class="card">
            <div class="card-content">                
                <p class="header-caption">Welcome to FedEx HS Codes Cheatsheet</p>
                <hr>
                <div class="__controls">
                    <span>Username</span>
                    <b-input v-model="credentials.username" placeholder="Enter Username" 
                    rounded
                    icon="user"    
                    required
                    validation-message="Username is required">                
                    >                        
                    </b-input>
                </div> 
                <div class="__controls">
                    <span>Password</span>
                    <b-input v-model="credentials.password"                     
                    validation-message="Password is required"
                    required
                    icon="lock" placeholder="Enter Password" password-reveal type="password" rounded></b-input>
                </div>   
                <div class="__btn-controls">
                    <b-button type="is-danger"
                        title="Logged as Guest"
                        icon-left="sign-in-alt"
                        @click="onGuestButtonClick">
                        LOGGED AS GUEST
                    </b-button>
                     <b-button type="is-primary"
                        title="Login"
                        icon-left="sign-in-alt"
                        @click="onAdminButtonClick">
                        LOGGED AS ADMIN
                    </b-button>
                </div>            
            </div>            
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    data() {
        return {
            credentials: {
                username: '',
                password: ''
            },
            isLoginLoading: false
        }
    },
    methods: {
        onAdminButtonClick() {

            if(this.credentials.username == '' || this.credentials.password == '') {
                this.showMessage(true,'Username / Password is required.')
                this.clearFields()
            } else {
                this.submitCredentials()
            }

        },       
        showMessage(isError,message) {

            const type = isError ? 'is-danger' : 'is-primary'

            this.$buefy.snackbar.open({
                    message: message,
                    type: type,
                    position: 'is-top',                    
                    duration: 2500,                    
            })
        },
        onGuestButtonClick() {
             const user = {
                isAuthenticated: true,
                name: 'Guest',
                IsAdmin: false
            }

            localStorage.setItem('user', JSON.stringify(user))
            this.$router.push('/dashboard')
        },
        submitCredentials() {

            this.isLoginLoading = true
            axios.get(`${this.$store.getters.getAppUrl}/user/getall`)
                .then((response) => {
                    
                    const result = response.data.users.filter(x => x.Active == true)
                    const _user = result.filter(x=> x.username.toLowerCase() == this.credentials.username.toLowerCase() && x.password.toLowerCase() == this.credentials.password.toLowerCase())

                    console.log('result',result)

                    this.$store.dispatch('SET_APP_USERS', result)

                    this.isLoginLoading = false
                    if(_user.length == 0) {
                        this.showMessage(true,'Username / Password is incorrect. Please try again.')
                    } else {
                        console.log(_user)

                        const user = {
                            isAuthenticated: true,
                            name: _user[0].username,
                            IsAdmin: true
                        }

                        localStorage.setItem('user', JSON.stringify(user))
                        this.$router.push('/dashboard')
                    }

                })
                .catch((error) => {
                    
                    this.isLoginLoading = false
                    console.log(error)
            })
        },
        clearFields() {
            this.credentials = {
                username: '',
                password: ''
            }
        }
    }
}
</script>

<style scoped>

.__container {
   margin: 0;
   padding: 0;
   display: grid;
   place-content: center;
   min-height: 100vh;
   background-image: url('../assets/fedex.jpg');
   background-repeat: no-repeat;
   background-position: center;
   background-size: cover;
   -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;  
  width: 100%;
}

.card {
    /* box-shadow: 10px 10px 5px #afabab !important; */
    border: thin solid gainsboro;
}

.__controls {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
}

.__controls > .control {
    flex: 1;
}

.__btn-controls {
    margin-top: 50px;
    display: flex;
    justify-content: space-between;
}

.header-caption {
    font-weight: 600;
    font-size: 1.8rem;
}

</style>