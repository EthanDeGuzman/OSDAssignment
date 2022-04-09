import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Games } from 'src/app/interface/games';
import { GamesService } from 'src/app/services/games.service';

@Component({
  selector: 'app-games-form',
  templateUrl: './games-form.component.html',
  styleUrls: ['./games-form.component.css']
})
export class GamesFormComponent implements OnInit {
  
  //Create Variables
  gamesList: Games[] = [];
  message: string = "";
  gamesForm?: FormGroup;
  currentGame?: Games;
  showGamesForm: boolean = false;
  submit: boolean = false;

  //Constructor to use Services
  constructor(private gamesService: GamesService) {
    
   }

  //On Initialise get Game Data
  ngOnInit(): void {
    this.gamesService.getGames().subscribe({
      next: (value: Games[] )=> this.gamesList = value,
      complete: () => console.log("game service is finished"),
      error: (mess) => this.message = mess
    })

    //Method to populate initial form group 
    this.populateForm();
  }

  //Populates Initial Form Group with null values
  populateForm(){
    this.gamesForm = new FormGroup({
      title: new FormControl(null, [Validators.required, Validators.minLength(3)]),
      year_release: new FormControl(null, [Validators.required, Validators.min(0)]),
      description: new FormControl(null, [Validators.required, Validators.minLength(0)]),
      price: new FormControl(null, [Validators.required, Validators.required, Validators.min(0)]),
      rating: new FormControl(null, [Validators.required, Validators.minLength(0)]),
      company: new FormGroup({
          name: new FormControl(null, [Validators.required, Validators.minLength(3)])
      })
    })
  }

  //When a specific game row has been clicked in the table then create Form Group
  doGames(gameData: Games){
    this.showGamesForm = true;
    this.currentGame = gameData;
    this.submit = false;

    //Populate Form Group with current game selected
    this.gamesForm = new FormGroup({
      title: new FormControl(this.currentGame.game.title, [Validators.required, Validators.minLength(3)]),
      year_release: new FormControl(this.currentGame.game.year_release, [Validators.required, Validators.min(0)]),
      description: new FormControl(this.currentGame.game.description, [Validators.required, Validators.minLength(0)]),
      price: new FormControl(this.currentGame.game.price, [Validators.required, Validators.min(0)]),
      rating: new FormControl(this.currentGame.game.rating, [Validators.required, Validators.minLength(0)]),
      company: new FormGroup({
          name: new FormControl(this.currentGame.game.company.name, [Validators.required, Validators.minLength(3)])
      })
    })

    //Debug and make sure current game is the same game selected in the table
    console.log(this.currentGame);
  }

  //When Submit button is clicked add or update the selected game
  onSubmit(game: Games){
    if (this.currentGame == null) {
      this.addNewGame(game);
    }
    else {
      this.updateGame(this.currentGame.id, game)
    }
  }

  //Closes the Form when close button is clicked
  closeForm(){
    console.log("close form")
    this.showGamesForm = false;
    this.submit = true;
  }

  //Closes alert
  dismissAlert() {
    this.message = "";
  }
  //When Add button is clicked show the form
  openAddGame(): void {
    this.currentGame = undefined;
    this.submit = true;
    this.populateForm(); //Makes sure the form is filled with empty values
    this.showGamesForm = true; //Makes the form visible
  }

  //Method to add the game to the database
  addNewGame(newGame: Games): void {
    console.log('Adding new game ' + JSON.stringify(newGame));
    this.gamesService.addGame({ ...newGame })
      .subscribe({
        next: game => {
          console.log('Game has been added');
          this.message = "New game has been added";
        },
        error: (err) => this.message = err
      });

    //Refresh List on screen
    this.gamesList = this.gamesList;
    this.gamesService.getGames().subscribe({
      next: (value: Games[]) => this.gamesList = value,
      complete: () => console.log(JSON.stringify(this.gamesList)),
      error: (mess) => this.message = mess
    })

    //Closes Form
    this.showGamesForm = false;
    this.currentGame = undefined;
  }

  //Method to update the game in the database
  updateGame(id: string, game: Games): void {
    console.log('Updating ' + JSON.stringify(game));
    this.gamesService.updateGame(id, game)
      .subscribe({
        next: game => {
          console.log('Game has been updated');
          this.message = "Game has been updated";
        },
        error: (err) => this.message = err
      });
    
    //Refresh List on Screen
    this.gamesList = this.gamesList;
    this.gamesService.getGames().subscribe({
      next: (value: Games[] )=> this.gamesList = value,
      complete: () => console.log("Game service is finished"),
      error: (mess) => this.message = mess
    })

    this.currentGame = undefined;
    //Closes Form
    this.showGamesForm = false;
  }

  //Method to delete the game from the database
  deleteGame() {
    if (this.currentGame) {
      this.gamesService.deleteGame(this.currentGame.id)
        .subscribe({
          next: game => {
            console.log('Game has been deleted');
            this.message = "Game has been deleted";
          },
          error: (err) => this.message = err
        });
    }

    //Refresh List on Screen
    this.gamesList = this.gamesList;
    this.gamesService.getGames().subscribe({
      next: (value: Games[]) => this.gamesList = value,
      complete: () => console.log('Game service finished'),
      error: (mess) => this.message = mess
    })

    //Closes Form
    this.showGamesForm = false;
  }

  //Get methods for form invalid/touched
  get title() {
    return this.gamesForm?.get('title');
  }
  get year_release() {
    return this.gamesForm?.get('year_release');
  }
  get price() {
    return this.gamesForm?.get('price');
  }
  get rating() {
    return this.gamesForm?.get('rating');
  }
  get company_name() {
    return this.gamesForm?.get('company.name');
  }
  get description() {
    return this.gamesForm?.get('description');
  }
}
