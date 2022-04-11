import { TestBed } from '@angular/core/testing';
import { GamesService } from './games.service';
import { environment } from 'src/environments/environment';
import { HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Games } from '../interface/games';

describe('GamesService', () => {
  let service: GamesService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;


  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();
    service = TestBed.inject(GamesService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe("Testing getAllGames method", () => {
    let expectedGames: Games[];

    beforeEach(() => {
      //Dummy data to be returned by request.
      expectedGames = [
        { id: '-B-7FgWN16r9KeIXJPOt', game: {
          company: {
            name: 'Ubisoft',
            year_formed: '1986',
            founders: 'Yves Guillemot, Michael Guillemot, Claude Guillemot, Gerard Guillemot, Christian Guillemot'
          },
          description: "Assassin's Creed Valhalla is an action role-playing video game developed by Ubisoft Montreal" +
          "and published by Ubisoft. It is the twelfth major installment and the twenty-second release in the Assassin's" +
          "Creed series, and a successor to the 2018's Assassin's Creed Odyssey.",
          price: 59.99,
          rating: '8/10',
          title: "Assasin's Creed Valhalla",
          year_release: 2020
        }},
        { id: '-N-8DzVC37q4BsECTbGm', game: {
          company: {
            name: 'Sony Entertainment',
            year_formed: '1946',
            founders: 'Akio Morita, Masaru Ibuka'
          },
          description: "Bloodborne is an action role-playing game developed by FromSoftware and published by Sony Computer Entertainment.",
          price: 19.99,
          rating: '9.1/10',
          title: "BloodBorne",
          year_release: 2015
        }},
        { id: '-V-2EcSG24q3BeHLJbUm', game: {
          company: {
            name: 'Activision',
            year_formed: '1979',
            founders: 'Treyarch, Infinity Ward, Raven Software, Toys for Bob, MORE'
          },
          description: "Sekiro: Shadows Die Twice is an action-adventure video game developed by FromSoftware and published by Activision. " +
          "The game follows a shinobi known as Wolf as he attempts to take revenge on a samurai clan who attacked him and kidnapped his lord.",
          price: 59.99,
          rating: '9.5/10',
          title: "Sekiro Shadows Die Twice",
          year_release: 2019
        }}

      ] as Games[];
    });

    //Test case 1
    it('should return expected games by calling once', () => {
      service.getGames().subscribe(
        games => expect(games).toEqual(expectedGames, 'should return expected games'),
        fail
      );
    
      const req = httpTestingController.expectOne("https://us-central1-mywebassignment-db81c.cloudfunctions.net/getGames");
      expect(req.request.method).toEqual('GET');

      req.flush(expectedGames); //Return expectedEmps
    });

    //Test case 2
    it('should be OK returning no games', () => {
      service.getGames().subscribe(
        games => expect(games.length).toEqual(0, 'should have empty games array'),
        fail
      );

      const req = httpTestingController.expectOne("https://us-central1-mywebassignment-db81c.cloudfunctions.net/getGames");
      req.flush([]); //Return empty data
    });

    it('should return expected games when called multiple times', () => {
      service.getGames().subscribe();
      service.getGames().subscribe(
        games => expect(games).toEqual(expectedGames, 'should return expected games'),
        fail
      );

      const requests = httpTestingController.match("https://us-central1-mywebassignment-db81c.cloudfunctions.net/getGames");
      expect(requests.length).toEqual(2, 'calls to getGames()');

      requests[0].flush([]); //Return Empty body for first call
      requests[1].flush(expectedGames); //Return expectedEmps in second call
    });
  })

  describe("Testing POST method", () => {
      //Test case 1
      it('should add an employee and return it', () => {
        const newGame: Games = 
        { id: '-T-7FgSN26r9ReHYJSWG', game: {
          company: {
            name: 'Test',
            year_formed: '2022',
            founders: 'Test'
          },
          description: "Test",
          price: 59.99,
          rating: '10/10',
          title: "Test",
          year_release: 2022
        }};

        service.addGame(newGame).subscribe(
          data => expect(data).toEqual(newGame, 'should return the game'),
          fail
        );

        // addEmploye should have made one request to POST employee
        const req = httpTestingController.expectOne("https://us-central1-mywebassignment-db81c.cloudfunctions.net/addGame");
        expect(req.request.method).toEqual('POST');
        expect(req.request.body).toEqual(newGame);

        // Expect server to return the employee after POST
        const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newGame});
        req.event(expectedResponse);
        });
    });
});
