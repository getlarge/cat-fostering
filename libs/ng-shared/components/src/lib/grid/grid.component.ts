import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RxFor } from '@rx-angular/template/for';

@Component({
  selector: 'lib-grid',
  standalone: true,
  imports: [CommonModule, MatTableModule, RxFor],
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridComponent {
  @Input() dataSource: any[] = [];
  @Input() displayedColumns: string[] = [];
}
