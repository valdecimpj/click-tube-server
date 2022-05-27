import { TagInterestModel } from "./tag-interest.model";

export class UserModel{
    public name:string;
    public email:string;
    public password:string;
    public tags:TagInterestModel[]
}