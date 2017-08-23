import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextStructureComponent } from './text-structure.component';

describe('TextStructureComponent', () => {
  let component: TextStructureComponent;
  let fixture: ComponentFixture<TextStructureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextStructureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
