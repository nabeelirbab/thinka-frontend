<template>
  <div class="container bg-white height-max py-4 px-4">
    <h4>Profile</h4>
    <div class="border p-4 shadow-sm">
      <DynamicForm ref="form" :form-settings="formSettings" :readonly="isLoading" />
      <div class="text-right">
        <button @click="save" class="btn btn-success"><fa icon="check" /> Save</button>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicForm from '@/components/dynamic-form/DynamicForm'
import Auth from '@/core/auth'
import User from '@/api/user'
export default {
  components: {
    DynamicForm
  },
  mounted(){
    this.getUser()
  },
  data(){
    return {
      user: Auth.user(),
      isLoading: false,
      formSettings: {
        fields: {
          'user_basic_information.first_name': {
            label: 'First Name',
            placeholder: 'First Name (optional)',
            is_required: false
          },
          'user_basic_information.last_name': {
            label: 'Last Name',
            placeholder: 'Last Name (optional)',
            is_required: false
          },
          email: {
            type: 'email'
          },
          username: {},
          password: {
            label: 'New Password',
            help_text: 'You can leave this as blank',
            type: 'password',
            is_required: false
          },
          verify_new_password: {
            type: 'password',
            custom_validation: (value, formatData) => {
              const password = (typeof formatData['password'] !== 'undefined' && formatData['password'] !== null) ? formatData['password'] : ''
              const verifyPassword = (typeof value !== 'undefined' && value !== null) ? value : ''
              return (password !== verifyPassword) ? 'Password Mismatched' : false
            },
            is_required: false
          },
        }
      }
    }
  },
  methods: {
    getUser(){
      this.isLoading = true
      const param = {
        id: this.user.id,
        select: {
          user_basic_information: {
            select: ['first_name', 'last_name']
          },
          ...(['username', 'email'])
        }
      }
      User.retrieve(param).then(result => {
        if(result['data']){
          this.$refs.form._fillFormData(result['data'])
        }
      }).finally(() => {
        this.isLoading = false
      })
    },
    save(){
      if(this.$refs.form._isValid()){
        this.isLoading = true
        let param = this.$refs.form._getFormData()
        if(param['password'] === '' || param['password'] === null){
          delete param['password']
        }
        console.log(param['password'], param['password'] === '' || param['password'] === null)
        User.update(param).then(result => {
          if(result){
            this.user.username = param['username']
            console.log(result)
          }
        }).catch(error => {
          this.$refs.form._addRequestError(error)
        }).finally(() => {
          this.isLoading = false
        })
      }
    }
  },
}
</script>
