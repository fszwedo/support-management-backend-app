import AuthService from "../src/services/authService";
import UserRepository from "../src/repositories/userRepository";
import { User } from "../src/models/userModel";
import Users from "../src/models/userModel";
import * as mongoose from 'mongoose'

type UserType = User & mongoose.Document

const user = {
    name: `Test`,
    email: `test@test.pl`,
    password: `Test123!`
};

class TestUserRepository extends UserRepository {
    users: UserType [];

    constructor() {
        super(Users);
        this.users = []
    }

    async create (user: User) {
        const newUser = await new this.model(user) as UserType;
        this.users.push(newUser)
    }

    async findOne (query) {
        return this.users.find(user => user.email === query.email)
    }
}

const testRepository = new TestUserRepository();
const service = new AuthService(testRepository, 'testJwtPrivateKey')

describe('Test Authorization Service', () => {
    beforeAll(async() => {
        const password = await service.hashPassword(user.password);
        let user2 = Object.assign({}, user);
        user2.password = password;
        await service.saveUser(user2 as UserType);
    })

    test('generate token', () => {
        expect(typeof service.generateToken(user as UserType)).toBe('string');
    });

    test('find user', async () => {
        expect(await service.findUser(`test@test.pl`)).toBe(testRepository.users[0]);
    });

    test('hash password', async () => {
        expect(typeof await service.hashPassword(user.password)).toBe('string');
    });

    test('check password', async () => {
        expect(await service.checkPassword(user.password, testRepository.users[0])).toBe(true);
    });

    test('check if user has permissions "user"', async () => {
        let token = service.generateToken(testRepository.users[0]);
        expect(await service.isUser(token)).toBe(true);
    });

    test('check if user has permissions "admin"', async () => {
        let token = service.generateToken(testRepository.users[0]);
        expect(await service.isAdmin(token)).toBe(false);
    });

})

