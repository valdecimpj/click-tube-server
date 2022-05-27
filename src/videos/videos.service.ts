import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { VideoModel } from "src/models/video.model";
import { RandomWordsService } from "src/random-words/random-words.service";
import { TagsService } from "src/tags/tags.service";

@Injectable()
export class VideosService{
    private videos:VideoModel[];

    constructor(private randomWordsService:RandomWordsService, private tagsService:TagsService){
        let tags = this.tagsService.getAllTags();
        let amountOfVideos = 10;
        this.generateListOfRandomVideos(amountOfVideos, tags).then(videos => this.videos = videos);
    }

    private async generateListOfRandomVideos(amount: number, tags: string[]): Promise<VideoModel[]> {
        let videos:VideoModel[] = [];
        console.log('Started generating videos...');
        for(let i = 0; i < amount; i++){
            let nextVideoId = videos.length;
            let video:VideoModel = await this.generateRandomVideo(nextVideoId, tags);
            videos.push(video);
            console.log(`Generated ${i+1} of ${amount}`)
        }
        console.log('Finished generating videos.');
        return videos;
    }

    private async generateRandomVideo(videoId:number, tags: string[]): Promise<VideoModel> {
        let amountOfWordsInName = Math.floor(Math.random()*5);
        let amountOfTags = Math.floor(Math.random()*3);
        let randomWords = (await firstValueFrom(this.randomWordsService.generateRandomWord(amountOfWordsInName))).data
        let shuffledTags = tags.sort(() => 0.5 - Math.random())
        return {
            id: videoId,
            name: randomWords.join(' '),
            tags: shuffledTags.slice(0, amountOfTags)
        }
    }

    public getAllVideos():VideoModel[]{
        return this.videos;
    }
}