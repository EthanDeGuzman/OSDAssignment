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

  //When search submit is clicked search for specific game title
  onSubmit(query: String){
    this.gamesService.getSearch(query, this.selected).subscribe({
      next: (value: Games[] )=> this.gamesList = value,
      complete: () => console.log("game service is finished"),
      error: (mess) => this.message = mess
    })

  }

  //Gets the value of selected option in dropdown
  getSelectedOption(event){
    //Logs the selected value for debugging
    console.log(event.target.value);
    
    this.selected = event.target.value
  }
}
