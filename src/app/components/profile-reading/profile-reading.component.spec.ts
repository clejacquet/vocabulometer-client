import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReadingComponent } from './profile-reading.component';

describe('ProfileReadingComponent', () => {
  let component: ProfileReadingComponent;
  let fixture: ComponentFixture<ProfileReadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileReadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
