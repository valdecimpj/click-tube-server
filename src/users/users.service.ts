import { Injectable } from "@nestjs/common";
import { TagInterestModel } from "src/models/tag-interest.model";
import { UserModel } from "src/models/user.model";
import { VideoModel } from "src/models/video.model";

@Injectable()
export class UsersService{
    private users:Map<string,UserModel>;

    public constructor(){
        let user:UserModel = {
            email:'teste@gmail.com',
            name:'teste',
            password:'teste',
            interestPerTag:[],
            userVideoHistory:[]
        };

        this.users = new Map<string,UserModel>(
            [
                [user.email, user]
            ]
        );
    }

    updateUsersPreferences(user: UserModel, clickedVideo: VideoModel) {
        user.userVideoHistory.push(clickedVideo)
        if(user.userVideoHistory.length > 10)
            user.userVideoHistory.shift();
        let tagsNotIncludedInVideo = user.interestPerTag.filter(tagInterest => !clickedVideo.tags.includes(tagInterest.tagName));
        let amountSubtractedFromExcludedTags = 0
        tagsNotIncludedInVideo.forEach(tag => amountSubtractedFromExcludedTags += this.removeAndReturnInterestFromTag(tag))
        let tagsIncludedInVideo = user.interestPerTag.filter(tagInterest => clickedVideo.tags.includes(tagInterest.tagName));
        let numberToSplitExtractedInterest = tagsIncludedInVideo.length;
        tagsIncludedInVideo.forEach(tag => tag.interestAmount += amountSubtractedFromExcludedTags/numberToSplitExtractedInterest);
    }

    private removeAndReturnInterestFromTag(tag: TagInterestModel) {
        let amountRemoved = tag.interestAmount/2
        tag.interestAmount /= 2;
        return amountRemoved;
    }

    public getUser(email:string){
        return this.users.get(email);
    }
}