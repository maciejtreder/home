// TODO: refactor
import { Component, ElementRef, EventEmitter, HostBinding, Inject, Input, Output, PLATFORM_ID, ViewChild, ɵCompiler_compileModuleSync__POST_R3__ } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { PageEvent } from '@angular/material/paginator';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, take } from 'rxjs/operators';
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
  private from: number = 0;
  private to: number = 5;

  public toDisplay: any[];

  public pageEvent(event: PageEvent) {
    this.from = event.pageIndex * event.pageSize;
    this.to = this.from + event.pageSize;
    this.emit();
  }

  //filter
  public filterForm: FormGroup = new FormGroup({
    title: new FormControl(''),
    publisher: new FormControl(''),
    hashtags: new FormControl(''),
    video: new FormControl(false),
    slides: new FormControl(false)
  });

  public publishers: string[];
  public filteredPublishers$: Observable<string[]>;

  public hashTags: string[];
  public filteredTags$: Observable<string[]>;
  public selectedTags:string[] = [];

  public forFieldName: string;

  private conditions: any[] = [];

  private _listenForm():void {
    this.filterForm.valueChanges.subscribe(value => {
      this.conditions = [];

      const queryParams = {
        title: !!value.title?value.title:'',
        publisher: !!value.publisher?value.publisher:'',
        video: !!value.video,
        slides: !!value.slides,
        hashtags: this.selectedTags
      };

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: queryParams
      });
      this.refineList(queryParams);
    });
  }

  private _fillUpForm(): void {
    this.route.queryParams.pipe(take(1)).subscribe(params => {
      if (!!params.hashtags) {
        this.selectedTags = this.selectedTags.concat(params.hashtags)
      }
      
      this.filterForm.patchValue({
        title: params.title,
        publisher: params.publisher,
        video: params.video == "true",
        slides: params.slides == "true",
      })

      if (!!params.hashtags || params.video == "true" || params.slides == "true" || !!params.title || !!params.publisher) {
        this.animateFilters()
      }
    });
  }

  ngAfterViewInit() {
    this._setstickyFilters()
  }

  ngOnChanges(): void {
    if (!this.dataSource) {
      return;
    }
    this._listenForm();
    this._fillUpForm();

    this.selectedTag$.subscribe(tag => {
      this.addTag(tag)
    });

    if (!!this.dataSource[0].place ) {
      this.forFieldName = "event";
    } else {
      this.forFieldName = "publisher";
    }

    this.publishers = this.dataSource
      .map(entry => entry.for)
      .filter((value, index, self) => self.indexOf(value) === index)

    this.filteredPublishers$ = this.filterForm.controls['publisher'].valueChanges.pipe(
      startWith(''),
      map(value => {
        const filterValue = value? value.toLowerCase() : '';
        return this.publishers.filter(entry => entry.toLowerCase().indexOf(filterValue) === 0);
      })
    );
    
    this.hashTags = this.dataSource
      .map(entry => entry.keywords)
      .reduce((all, current) => all.concat(current))
      .filter((value, index, self) => self.indexOf(value) === index)

    this.filteredTags$ = this.filterForm.controls['hashtags'].valueChanges.pipe(
      startWith(''),
      map(value => {
        return this.hashTags.filter(entry => entry.toLowerCase().indexOf(value) === 0);
      }),
      map(entries => entries.filter(entry => !this.selectedTags.includes(entry)))
    );
  }

  private refineList(value) {
    if (value.slides) {
      this.conditions.push(entry => !!entry.slides)
    }

    if (value.video) {
      this.conditions.push(entry => !!entry.video)
    }

    this.conditions.push(entry => entry.title.toLowerCase().indexOf(value.title.toLowerCase()) >= 0);
    this.conditions.push(entry => entry.for.toLowerCase().indexOf(value.publisher.toLowerCase()) >= 0);

    if (value.hashtags.length > 0) {
      this.conditions.push(entry => {
        let display = true;
        for (let tag of value.hashtags) {
          display = entry.keywords.includes(tag);
          if (!display)
            break;
        }
        return display;
      });
    }
    this.emit();
  }
  
  public selectedTag(event: MatAutocompleteSelectedEvent) {
    this.addTag(event.option.value);
  }

  private addTag(tag: string) {
    this.selectedTags.push(tag);
    this.filterForm.controls['hashtags'].setValue('');
  }

  public remove(tag: string) {
    const index = this.selectedTags.indexOf(tag);

    if (index >= 0) {
      this.selectedTags.splice(index, 1);
      this.filterForm.controls['hashtags'].setValue('')
    }
    this.emit();
  }

  private emit(): void {
    let aggregatedCondition = entry => {
      let display = true;
      for (let condition of this.conditions) {
        display = condition(entry)
        if (!display) {
          break;
        }
      }
      return display;
    }

    this.toDisplay = this.dataSource.filter(aggregatedCondition);

    this.filterChange.emit(this.toDisplay.slice(this.from, this.to));
  }
}
