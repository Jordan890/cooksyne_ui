import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroceryListsPage } from './grocery-lists-page';

describe('GroceryListsPage', () => {
  let component: GroceryListsPage;
  let fixture: ComponentFixture<GroceryListsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroceryListsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GroceryListsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
