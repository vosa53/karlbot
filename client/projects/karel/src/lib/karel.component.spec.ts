import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KarelComponent } from './karel.component';

describe('KarelComponent', () => {
  let component: KarelComponent;
  let fixture: ComponentFixture<KarelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KarelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KarelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
