import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickLinksCard } from './quick-links-card';

describe('QuickLinksCard', () => {
  let component: QuickLinksCard;
  let fixture: ComponentFixture<QuickLinksCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickLinksCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickLinksCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
