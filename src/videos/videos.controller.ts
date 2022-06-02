import { Controller, Get, Param, Put, Session } from "@nestjs/common";
import { VideoModel } from "src/models/video.model";
import { VideosService } from "./videos.service";

@Controller('videos')
export class VideosController{
    public constructor(private videosService:VideosService){
    }

    @Get()
    public getVideos():VideoModel[]{
        return this.videosService.getAllVideos();
    }

    @Put()
    public clickVideo(@Param('clickedVideoId') clickedVideoId:number, @Session() session:Record<string, any>):void{       
        this.updateUserPreferences(session)
        this.videosService.clickVideo(clickedVideoId);
    }

    private updateUserPreferences(session: Record<string, any>) {
        throw new Error("Method not implemented.");
    }
}