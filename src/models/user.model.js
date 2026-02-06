let user = [];
let currentId = 1;

class User {
    constructor(id, name, email, age) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    static create(userData) {
        const id = currentId++;
        const newUser = new User(id, userData.name, userData.email, userData.age);
        user.push(newUser);
        return newUser;
    }

    static findById(id) {
        return user.find(user => user.id === parseInt(id));
    }

    static update(id, userData) {
        const index = user.findIndex(user => user.id === parseInt(id));
        if (index === -1)
            return null;

        user[index] = {
            ...user[index],
            ...userData,
            id: parseInt(id),
            updatedAt: new Date()
        };
        return user[index];
    }

    static delete(id) {
        const index = user.findIndex(user => user.id === parseInt(id));
        if (index === -1)
            return null;
        const deletedUser = user[index];
        user.splice(index, 1);
        return deletedUser;
    }

    static clear() {
        user = [];
        currentId = 1;
    }
    static count() {
        return user.length;
    }

    static findAll() {
        return user;
    }
}

module.exports = User;
