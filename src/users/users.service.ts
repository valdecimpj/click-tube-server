import { Injectable } from "@nestjs/common";
import { UserModel } from "src/models/user.model";

@Injectable()
export class UsersService{
    private users:Map<string,UserModel>;

    public constructor(){
        let user:UserModel = {
            email:'teste@gmail.com',
            name:'teste',
            password:'teste',
            tags:[]
        };

        this.users = new Map<string,UserModel>(
            [
                [user.email, user]
            ]
        );
    }

    public getUser(email:string){
        return this.users.get(email);
    }
}