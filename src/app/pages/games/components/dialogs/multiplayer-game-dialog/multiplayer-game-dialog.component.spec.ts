import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MultiplayerGameDialogComponent} from './multiplayer-game-dialog.component';
import {GamesImports} from '../../../games.imports';
import {GamesDeclarations} from '../../../games.declarations';

describe('MultiplayerGameDialogComponent', () => {
  let component: MultiplayerGameDialogComponent;
  let fixture: ComponentFixture<MultiplayerGameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [GamesImports],
      declarations: [GamesDeclarations]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiplayerGameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
