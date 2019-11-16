import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild } from '@angular/core';
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
  name: string;
  today = new Date();
  foodCategories = ['Beverages', 'Dairy', 'Desserts', 'Dishes', 'Fats', 'Fish', 'Fruits', 'Grains',
                    'Meat', 'Vegetables', 'Other'];
  private addFoodSubs: Subscription[] = [];
  foodItems: FoodItem[];
  filteredFoodItems: Observable<FoodItem[]>;
  filterControl = new FormControl();

  constructor(public foodService: FoodService) { }

  @Output() optionSelected: EventEmitter<MatAutocompleteSelectedEvent>;
  @ViewChild('f', {static: false}) addFoodForm: NgForm;

  ngOnInit() {
    this.foodService.fetchCustomFoodItems();
    this.addFoodSubs.push(this.foodService.customFoodItemsChanged
      .subscribe(foodItems => {
        this.foodItems = foodItems;
        this.filteredFoodItems = this.filterControl.valueChanges
        .pipe(
          startWith(''),
          map(value => value !== null ? typeof value === 'string' ? value : value.name : ''),
          map(name => name ? this._filter(name) : this.foodItems.slice())
        );
      }));

  }

  onSave(form: NgForm, filterValue: any, action: string) {
    if (action === 'delete') {
      this.foodService.saveCustomFood(filterValue, 'delete');
      form.resetForm();
      this.filterControl.reset();
    } else {
      this.foodService.saveCustomFood({
        name: typeof filterValue === 'string' ? filterValue : filterValue.name,
        serving: form.value.serving,
        caloriesIn: form.value.calories,
        fat: form.value.fat,
        carb: form.value.carbohydrate,
        protein: form.value.protein,
        category: form.value.foodCategory
      }, action === 'update' ? this.foodService.oldAddedFoodName || this.name : null);
    }
  }

  displayFn(foodItem?: FoodItem): string | undefined {
    if (!foodItem) {
      return '';
    }
    return foodItem ? foodItem.name : undefined;
  }

  private _filter(name: string): FoodItem[] {
    if (name != null) {
    const filterValue = name.toLowerCase();
    return this.foodItems.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
    }
  }

  onSelectionChanged(event: MatAutocompleteSelectedEvent) {
    this.name = event.option.value.name,
    // using ViewChild
    this.addFoodForm.setValue({
      foodCategory: event.option.value.category,
      serving: event.option.value.serving,
      fat: event.option.value.fat,
      carbohydrate: event.option.value.carb,
      protein: event.option.value.protein,
      calories: event.option.value.caloriesIn
    });
  }

  resetForm() {
    // using ViewChild
    this.addFoodForm.reset();
    this.filterControl.reset();
  }

  ngOnDestroy() {
    if (this.addFoodSubs) {
      this.addFoodSubs.forEach(sub => sub.unsubscribe());
    }
  }

}
