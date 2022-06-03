import { Injectable } from "@nestjs/common";
import { TagInterestModel } from "src/models/tag-interest.model";
import { UserModel } from "src/models/user.model";

@Injectable()
export class UsersService{
    private users:Map<string,UserModel>;

    public constructor(){
        let user:UserModel = {
            email:'teste@gmail.com',
            name:'teste',
            password:'teste',
            interestPerTag:[]
        };

        this.users = new Map<string,UserModel>(
            [
                [user.email, user]
            ]
        );
    }

    updateUsersPreferences(user: UserModel, clickedTags: string[]) {
        let tagsNotIncludedInVideo = user.interestPerTag.filter(tagInterest => !clickedTags.includes(tagInterest.tagName));
        let amountSubtractedFromExcludedTags = 0
        tagsNotIncludedInVideo.forEach(tag => amountSubtractedFromExcludedTags += this.removeAndReturnInterestFromTag(tag))
        let tagsIncludedInVideo = user.interestPerTag.filter(tagInterest => clickedTags.includes(tagInterest.tagName));
        let numberToSplitExtractedInterest = tagsIncludedInVideo.length;
        tagsIncludedInVideo.forEach(tag => tag.interest += amountSubtractedFromExcludedTags/numberToSplitExtractedInterest);
    }

    private removeAndReturnInterestFromTag(tag: TagInterestModel) {
        let amountRemoved = tag.interest/2
        tag.interest /= 2;
        return amountRemoved;
    }

    public getUser(email:string){
        return this.users.get(email);
    }
}