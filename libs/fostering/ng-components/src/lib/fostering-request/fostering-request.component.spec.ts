import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FosteringRequestComponent } from './fostering-request.component';

describe('FosteringRequestComponent', () => {
  let component: FosteringRequestComponent;
  let fixture: ComponentFixture<FosteringRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FosteringRequestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FosteringRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
