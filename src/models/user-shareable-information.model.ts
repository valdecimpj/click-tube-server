import { TagInterestModel } from "./tag-interest.model";
import { VideoModel } from "./video.model";

export class UserShareableInformationModel{
    public name:string;
    public email:string;
    public interestPerTag:TagInterestModel[]
    public userVideoHistory:VideoModel[]
}