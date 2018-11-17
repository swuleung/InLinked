import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsSectionModalComponent } from './skills-section-modal.component';

describe('SkillsSectionModalComponent', () => {
  let component: SkillsSectionModalComponent;
  let fixture: ComponentFixture<SkillsSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillsSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillsSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
