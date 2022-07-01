import UserService from "../services/userService";

export default class UserController {
    private service;

    constructor(service: UserService) {
        this.service = service
    }

}