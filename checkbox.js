

class CheckBox {
    constructor () {
        this.$password = document.getElementById('password');
        this.$checkbox = document.getElementById('checkbox');

       this.showPassword(); 
    }

    showPassword() {
        console.log(this.$checkbox)
        this.$checkbox.addEventListener('click' , () => {
            if(this.$checkbox.checked === false) {
                this.$password.type = 'password';
            }
            else {
                this.$password.type = 'text';
            }
        })
        
    }


   
}


let checkedbox = new CheckBox ();