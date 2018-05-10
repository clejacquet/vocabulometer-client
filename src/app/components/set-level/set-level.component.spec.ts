import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLevelComponent } from './set-level.component';

describe('SetLevelComponent', () => {
  let component: SetLevelComponent;
  let fixture: ComponentFixture<SetLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SetLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
