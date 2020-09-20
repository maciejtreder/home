import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  @Output('output')
  public pageEmitter = new EventEmitter<Observable<any[]>>();

  @Input('source')
  public dataSource$: Observable<any[]>;

  private conditions: any[] = [];

  private displayLimit: any = map((items: any[]) => {
    return items.slice(0, 5);
  });

  constructor() { }

  ngOnInit(): void {
    this.emit();
  }

  
  public pageEvent(event: PageEvent) {
    let itemsFrom = event.pageIndex * event.pageSize;
    let itemsTo = itemsFrom + event.pageSize;

    this.displayLimit = map((items: any[]) => {
      return items.slice(itemsFrom, itemsTo);
    })

    this.emit();
  }

  private emit(): void {
    this.pageEmitter.emit(this.dataSource$.pipe(
      // this.operators,
      this.displayLimit
    ));
  }
}
