import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnterpriseDeleteModalComponent } from './enterprise-delete-modal.component';

describe('EnterpriseDeleteModalComponent', () => {
  let component: EnterpriseDeleteModalComponent;
  let fixture: ComponentFixture<EnterpriseDeleteModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnterpriseDeleteModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnterpriseDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
