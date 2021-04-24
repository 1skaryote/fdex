<template>
    <div class="__container">

        <b-loading :is-full-page="true" v-model="isHSModalLoading" :can-cancel="false"></b-loading>

        <b-modal 
        :active.sync="showHSModal"
            has-modal-card
            trap-focus
            :destroy-on-hide="false"
            aria-role="dialog"
            aria-modal
            :can-cancel=[]
        >
            <div class="card __user-settings">
                <div class="__card-header">
                    <p>{{ title }}</p>                  

                </div>

                <div class="card-content">
                    <div class="content">                       
                     
                        <div class="__field-controls">
                            <p class="__title">Category</p>
                            <b-input v-model="hsItem.category" placeholder="Enter Category..." rounded></b-input>
                        </div>

                        <div class="__field-controls">
                            <p class="__title"> Product Code</p>
                            <b-input v-model="hsItem.code" placeholder="Enter product code..." rounded></b-input>
                        </div>

                        <div class="__field-controls">
                            <p class="__title">Product Title</p>
                            <b-input v-model="hsItem.title" placeholder="Enter product title..." rounded></b-input>
                        </div>

                        <div class="__field-controls">
                            <p class="__title">HS Code</p>
                            <b-input v-model="hsItem.hscode" placeholder="Enter HS code..." rounded></b-input>
                        </div>

                         <div class="__field-controls">
                            <p class="__title">Is Audited?</p>
                            <div class="selectWrapper">
                                <select class="selectBox" v-model="hsItem.isaudited">
                                    <option :key="index" v-for="(audit, index) in audited">{{ audit }}</option>
                                </select>
                            </div>
                           
                        </div>

                    </div>
                </div>
                <div class="__card-footer">

                    <div class="__required">
                        <p>All fields are required.</p>
                    </div>

                    <div class="__buttons">
                        <b-button type="is-primary"
                            @click="onSaveButtonClick"
                            title="Save"
                            icon-left="save">
                            Save
                        </b-button>

                        <b-button type="is-danger"
                            @click="toggleHSModal"
                            title="Close"
                            icon-left="ban">
                            Close
                        </b-button>
                    </div>
                    

                    
                </div>
            </div>
        </b-modal>
    </div>
</template>

<script>

import mixin from '../mixins/ShowMessageMixin'
import axios from 'axios'

export default {
    mixins: [mixin],
    data() {
        return {
            audited: [
                'Yes',
                'No'
            ],
            isHSModalLoading: false
        }
    },
    props: {
        hsItem: {
            type: Object,
            default: () => {
                return {
                    id: '',
                    category: '',
                    code: '',
                    title: '',
                    hscode: '',
                    isaudited: 'Yes'
                }
            }
        },
        showHSModal: {
            type: Boolean,
            default: false
        },
        isUpdateMode: {
            type: Boolean,
            default: false
        },
        id: {
            type: String,
            default: ''
        }
    },
    computed: {
        title() {
            return !this.isUpdateMode ? 'Add New HS Code' : 'Update HS Code'
        }
    },
    methods: {
        toggleHSModal() {
            this.$emit('toggleHSModal')
        },
        onSaveButtonClick() {

            if(this.hsItem.category == '' || this.hsItem.code == '' || this.hsItem.title == '' || this.hsItem.hscode == '') {
                this.showMessage(true,'All fields are required.')                
            } else {
                if(this.isUpdateMode) {
                    this.updateHsCode()
                } else {
                    this.addHsCode()
                }
            }

        },
        addHsCode() {

            this.isHSModalLoading = true
            const param = {
                IsAudited: this.hsItem.isaudited == 'Yes' ? true : false,
                Category: this.hsItem.category,
                Code: this.hsItem.code,
                Title: this.hsItem.title,
                Hs: this.hsItem.hscode
            }

            axios.post(`${this.$store.getters.getAppUrl}/hs/add`, param)
            .then(() => {
                
                this.isHSModalLoading = false
                this.showMessage(false,'New HS code has been added.')
                this.toggleHSModal()
                this.$emit('getAllHscodes')
                
            })
            .catch((error) => {
                this.isHSModalLoading = false
                console.log(error)
            })
        },
        updateHsCode() {
            this.isHSModalLoading = true
            const param = {
                IsAudited: this.hsItem.isaudited == 'Yes' ? true : false,
                Category: this.hsItem.category,
                Code: this.hsItem.code,
                Title: this.hsItem.title,
                Hs: this.hsItem.hscode
            }

            axios.post(`${this.$store.getters.getAppUrl}/hs/update/${this.hsItem.id}`, param)
            .then(() => {
                
                this.isHSModalLoading = false
                this.showMessage(false,'HS code has been updated.')
                this.toggleHSModal()
                this.$emit('getAllHscodes')
                
            })
            .catch((error) => {
                this.isHSModalLoading = false
                console.log(error)
            })
        },
        clearFields() {
            this.hsItem.category = ''
            this.hsItem.title = ''
            this.hsItem.code = '',
            this.hsItem.hscode = ''
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

.__card-footer {
    display: flex;
    gap: 15px;
    justify-content: space-between;
    padding: 1.5rem;
}

.__card-footer > .__required > p {
    margin-bottom: 0;
    color: red;
    font-weight: bold;
}

.__field-controls {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
    align-items: center;
}

.__field-controls > p {
    margin-bottom: 0 !important;
}

.__field-controls > .control {
    flex: 1;
}

.__title {
    width: 90px;
}

.selectWrapper{
  border-radius:36px;
  display:inline-block;
  overflow:hidden;
  background:#cccccc;
  border:1px solid #cccccc;
  display: flex;
  flex:1;
}
.selectBox{
  width: 100%;
  padding-left: 10px;
  height:40px;
  border:0px;
  outline:none;
}

.__card-footer > .__buttons {
    display: flex;
    gap: 15px;
    justify-content: space-between;
}

</style>