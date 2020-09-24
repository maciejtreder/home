import { Component, ElementRef, EventEmitter, HostBinding, Inject, Input, Output, PLATFORM_ID, ViewChild, } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable, Subject, combineLatest, merge } from 'rxjs';
import { distinctUntilChanged, map, take, flatMap } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  animations: [
    trigger('form', [
      state('expanded', style({
        opacity: '100%',
      })),
      state('folded', style({
        opacity: '0%',
      })),
      state('hidden', style({
        display: 'none'
      })),
      state('visible', style({
        display: 'flex',
        opacity: '0%'
      })),
      transition('visible => expanded', animate('500ms ease-in')),
      transition('expanded => folded', animate('500ms ease-out')),
    ]),
    trigger('button', [
      state('show', style({
        transform: 'rotate(-90deg)'
      })),
      state('hide', style({
        transform: 'rotate(0deg)'
      })),
      transition('* => *', animate('500ms'))
    ])
  ]
})
export class FilterComponent {

  @Input('selectedTag')
  public selectedTag$: Observable<string>

  @Input('source')
  public dataSource: any[];

  @Output('filterChange')
  public filterChange = new EventEmitter<any[]>();

  constructor(private route: ActivatedRoute, private router: Router, @Inject(PLATFORM_ID) private platformId: any) { }

  // animations
  public fixed$: Observable<boolean>;

  @ViewChild('top')
  private topDiv: ElementRef;
  
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;

  @HostBinding('style.height')
  private height: string = '';

  public buttonState = "show"
  public formState = "hidden"

  public animateFilters(): void {
    this.formState = this.formState == "hidden"?"visible":"folded";
    this.buttonState = this.buttonState == "show"?"hide":"show";
  }

  public animationDone(event): void {
    if (this.formState == "visible") {
      this.formState = "expanded"
    } else if (this.formState == "folded") {
      this.formState = "hidden"
    }
    this.height = this.topDiv.nativeElement.offsetHeight + 'px';
  }

  private _setstickyFilters():void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    const topPosition = this.topDiv.nativeElement.offsetTop;
    this.fixed$ = fromEvent(window, 'scroll').pipe(
      map(() => window.pageYOffset > topPosition),
      distinctUntilChanged()
    );
  }

  //pagination
  public pageEvent(event: PageEvent) {
    this.filterStatus.start = event.pageIndex * event.pageSize;
    this.filterStatus.size = event.pageSize;
    this._filterStatus$.next(this.filterStatus);
  }

  //filter
  public filterForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    publisher: new FormControl(''),
    hashtags: new FormControl(''),
    video: new FormControl(false),
    slides: new FormControl(false)
  });

  public forFieldName: string;
  public filterStatus: any = {
    title: '',
    publisher: '',
    hashtags: [],
    video: false,
    slides: false,
    start: 0,
    size: 5
  }
  private _filterStatus$: Subject<any> = new Subject<any>();

  public filteredList$: Subject<any> = new Subject<any>();

  public filteredPublishers$: Observable<string[]> = this.filteredList$.pipe(
    map(entries => entries.map(entry => entry.for).filter((value, index, self) => self.indexOf(value) === index))
  );

  public availableTags$ = this.filteredList$.pipe(
    map(entries => {
      return entries
        .map(entry => entry.keywords)
        .reduce((all, current) => all.concat(current))
        .filter((value, index, self) => self.indexOf(value) === index)
        .filter(entry => !this.filterStatus.hashtags.includes(entry))
    })
  );

  public filteredTags$: Observable<string[]> = merge(
    this.availableTags$,
    this.filterForm.controls['hashtags'].valueChanges.pipe(
      flatMap(enteredValue => {
        return this.availableTags$.pipe(
          map(entries => entries.filter(entry => entry.indexOf(enteredValue.toLowerCase()) >= 0))
        )
      })
    )
  );

  ngOnInit() {
    this.selectedTag$.subscribe(tag => {
      this.clearTags();
      this.addTag(tag)
      if (this.formState != "expanded") {
        this.animateFilters()
      }
    });

    combineLatest([this.filteredList$, this._filterStatus$]).subscribe(results => {
      this.filterChange.emit(results[0].slice(results[1].start, results[1].start + results[1].size ))
    });
    
    this._filterStatus$.subscribe(value => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: value
      });

      if (!!this.dataSource) {
        const test = entry => {
          let slides = true;
          if (value.slides) {
            slides = !!entry.slides;
          }

          let video = true;
          if (value.video) {
            video = !!entry.video;
          }
          const title = entry.title.toLowerCase().indexOf(value.title.toLowerCase()) >= 0;
          const publisher = entry.for.toLowerCase().indexOf(value.publisher.toLowerCase()) >= 0;

          let tags = true;
          for (let tag of value.hashtags) {
            if (!entry.keywords.includes(tag)) {
              tags = false;
              break;
            }
          }
          return slides && video && title && publisher && tags;
        }
        
        this.filteredList$.next(this.dataSource.filter(test))
      }
    });

    this.route.queryParams.pipe(take(1)).subscribe(params => {
      this.filterStatus.title = !!params.title?params.title:'';
      this.filterStatus.publisher = !!params.publisher?params.publisher:'';
      this.filterStatus.video = params.video == "true";
      this.filterStatus.slides = params.slides == "true";
      this.filterStatus.hashtags = !!params.hashtags?this.filterStatus.hashtags.concat(params.hashtags):[];
      this.filterStatus.start = !!params.start?parseInt(params.start) : 0;
      this.filterStatus.size = !!params.size?parseInt(params.size) : 5;

      if (!!params.title || !!params.publisher || this.filterStatus.video || this.filterStatus.slides || this.filterStatus.hashtags.length > 0) {
        this.animateFilters();
      }
      this.filterForm.patchValue(this.filterStatus);
    });

    this.filterForm.valueChanges.subscribe(value => {
      this.filterStatus.title = value.title;
      this.filterStatus.publisher = value.publisher;
      this.filterStatus.video = value.video;
      this.filterStatus.slides = value.slides;
      this._filterStatus$.next(this.filterStatus);
    })
  }

  ngOnChanges(): void {
    if (!this.dataSource) {
      return;
    }
    this._filterStatus$.next(this.filterStatus);

    if (!!this.dataSource[0].place ) {
      this.forFieldName = "event";
    } else {
      this.forFieldName = "publisher";
    }
  }
  
  public selectedTag(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.value);
  }

  private addTag(tag: string) {
    this.filterStatus.hashtags.push(tag)
    this._filterStatus$.next(this.filterStatus);
    this.filterForm.controls['hashtags'].setValue('');
    this.tagInput.nativeElement.value = '';
  }

  public remove(tag: string) {
    const index = this.filterStatus.hashtags.indexOf(tag);

    if (index >= 0) {
      this.filterStatus.hashtags.splice(index, 1);
      this.filterForm.controls['hashtags'].setValue('')
    }
    this._filterStatus$.next(this.filterStatus);
  }

  public clearTags(): void {
    for (let i = this.filterStatus.hashtags.length - 1; i >= 0; i--) {
      this.remove(this.filterStatus.hashtags[i])
    }
  }
}