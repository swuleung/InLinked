import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExperienceSectionModalComponent } from './experience-section-modal.component';

describe('ExperienceSectionModalComponent', () => {
  let component: ExperienceSectionModalComponent;
  let fixture: ComponentFixture<ExperienceSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
