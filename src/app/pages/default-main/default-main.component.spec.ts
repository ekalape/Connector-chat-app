import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DefaultMainComponent } from './default-main.component';

describe('DefaultMainComponent', () => {
  let component: DefaultMainComponent;
  let fixture: ComponentFixture<DefaultMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DefaultMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DefaultMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
