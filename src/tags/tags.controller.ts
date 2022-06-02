import { Controller, Get } from "@nestjs/common";
import { TagsService } from "./tags.service";

@Controller('tags')
export class TagController{
    public constructor(private tagsService:TagsService){
    }

    @Get()
    getAllTags():string[]{
        return this.tagsService.getAllTags();
    }
}