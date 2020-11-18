<template>
  <div class="mt-4 pt-4">
    <div class="row">
      <div class="col-12 col-md-5 offset-md-3">
        <div class="p-4 border ml-auto" style="max-width:500px">
          <form>
            <h5 class="mb-3">Registration Form</h5>
            <div class="form-group row">
              <label for="staticEmail" class="col-sm-12 col-form-label font-weight-bold">First Name</label>
              <div class="col-sm-12">
                <input v-model="firstName" :class="typeof validationErrors['firstName'] !== 'undefined' ? 'is-invalid' : ''" class="form-control " type="text"  placeholder="First Name">
                <div class="invalid-feedback">
                  {{validationErrors['firstName']}}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="staticEmail" class="col-sm-12 col-form-label font-weight-bold">Last Name</label>
              <div class="col-sm-12">
                <input v-model="lastName" :class="typeof validationErrors['lastName'] !== 'undefined' ? 'is-invalid' : ''" type="text" class="form-control" placeholder="Last Name">
                <div class="invalid-feedback">
                  {{validationErrors['lastName']}}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="staticEmail" class="col-sm-12 col-form-label font-weight-bold">Email</label>
              <div class="col-sm-12">
                <input v-model="email" :class="typeof validationErrors['email'] !== 'undefined' ? 'is-invalid' : ''" type="email" class="form-control" placeholder="Your Email">
                <div class="invalid-feedback">
                  {{validationErrors['email']}}
                </div>
              </div>
            </div>
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-12 col-form-label font-weight-bold">Password</label>
              <div class="col-sm-12">
                <input v-model="password" :class="typeof validationErrors['password'] !== 'undefined' ? 'is-invalid' : ''" type="password" class="form-control" id="inputPassword" placeholder="Password" min="4">
                <div class="invalid-feedback">
                  {{validationErrors['password']}}
                </div>
              </div>
            </div>
            <div class="text-center">
              <span v-if="isLoading">Registering...</span>
              <div v-else-if="hasRegistered">
                <fa icon="check" /> Your account has been registered! <br />
                <button @click="logIn" type="button" class="btn btn-success font-weight-bold mt-1">Log In</button>
              </div>
              <button v-else @click="register" type="button" class="btn btn-primary btn-lg"> Register Now</button>
            </div>
          </form>
        </div>
      </div>
      <div class="col-12 col-md-4" style="padding-right: 80px">
        <img src="@/assets/images/register.png" class="w-100" style="margin-top:180px;"/>
      </div>
    </div>
  </div>
</template>
<script>
import UserAPI from '@/api/user'
import Auth from '@/core/auth'
export default {
  data(){
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      validationErrors: {},
      isLoading: false,
      hasRegistered: false
    }
  },
  methods: {
    register(){
      this.isLoading = true
      console.log(this.isFormValid())
      if(this.isFormValid()){
        console.log('ok')
        UserAPI.register({
          user_basic_information: {
            first_name: this.firstName,
            last_name: this.lastName,
          },
          username: (this.firstName + this.lastName).toLowerCase(),
          email: this.email,
          password: this.password,
          status: 1,
          pin: '1234',
        }).then(result => {
          console.log(result)
          this.isLoading = false
          this.hasRegistered = true
        }).catch(error => {
          console.log('error catched')
          this.isLoading = false
          const { code: errorCode, message: errorMessage } = error.response.data.error
          console.log('error', errorCode, errorMessage)
          if(parseInt(errorCode) === 1){ // validation error
            if(typeof errorMessage['basic_information.first_name'] !== 'undefined'){
              this.validationErrors['firstName'] = errorMessage['basic_information.first_name'][0]
            }
            if(typeof errorMessage['basic_information.last_name'] !== 'undefined'){
              this.validationErrors['last_name'] = errorMessage['basic_information.last_name'][0]
            }
            if(typeof errorMessage['email'] !== 'undefined'){
              this.validationErrors['email'] = errorMessage['email'][0]
            }
            if(typeof errorMessage['password'] !== 'undefined'){
              this.validationErrors['password'] = errorMessage['password'][0]
            }
          }
        })
      }else{
        this.isLoading = false
      }
    },
    isFormValid(){
      this.validationErrors = {}
      if(this.firstName === ''){
        this.validationErrors['firstName'] = 'Required'
      }
      if(this.lastName === ''){
        this.validationErrors['lastName'] = 'Required'
      }
      if(this.email === ''){
        this.validationErrors['email'] = 'Required'
      }else if(this.email.indexOf('@') < 0){
        this.validationErrors['email'] = 'Must be a valid email'
      }
      if(this.password === ''){
        this.validationErrors['password'] = 'Required'
      }else if(this.password.length < 3){
        this.validationErrors['password'] = 'Must be at least 3'
      }
      return Object.keys(this.validationErrors).length === 0
    },
    logIn(){
      // this.isLoading = true
      Auth.logIn(this.email, this.password).then(() => {
        this.$router.push('dashboard')
      })
    }
  },
  computed: {
    hasValidationError(){
      return Object.keys(this.validationErrors).length
    }
  }
}
</script>