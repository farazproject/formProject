const { default: axios, Axios } = require("axios");



let URL = 'http://localhost:3000/users';

function delegate(target, selector, event, callback) {
    target.addEventListener(event, (event) => {
        const element = event.target.closest(selector);
        if (element) {
            callback(element, event);
        }
    })
}


class Table {
    constructor() {
        this.users = [];
        this.editingId = null;
        this.currentFilter = '';
        this.$mainForm = document.getElementById('main-form');
        this.$mainTable = document.getElementById('main-table');
        this.$search = document.getElementById('search');
        this.$showMsg = document.getElementById('msg');
        this.setUpEvent();
        this.getFormData();
        this.searchData();

        delegate(this.$mainTable, '.delete', 'click', this.deleteData.bind(this));
        delegate(this.$mainTable, '.update', 'click', this.updateData.bind(this));
        
    }

    setUpEvent() {
        //this.$mainForm.addEventListener('reset', () => console.log('form was reset'));
        this.$mainForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let name = this.$mainForm.elements.name.value;
            let age = this.$mainForm.elements.age.value;
            let address = this.$mainForm.elements.address.value;
            let phone = this.$mainForm.elements.phone.value;

            let user = {};
            user.name = name;
            user.age = age;
            user.address = address;
            user.phone = phone;


            if (this.editingId === null) {
                axios.post(URL, user).then(res => {   //promise resolve;
                    this.users.push(res.data);
                    this.addTableRow(res.data);
                    this.$showMsg.className = 'text-success';
                    this.$showMsg.classList.add = 'mt-5'
                    this.$showMsg.innerHTML = 'User Created Successfully';
                    

                    // this.reRenderTable();
                }).catch(err => {
                    this.$showMsg.className ='text-danger';
                    this.$showMsg.innerHTML = 'unable to create user';
                })
                this.resetForm ( );
            } else {
                axios.put(URL + '/' + this.editingId, user).then(res => {
                    this.editingId = null;
                    let tempUser = this.users.find(user => user.id === res.data.id);
                    tempUser.name = res.data.name;
                    tempUser.age = res.data.age;
                    tempUser.phone = res.data.phone;
                    tempUser.address = res.data.address;
                    
                    this.reRenderTable();
                    this.resetForm ( );
                    this.$showMsg.className = 'text-success';
                    this.$showMsg.classList.add = 'mt-5'
                    this.$showMsg.innerHTML = 'User is edited Successfully';
                }).catch(err => {
                    this.$showMsg.className ='text-danger';
                    this.$showMsg.innerHTML = 'unable to create user';
                });
            }

        });
    };


    updateData ( element ) {
        //console.log(element);

        let currentUser = this.users.find(user => user.id == element.dataset.id);

        this.$mainForm.name.value = currentUser.name;
        this.$mainForm.age.value = currentUser.age;
        this.$mainForm.address.value = currentUser.address;
        this.$mainForm.phone.value = currentUser.phone;

        this.editingId = currentUser.id;
        
    }

    resetForm( ) {
        this.$mainForm.reset();
        this.$showMsg.className = 'text-success';
        this.$showMsg.innerHTML = 'The Form Is Reset';
    }
    

    deleteData(element) {
        axios.delete(URL + '/' + element.dataset.id).then(() => {
            this.users = this.users.filter(usr => usr.id !== +element.dataset.id);
            this.reRenderTable();
            this.$showMsg.className ='text-danger';
            this.$showMsg.innerHTML = 'user deleted';
        })
    }

    searchData() {
        this.$search.addEventListener('input', (e) => {
            // this.currentFilter = e.target.value;
            //console.log(this.currentFilter);
            this.reRenderTable();
        })
    }

    addTableRow(user) {
        let tr = document.createElement('tr');

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');
        let td3 = document.createElement('td');
        let td4 = document.createElement('td');
        let deleteButton = document.createElement('button');
        let updateButton = document.createElement('button');

        deleteButton.type = 'button';
        deleteButton.className = 'delete';
        deleteButton.innerText = 'delete';
        deleteButton.dataset.id = user.id;

        updateButton.type = 'button';
        updateButton.className = 'update';
        updateButton.innerText = 'update';
        updateButton.dataset.id = user.id;



        td1.innerText = user.name;
        td2.innerText = user.age;
        td3.innerText = user.address;
        td4.innerText = user.phone;

        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.appendChild(td3);
        tr.appendChild(td4);
        tr.appendChild(deleteButton);
        tr.appendChild(updateButton);


        this.$mainTable.querySelector('tbody').appendChild(tr);
    };

    reRenderTable() {

        this.$mainTable.querySelector('tbody').innerHTML = '';
        let filteredUsers = this.users;
        if (this.$search.value !== '') {
            filteredUsers = filteredUsers.filter(user => user.name.includes(this.$search.value)); 
        }


        for (user of filteredUsers) {
            this.addTableRow(user);
        }
        
    }

    getFormData() {
        axios.get(URL).then(res => {
            this.users = res.data;
            this.reRenderTable(); // first time run of runRenderTable; 
            
        });
    }

    

};

new Table();