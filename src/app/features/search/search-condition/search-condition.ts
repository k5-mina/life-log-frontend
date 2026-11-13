import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule],
  selector: 'app-search-condition',
  styleUrl: './search-condition.scss',
  templateUrl: './search-condition.html',
})
export class SearchCondition {
  searchCondition = {
    dateFrom: '',
    dateTo: '',
  };
}
