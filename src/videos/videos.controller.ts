import { Controller, Get, NotFoundException, Param, Put, Session } from "@nestjs/common";
import { TagInterestModel } from "src/models/tag-interest.model";
import { UserModel } from "src/models/user.model";
import { VideoModel } from "src/models/video.model";
import { UsersSessionService } from "src/users/users-session.service";
import { UsersService } from "src/users/users.service";
import { VideosService } from "./videos.service";

@Controller('videos')
export class VideosController{
    public constructor(private videosService:VideosService, private usersSessionService:UsersSessionService, private usersService:UsersService){
    }

    @Get()
    public getVideos(@Session() session:Record<string, any>):VideoModel[]{
        if(this.usersSessionService.userStillDoesntExistInSession(session))
            this.usersSessionService.createUserInSession(session);
        let userInSession = this.usersSessionService.getUserFromSession(session);
        let tagsOfInterestToUser = userInSession.interestPerTag;
        return this.videosService.getVideosOrderedByTagsOfInterestToUser(tagsOfInterestToUser);
    }

    private getVideosInterestingToUserInSession(tagsOfInterestToUser:TagInterestModel[]) {
        let videosWithUserInterestRating:{video:VideoModel, userInterestRating:number}[] = []
        allVideos.forEach(video => videosWithUserInterestRating.push({video: video, userInterestRating: this.calculateUserInterestRatingForVideo(tagsOfInterestToUser, video)}));
        let videosWithUserInterestOrderedByUserInterestRating:{video:VideoModel, userInterestRating:number}[] = videosWithUserInterestRating.sort((videoA, videoB) => videoB.userInterestRating - videoA.userInterestRating)
        let videosOrderedByUserInterest:VideoModel[] = [];
        videosWithUserInterestOrderedByUserInterestRating.forEach(videoWithUserInterest => videosOrderedByUserInterest.push(videoWithUserInterest.video));
        return videosOrderedByUserInterest;
    }

    private calculateUserInterestRatingForVideo(tagsOfInterestToUser: TagInterestModel[], video: VideoModel): number {
        let videoSimilarityToUserTaste:number = 0;
        video.tags.forEach(videoTag => videoSimilarityToUserTaste += tagsOfInterestToUser.find(interestInTag => interestInTag.tagName == videoTag).interest);
        return videoSimilarityToUserTaste;
    }

    @Put()
    public clickVideo(@Param('clickedVideoId') clickedVideoId:number, @Session() session:Record<string, any>):void{
        let clickedVideo:VideoModel = this.videosService.getVideoById(clickedVideoId);
        if(clickedVideo == undefined)
            throw new NotFoundException("A video with with provided Id could not be found.")
        this.updateUserPreferences(session, clickedVideo.tags)
        this.videosService.clickVideo(clickedVideoId);
    }

    private updateUserPreferences(session: Record<string, any>, clickedTags:string[]) {
        if(this.usersSessionService.userStillDoesntExistInSession(session))
            this.usersSessionService.createUserInSession(session);
        let user:UserModel = this.usersSessionService.getUserFromSession(session);
        this.usersService.updateUsersPreferences(user, clickedTags);
    }
}