import { Component } from '@angular/core';
import { SearchCondition } from './search-condition/search-condition';
import { SearchResult } from './search-result/search-result';

@Component({
  imports: [SearchCondition, SearchResult],
  selector: 'app-search',
  styleUrl: './search.scss',
  templateUrl: './search.html',
})
export class Search {}
