import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TvShowScrollableComponent } from './tv-show-scrollable.component';

describe('TvShowScrollableComponent', () => {
  let component: TvShowScrollableComponent;
  let fixture: ComponentFixture<TvShowScrollableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TvShowScrollableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TvShowScrollableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
