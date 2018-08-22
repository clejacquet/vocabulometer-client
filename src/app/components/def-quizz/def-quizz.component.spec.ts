import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefQuizzComponent } from './def-quizz.component';

describe('DefQuizzComponent', () => {
  let component: DefQuizzComponent;
  let fixture: ComponentFixture<DefQuizzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefQuizzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
