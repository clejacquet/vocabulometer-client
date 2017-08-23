import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GazeCursorComponent } from './gaze-cursor.component';

describe('GazeCursorComponent', () => {
  let component: GazeCursorComponent;
  let fixture: ComponentFixture<GazeCursorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GazeCursorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GazeCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
