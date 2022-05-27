import { Controller, Get, Post } from "@nestjs/common";
import { UserModel } from "src/models/user.model";
import { UsersService } from "./users.service";

@Controller('users')
export class UsersController{
    public constructor(private usersService:UsersService){
    }

}