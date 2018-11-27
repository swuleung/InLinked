import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyDetailsSectionModalComponent } from './fast-facts-section-modal.component';

describe('CompanyDetailsSectionModalComponent', () => {
  let component: CompanyDetailsSectionModalComponent;
  let fixture: ComponentFixture<CompanyDetailsSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyDetailsSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyDetailsSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
