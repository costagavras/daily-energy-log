import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.component.html',
  styleUrls: ['./add-food.component.css']
})
export class AddFoodComponent implements OnInit {

  minValue = 0;
  today = new Date();
  foodCategories = ['Beverages', 'Dairy', 'Desserts', 'Dishes', 'Fats', 'Fish', 'Fruits', 'Grains',
                    'Meat', 'Vegetables', 'Other'];

  constructor() { }

  ngOnInit() {
  }

}
