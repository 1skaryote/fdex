<template>
    <div class="__container">
        <b-loading :is-full-page="true" v-model="isCheatSheetTableLoading" :can-cancel="false"></b-loading>

        <div v-if="isAdmin" class="__cheatsheet-control">
            <b-button type="is-info"              
                title="Add New HS Code"
                @click="toggleHSModal('',false)"
                icon-left="plus-circle">
                Add New HS Code
            </b-button>
        </div>

        <b-table :data="hscodes"
            :paginated="true"            
            :pagination-position="paginationPosition"
            :default-sort-direction="defaultSortDirection"                       
            per-page="20"
            :pagination-simple="true"                             
            aria-next-label="Next page"
            aria-previous-label="Previous page"
            aria-page-label="Page"    
            aria-current-label="Current page"   
            :striped="false"
            :hasMobileCards="hasMobileCards"
            :hoverable="true"        
        >

                <template v-for="column in columns">
                    <b-table-column :key="column.id" v-bind="column">
                        <template 
                            v-if="column.searchable"
                            #searchable="props">
                            <b-input
                                v-model="props.filters[props.column.field]"
                                :placeholder="column.placeholder"
                                :icon="column.icon"                             
                                rounded
                            />
                        </template>
                        <template v-if="column.field != 'Action'" v-slot="props">

                            {{ formatAudited(props.row[column.field],column.field) }}

                        </template>

                        <template v-else v-slot="props">
                            
                            <div v-if="isAdmin" class="__action-controls">
                                    <b-button size="is-small" @click="onDeleteButtonClick(props.row._id)" title="Delete HS Code" rounded icon-right="trash-alt"  type="is-danger">
                                    </b-button>
                                    
                                    <b-button @click="toggleHSModal(props.row, true)" size="is-small" title="Update HS Code" rounded icon-right="edit" type="is-success">
                                    </b-button>
                            </div>

                            <div v-else>
                                <p>—</p>
                            </div>

                        </template>

                         
                    </b-table-column>
                </template> 


         </b-table>        
         <HSModal @getAllHscodes="getAllHscodes" :isUpdateMode="isUpdateMode" :hsItem="hsItem" @toggleHSModal="toggleHSModal" :showHSModal="showHSModal"/>
    </div>
</template>

<script>

import axios from 'axios'
import HSModal from './HSModal'
import mixin from '../mixins/ShowMessageMixin'

export default {
    mixins: [mixin],
    components: {
        HSModal
    },
    props: {
        name: {
            type: String,
            default: 'Guest'
        }
    },
    data() {
        return {
            id: '',
            hscodes: [],
            isUpdateMode: true,
            showHSModal: false,           
            isCheatSheetTableLoading: false,
            defaultSortDirection : 'asc',
            totalPage : 0,
            perPage : 20,
            currentPage : 1, 
            paginationPosition : 'bottom',  
            hasMobileCards: true,
            columns: [
                {
                    id: '__id',
                    field: 'category',
                    label: 'Category',
                    width: '40',                    
                    searchable: true,
                    centered: true,
                    icon: 'search',
                    placeholder: 'Search Category...',
                    sortable: true
                    
                },
                {
                    field: 'code',
                    label: 'Product Code',
                    width: '40',                    
                    searchable: true,
                    centered: true,
                    icon: 'search',
                    placeholder: 'Search Product Code...',
                    sortable: true
                },
                {
                    field: 'title',
                    label: 'Product Title',
                    width: '40',                    
                    searchable: true,
                    centered: true,
                    icon: 'search',
                    placeholder: 'Search Product Title...',
                    sortable: true
                },
                {
                    field: 'hs',
                    label: 'HS Code',
                    width: '40',                    
                    searchable: true,
                    centered: true,
                    icon: 'search',
                    placeholder: 'Search HS Code...',
                    sortable: true
                },
                {
                    field: 'IsAudited',
                    label: 'Is Audited?',
                    width: '40',       
                    centered: true
                },
                {
                    field: 'Action',
                    label: 'Action',
                    width: '40',       
                    centered: true
                },
            ],
            hsItem: {
                id: '',
                category: '',
                code: '',
                title: '',
                hscode: '',
                isaudited: 'Yes'
            }
        }
    },
    computed: {
        isAdmin() {
                        
            const user = JSON.parse(localStorage.getItem('user'))          
            return user.IsAdmin

        },        
    },
    created() {
        this.getAllHscodes()
    },
    methods: {
        getAllHscodes() {
            this.isCheatSheetTableLoading = true
            this.hscodes = []
            axios.get(`${this.$store.getters.getAppUrl}/hs/getall`)
            .then((response) => {
                
                const result = response.data.hs
                this.hscodes = result.filter(x=>x.Active == true)                   
                this.isCheatSheetTableLoading = false
            
            })
            .catch((error) => {
                this.isCheatSheetTableLoading = false
                console.log(1)
                console.log(error)
            })
        },      
        onEditButtonClick(id) {
            console.log('id',id)
        },
        formatAudited(rowValue) {
       
            if(rowValue === true) return 'Yes'
            if(rowValue === false) return 'No'

            return rowValue
        },
        toggleHSModal(rowValue,isUpdate) {
            
            this.isUpdateMode = isUpdate

            if(isUpdate) {
                this.hsItem.id = rowValue._id
                this.hsItem.category = rowValue.category
                this.hsItem.code = rowValue.code
                this.hsItem.title = rowValue.title
                this.hsItem.hscode = rowValue.hs
                this.hsItem.isaudited = rowValue.IsAudited ? 'Yes' : 'No'
            } else {
                this.hsItem.id = ''
                this.hsItem.category = ''
                this.hsItem.code = ''
                this.hsItem.title = ''
                this.hsItem.hscode = ''
                this.hsItem.isaudited = 'Yes'
            }

            this.showHSModal = !this.showHSModal
            

        },
        onDeleteButtonClick(id) {
            var vm = this
            this.$buefy.dialog.confirm({
                title: 'Delete HS Code',
                message: 'Are you sure you want to <b>delete</b> this hs code?',
                confirmText: 'Delete HS Code',
                type: 'is-danger',
                hasIcon: true,
                icon: 'times-circle',
                iconPack: 'fa',
                ariaRole: 'alertdialog',
                ariaModal: true,
                onConfirm: () => {
                    
                    vm.isUserModalLoading = true
                    axios.post(`${vm.$store.getters.getAppUrl}/hs/deactivate/${id}`)
                        .then(() => {
                            
                            vm.getAllHscodes()
                            vm.showMessage(false,'HS code has been removed.')
                        })
                        .catch((error) => {
                            console.log(error)
                        })

                }


            })
        }
    },   
}
</script>

<style scoped>


.__container {

    padding: 20px;

}

.__hs {
    cursor: pointer;
}
.__cheatsheet-control {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 30px;
}

.__action-controls {
    display: flex;
    justify-content: space-evenly;
}

</style>