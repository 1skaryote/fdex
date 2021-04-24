
  let mixin = {
      methods: {
        showMessage(isError,message) {
              const type = isError ? 'is-danger' : 'is-primary'

            this.$buefy.snackbar.open({
                    message: message,
                    type: type,
                    position: 'is-top',                    
                    duration: 2500,                    
            })
          },
      }
  }

  export default mixin