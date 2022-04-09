import { Component, OnInit } from '@angular/core';
import { Games } from 'src/app/interface/games';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.css']
})
export class GamesListComponent implements OnInit {
  //Create Variables
  gamesList: Games[] = [];
  message: string = "";
  showTitleSearch: boolean = true;

  tempGames: Games[] = [];
  specificGames: Games[] = [];

  items: any[] = [
    { name: 'Title' },
    { name: 'Price' },
    { name: 'Year' }
  ];
  
  selected: string = "";

  //Constructor to use Services
  constructor(private gamesService: GamesService) { }

  //On Initialise populate Table with Game Data
  ngOnInit(): void {
    this.gamesService.getGames().subscribe({
      next: (value: Games[] )=> this.gamesList = value,
      complete: () => console.log("game service is finished"),
      error: (mess) => this.message = mess
    })
  }

  //When search submit is clicked search for specific game
  onSubmit(query: String){
    this.getSearchedGame(query, this.selected);
  }

  //Gets the value of selected option in dropdown
  getSelectedOption(event){
    //Logs the selected value for debugging
    console.log(event.target.value);
    
    this.selected = event.target.value
  }

  //Search Functionality
  getSearchedGame(query : any, selected: any){
    //If empty query show all games
    if(query == "" || query == null){
      this.gamesService.getGames().subscribe({
        next: (value: Games[] )=> this.gamesList = value,
        complete: () => console.log("game service is finished"),
        error: (mess) => this.message = mess
      })
    }
    else{
      this.gamesService.getGames().subscribe({
        next: (value: Games[] )=> this.tempGames= value,
        complete: () => console.log("game service is finished"),
        error: (mess) => this.message = mess
      })
      .add(()=>{      
        //Loop through all the games
        for(let i of this.tempGames){
          switch(selected) {
            default:
            case "Title": {
              console.log("Title: ", i.game.title)
              //If title matches search query add to specific game array
              if (query.toLowerCase() == i.game.title.toLowerCase())
              {
                this.specificGames.push(i)
              }
              break;
            } 
            case "Price": { 
              console.log("Price: ", i.game.price)
              //If title matches search query add to specific game array
              if (query == i.game.price)
              {
                this.specificGames.push(i)
              }
              break;
            } 
            case "Year": {
              console.log("Year: ", i.game.year_release)
              //If title matches search query add to specific game array
              if (query == i.game.year_release)
              {
                this.specificGames.push(i)
              }
              break;
           } 
         }
      }
      console.log(this.specificGames)
      //Display new List
      this.gamesList = this.specificGames
      //Clear temp list and specificGameList for future queries
      this.tempGames = [];
      this.specificGames = [];
    })
    }
  }
}
