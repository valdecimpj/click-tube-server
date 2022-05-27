import { Controller, Get } from "@nestjs/common";
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
}