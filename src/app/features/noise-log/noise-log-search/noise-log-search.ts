import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';

interface NoiseLogInfo {
  occurrenceDate: Date;
  startTime: string;
  noiseLevel: number;
  noiseType: string;
}

@Component({
  imports: [MatTableModule, DatePipe],
  selector: 'app-noise-log-search',
  styleUrl: './noise-log-search.scss',
  templateUrl: './noise-log-search.html',
})
export class NoiseLogSearch {
  noiseLogInfo: NoiseLogInfo[] = [
    {
      occurrenceDate: new Date('2026-10-30'),
      startTime: '02:21',
      noiseLevel: 3,
      noiseType: '足音',
    },
    {
      occurrenceDate: new Date('2026-11-02'),
      startTime: '22:15',
      noiseLevel: 2,
      noiseType: '足音',
    },
    {
      occurrenceDate: new Date('2026-11-03'),
      startTime: '10:22',
      noiseLevel: 2,
      noiseType: '足音',
    },
  ];

  displayedColumns = [
    'column-occurrence-date',
    'column-start-time',
    'column-noise-level',
    'column-noise-type',
  ];
}
