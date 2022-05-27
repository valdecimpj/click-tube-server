import { Controller, Param, Post } from "@nestjs/common";
import { UserModel } from "src/models/user.model";
import { UsersService } from "src/users/users.service";
import { LoginService } from "./login.service";

@Controller('login')
export class LoginController{
    public constructor(private usersService:UsersService, private loginService:LoginService){
    }

    @Post()
    loginUser(@Param('user') userLogin:UserModel){
        let user = this.usersService.getUser(userLogin.email)
        if(user && user.password == userLogin.password)
            this.loginService.loginUser(user);
    }
}