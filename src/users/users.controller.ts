import { Controller, Get, Post, Session } from "@nestjs/common";
import { UserShareableInformationModel } from "src/models/user-shareable-information.model";
import { UsersSessionService } from "./users-session.service";

@Controller('users')
export class UsersController{
    public constructor(private usersSessionService:UsersSessionService){
    }

    @Get()
    getUserInformationFromSession(@Session() session:Record<string, any>):UserShareableInformationModel{
        if(this.usersSessionService.userStillDoesntExistInSession(session))
            this.usersSessionService.createUserInSession(session);
        return this.usersSessionService.getUserFromSession(session);
    }
}