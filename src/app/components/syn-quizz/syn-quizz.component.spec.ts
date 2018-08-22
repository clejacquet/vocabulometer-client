import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SynQuizzComponent } from './syn-quizz.component';

describe('SynQuizzComponent', () => {
  let component: SynQuizzComponent;
  let fixture: ComponentFixture<SynQuizzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SynQuizzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SynQuizzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
