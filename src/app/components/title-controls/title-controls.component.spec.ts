import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleControlsComponent } from './title-controls.component';

describe('TitleControlsComponent', () => {
  let component: TitleControlsComponent;
  let fixture: ComponentFixture<TitleControlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleControlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TitleControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
