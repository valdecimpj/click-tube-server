import { Body, Controller, Get, NotFoundException, Param, Put, Session } from "@nestjs/common";
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
        return this.videosService.getVideosOrderedByTagsOfInterestToUser(tagsOfInterestToUser, userInSession.userVideoHistory);
    }

    @Put()
    public clickVideo(@Body('clickedVideoId') clickedVideoId:number, @Session() session:Record<string, any>):void{
        let clickedVideo:VideoModel = this.videosService.getVideoById(clickedVideoId);
        if(clickedVideo == undefined)
            throw new NotFoundException("A video with with provided Id could not be found.")
        this.updateUserPreferences(session, clickedVideo)
        this.videosService.clickVideo(clickedVideoId);
    }

    private updateUserPreferences(session: Record<string, any>, clickedVideo:VideoModel) {
        if(this.usersSessionService.userStillDoesntExistInSession(session))
            this.usersSessionService.createUserInSession(session);
        let user:UserModel = this.usersSessionService.getUserFromSession(session);
        this.usersService.updateUsersPreferences(user, clickedVideo);
    }
}