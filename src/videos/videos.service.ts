import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import { VideoModel } from "src/models/video.model";
import { RandomWordsService } from "src/random-words/random-words.service";
import { TagsService } from "src/tags/tags.service";
import { TagInterestModel } from "../models/tag-interest.model";

@Injectable()
export class VideosService{
    private videos:VideoModel[];

    constructor(private randomWordsService:RandomWordsService, private tagsService:TagsService){
        let tags = this.tagsService.getAllTags();
        let amountOfVideos = 10;
        this.generateListOfRandomVideos(amountOfVideos, tags).then(videos => this.videos = videos);
    }

    public getVideosOrderedByTagsOfInterestToUser(tagsOfInterestToUser:TagInterestModel[], userVideoHistory:VideoModel[]):VideoModel[] {
        let videosWithUserInterestRating:{video:VideoModel, userInterestRating:number}[] = []
        let allVideos = this.getAllVideos();
        allVideos.forEach(video => videosWithUserInterestRating.push({video: video, userInterestRating: this.calculateUserInterestRatingForVideo(tagsOfInterestToUser, video)}));
        let videosWithUserInterestOrderedByUserInterestRating:{video:VideoModel, userInterestRating:number}[] = videosWithUserInterestRating.sort((videoA, videoB) => videoB.userInterestRating - videoA.userInterestRating)
        let videosOrderedByUserInterest:VideoModel[] = [];
        videosWithUserInterestOrderedByUserInterestRating.forEach(videoWithUserInterest => videosOrderedByUserInterest.push(videoWithUserInterest.video));
        if(this.userHasNotWatchedTooManyVideos(userVideoHistory))
            videosOrderedByUserInterest = videosOrderedByUserInterest.filter(video => !userVideoHistory.includes(video));
        return videosOrderedByUserInterest;
    }

    private userHasNotWatchedTooManyVideos(userVideoHistory: VideoModel[]) {
        return userVideoHistory.length < this.videos.length / 2;
    }

    private calculateUserInterestRatingForVideo(tagsOfInterestToUser: TagInterestModel[], video: VideoModel): number {
        let videoSimilarityToUserTaste:number = 0;
        video.tags.forEach(videoTag => videoSimilarityToUserTaste += tagsOfInterestToUser.find(interestInTag => interestInTag.tagName == videoTag).interestAmount);
        return videoSimilarityToUserTaste;
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
        let amountOfWordsInName = Math.floor(Math.random()*4)+1;
        let amountOfTags = Math.floor(Math.random()*3)+2;
        let randomWords = (await firstValueFrom(this.randomWordsService.generateRandomWord(amountOfWordsInName))).data
        let shuffledTags = tags.sort(() => 0.5 - Math.random())
        return {
            id: videoId,
            name: randomWords.join(' '),
            tags: shuffledTags.slice(0, amountOfTags),
            views: 0
        }
    }

    public getAllVideos():VideoModel[]{
        return this.videos;
    }

    public clickVideo(clickedVideoId: number) {
        this.videos.find(video => video.id == clickedVideoId).views++;
    }

    getVideoById(clickedVideoId: number): VideoModel {
        return this.videos.find(video => video.id == clickedVideoId);
    }
}