import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleSectionModalComponent } from './title-section-modal.component';

describe('TitleSectionModalComponent', () => {
  let component: TitleSectionModalComponent;
  let fixture: ComponentFixture<TitleSectionModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TitleSectionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TitleSectionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
