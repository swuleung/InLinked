import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FastFactsSectionModalComponent } from './fast-facts-section-modal.component';

describe('FastFactsSectionModalComponent', () => {
  let component: FastFactsSectionModalComponent;
  let fixture: ComponentFixture<FastFactsSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FastFactsSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FastFactsSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
