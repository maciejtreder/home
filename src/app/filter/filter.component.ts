import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { Observable } from 'rxjs';
import { flatMap, map, startWith } from 'rxjs/operators';

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

  public toDisplay$: Observable<any[]>;

  public filterForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    publisher: new FormControl(''),
    hashtags: new FormControl('')
  });

  public publishers$: Observable<string[]>;
  public filteredPublishers$: Observable<string[]>;

  public hashTags$: Observable<string[]>;
  public filteredTags$: Observable<string[]>;
  public selectedTags = [];

  private conditions: any[] = [];

  private displayLimit: any = map((items: any[]) => {
    return items.slice(0, 5);
  });

  constructor() { }

  ngOnInit(): void {
    this.publishers$ = this.dataSource$.pipe(
      map(entries => entries.map(entry => entry.for)),
      map(publishers => publishers.filter((value, index, self) => self.indexOf(value) === index))
    )

    this.filteredPublishers$ = this.filterForm.controls['publisher'].valueChanges.pipe(
      startWith(''),
      flatMap(value => {
        const filterValue = value? value.toLowerCase() : '';
        return this.publishers$.pipe(
          map(entries => entries.filter(entry => entry.toLowerCase().indexOf(filterValue) === 0))
        )
      })
    );

    this.hashTags$ = this.dataSource$.pipe(
      map(entries => entries.map(entry => entry.keywords)),
      map(arrays => arrays.reduce( (all, current) => all.concat(current))),
      map(keyword => keyword.filter((value, index, self) => self.indexOf(value) === index))
    );

    this.filteredTags$ = this.filterForm.controls['hashtags'].valueChanges.pipe(
      startWith(''),
      flatMap(value => {
        return this.hashTags$.pipe(
          map(entries => entries.filter(entry => entry.toLowerCase().indexOf(value) === 0))
        )
      }),
      map(entries => entries.filter(entry => !this.selectedTags.includes(entry)))
    );

    this.filterForm.valueChanges.subscribe(value => {
      this.conditions = [];
      if (!!value.title) {
        const title = value.title.toLowerCase();
        this.conditions.push(entry => entry.title.toLowerCase().indexOf(title) >= 0);
      }

      if (!!value.publisher) {
        const publisher = value.publisher.toLowerCase();
        this.conditions.push(entry => entry.for.toLowerCase().indexOf(publisher) >= 0);
      }

      if (this.selectedTags.length > 0) {
        console.log(this.selectedTags)
        this.conditions.push(entry => {
          let display = true;
          for (let tag of this.selectedTags) {
            display = entry.keywords.includes(tag);
            if (!display)
              break;
          }
          return display;
        });
      }
      this.emit();
    });
    this.emit();
  }
  
  public pageEvent(event: PageEvent) {
    let itemsFrom = event.pageIndex * event.pageSize;
    let itemsTo = itemsFrom + event.pageSize;

    this.displayLimit = map((items: any[]) => {
      return items.slice(itemsFrom, itemsTo);
    });

    this.emit();
  }

  public selectedTag(event: MatAutocompleteSelectedEvent) {
    this.selectedTags.push(event.option.value);
    this.filterForm.controls['hashtags'].setValue('');
  }

  public remove(tag: string) {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
    }
  }

  private emit(): void {
    this.toDisplay$ = this.dataSource$.pipe(
      map(entries => {
        this.conditions.forEach(condition => {
          entries = entries.filter(condition);
        })
        return entries;
      })
    );

    this.pageEmitter.emit(
      this.toDisplay$.pipe(
        this.displayLimit
      )
    );
  }
}
