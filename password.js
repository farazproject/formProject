

class Password {
    constructor() {
        this.$password = document.getElementById('password');
        this.$submit = document.getElementById('submit');
 
        this.mouseUp();
        this.mouseDown();
    }

    mouseDown() {

        this.$submit.addEventListener('mousedown', () => {
            
            this.$password.type = 'text';
        });
    }

    mouseUp () {                                               //reg mouse up .. create separate functions in 
        this.$submit.addEventListener('mouseup', () => {
            this.$password.type = 'password';
        });
    }

}

let newPassword = new Password();