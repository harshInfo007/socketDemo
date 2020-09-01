class Users {
    constructor() {
        this.users = [];
    }

    getUser(id) {
        return this.users.filter(objUser => objUser.id === id)[0];
    }

    addUser(id, name, room){
        var user = { id, name, room};
        this.users.push(user);
        console.log(this.users)
        return user;
    }

    removeUser(id){
        var user = this.getUser(id);
        if(user){
            this.users = this.users.filter(objUser => objUser.id != id);
        }
        console.log('removed user', user,this.users)
        return user
    }

    getUsersList(room){
        var users = this.users.filter(objUser => objUser.room == room)
        var newUsers = users.map(objUser => objUser.name);
        return newUsers
    }
}

module.exports = {
    Users
}