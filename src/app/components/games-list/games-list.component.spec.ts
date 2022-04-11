import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from 'src/environments/environment';
import { GamesListComponent } from './games-list.component';
import { HttpClientTestingModule} from '@angular/common/http/testing';

describe('GamesListComponent', () => {
  let component: GamesListComponent;
  let fixture: ComponentFixture<GamesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GamesListComponent ],
      imports: [ AngularFireModule.initializeApp(environment.firebaseConfig), HttpClientTestingModule]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GamesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create Games List Component', () => {
    expect(component).toBeTruthy();
  });

  it('should render welcome message', () => {
    const fixture = TestBed.createComponent(GamesListComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#title')?.textContent).toContain('Welcome to your Game Library:');
  });
});
