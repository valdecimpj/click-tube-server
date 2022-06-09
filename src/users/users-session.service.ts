import { Injectable } from "@nestjs/common";
import { TagInterestModel } from "src/models/tag-interest.model";
import { UserModel } from "src/models/user.model";
import { TagsService } from "src/tags/tags.service";

@Injectable()
export class UsersSessionService{
    constructor(private tagsService:TagsService){}

    getUserFromSession(session: Record<string, any>): UserModel {
        return session.user;
    }

    public createUserInSession(session: Record<string, any>) {
        let allTags = this.tagsService.getAllTags();
        let newUserTagInterests: TagInterestModel[] = this.createNewTagInterestList(allTags);
        let newUser:UserModel = {
            name:'Convidado',
            email:null,
            password:null,
            interestPerTag:newUserTagInterests,
            userVideoHistory:[]
        }
        session.user = newUser;
    }

    private createNewTagInterestList(allTags: string[]) {
        let newUserTagInterests: TagInterestModel[] = [];
        allTags.forEach(
            tag => newUserTagInterests.push({ interestAmount: 100, tagName: tag })
        );
        return newUserTagInterests;
    }

    public userStillDoesntExistInSession(session: Record<string, any>) {
        return session.user == undefined
    }

}