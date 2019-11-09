import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { FoodService } from '../food.service';
import { Subscription, Observable } from 'rxjs';
import { FoodItem } from '../food-item.model';
import { startWith, map } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})
export class AddFoodComponent implements OnInit, OnDestroy {

  minValue = 0;
  today = new Date();
  foodCategories = ['Beverages', 'Dairy', 'Desserts', 'Dishes', 'Fats', 'Fish', 'Fruits', 'Grains',
                    'Meat', 'Vegetables', 'Other'];
  private addFoodSubs: Subscription[] = [];
  foodItems: FoodItem[];
  filteredFoodItems: Observable<FoodItem[]>;
  filterControl = new FormControl();

  constructor(private foodService: FoodService) { }

  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;
  ngOnInit() {
    this.foodService.fetchCustomFoodItems();
    this.addFoodSubs.push(this.foodService.customFoodItemsChanged
      .subscribe(foodItems => {
        this.foodItems = foodItems;
      }));

    this.filteredFoodItems = this.filterControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.foodItems.slice())
    );
  }

  onSave(form: NgForm) {
    console.log(form);
    this.foodService.saveCustomFood({
      name: form.value.name,
      serving: form.value.serving,
      caloriesIn: form.value.calories,
      fat: form.value.fat,
      carb: form.value.carbohydrate,
      protein: form.value.protein,
      category: form.value.foodCategory
    });
  }

  displayFn(foodItem?: FoodItem): string | undefined {
    return foodItem ? foodItem.name : undefined;
  }

  private _filter(name: string): FoodItem[] {
    if (name != null) {
    const filterValue = name.toLowerCase();
    return this.foodItems.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    // return this.foodItems.filter(option => option.name.toLowerCase().includes(filterValue));
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
  }


  ngOnDestroy() {
    if (this.addFoodSubs) {
      this.addFoodSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
