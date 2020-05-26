import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {DataService} from '../../services/data.service';
import {MatTable} from '@angular/material/table';
import {Categories, columnDefs} from '../../models/Database';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {Primary} from '../../models/Primary';
import {Secondary} from '../../models/Secondary';
import {Melee} from '../../models/Melee';
import {Subscription} from "rxjs/internal/Subscription";
import {Tier} from "../../models/Tier";
import {Item} from "../../models/Item";
import {SidebarService} from "../../services/sidebar.service";
import {faSearch, faStar, faChevronDown, faChevronUp} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class TableComponent implements OnInit {

  expandedElement: Primary | Secondary | Melee | null;
  tabs: string[] = ['Primaries', 'Secondaries', 'Melees'];
  activeTab = this.tabs[0];

  faSearch = faSearch;
  faStar = faStar;
  faDown = faChevronDown;
  faUp = faChevronUp;

  private loading: boolean = true;
  // TODO make sure to add #reference
  @ViewChild('table') el: MatTable<any>;

  displayedColumns: string[] = [];
  tableDataSource: (Item | Tier)[] = [];
  //tiers = Tier[];

  _tableDataSub: Subscription;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private data: DataService,
    private sideserv: SidebarService
  ) {
    this._tableDataSub = data.dataChange.subscribe(() => {
      this.switch(this.activeTab);
    });
  }

  ngOnInit() {
      this.data.getDb().subscribe((db) => {
        this.loading = false;
        this.switch(Categories.PRIMARY.toString());
      });
  }

  switch(tab: string) {
    tab = tab.toLowerCase();
    this.data.getData(tab).subscribe((array) => {
      this.loading = false;
      this.tableDataSource = array;
      this.displayedColumns = columnDefs[tab];
      console.log(this.tableDataSource);
      this.update();
    });
  }

  toggleSidebar() {
    this.sideserv.toggle();
  }

  update(): void {
    this.changeDetectorRef.detectChanges();
  }
}