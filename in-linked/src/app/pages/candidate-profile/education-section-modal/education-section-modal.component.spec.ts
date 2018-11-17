import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationSectionModalComponent } from './education-section-modal.component';

describe('EducationSectionModalComponent', () => {
  let component: EducationSectionModalComponent;
  let fixture: ComponentFixture<EducationSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
