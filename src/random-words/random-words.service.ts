import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { AxiosResponse } from "axios";
import { firstValueFrom, Observable } from "rxjs";

@Injectable()
export class RandomWordsService{
    public constructor(private httpService:HttpService){}

    public generateRandomWord(amount:number): Observable<AxiosResponse<string[]>>{
        return this.httpService.get(`https://random-word-api.herokuapp.com/word?number=${amount}`);
    }
}