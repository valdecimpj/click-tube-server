import { Injectable } from "@nestjs/common";

@Injectable()
export class TagsService{
    private tags:string[];

    public constructor(){
        this.tags = ['Gameplay', 'React', 'Meme', 'Vlog', 'Ciência', 'Música', 'Notícia', 'Automobilismo', 'Esportes', 'Jogos'];
    }

    getAllTags():string[]{
        return this.tags;
    }
}