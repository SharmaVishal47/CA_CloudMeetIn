import { ElementRef, NgZone, MbscBase, AfterViewInit, OnDestroy, Observable, MbscOptionsService, EventEmitter, OnInit } from './frameworks/angular';
import { ListView, MbscListviewOptions } from './classes/listview';
export { MbscListviewOptions };
export declare class MbscListviewService {
    private addSubject;
    private removeSubject;
    private cardSubject;
    notifyAdded(item: any, parent?: any): void;
    notifyRemoved(item: any): void;
    notifyCardPresence(isCard: boolean): void;
    onCardContent(): Observable<boolean>;
    onItemAdded(): Observable<any>;
    onItemRemoved(): Observable<any>;
}
export declare class MbscSublistService {
    private addSubject;
    private removeSubject;
    notifyAdded(item: any): void;
    notifyRemoved(item: any): void;
    onItemAdded(): Observable<any>;
    onItemRemoved(): Observable<any>;
}
export declare class MbscListitemService {
    private sublistSubject;
    notifySublistCreated(item: any): void;
    onSublistCreated(): Observable<any>;
}
export declare class MbscListviewSublist implements OnInit {
    parentServ: MbscListviewService;
    subServ: MbscSublistService;
    itemService: MbscListitemService;
    constructor(parentServ: MbscListviewService, subServ: MbscSublistService, itemService: MbscListitemService);
    ngOnInit(): void;
}
export declare class MbscListviewItem implements AfterViewInit, OnDestroy {
    elem: ElementRef;
    lvService: MbscListviewService;
    lvItemService: MbscListitemService;
    subService: MbscSublistService;
    id: number;
    icon: string;
    iconAlign: string;
    type: string;
    clone: any;
    mounted: boolean;
    readonly Index: any;
    readonly Element: any;
    constructor(elem: ElementRef, lvService: MbscListviewService, lvItemService: MbscListitemService, subService: MbscSublistService);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscListviewHeader extends MbscListviewItem {
    constructor(elem: ElementRef, lvService: MbscListviewService, itemService: MbscListitemService, subService: MbscSublistService);
}
export declare class MbscListview extends MbscBase {
    elem: ElementRef;
    zone: NgZone;
    lvService: MbscListviewService;
    optionService: MbscOptionsService;
    _instance: ListView;
    actions: Array<any> | {
        left?: any;
        right?: any;
    };
    actionsWidth: number;
    context: string | HTMLElement;
    striped: boolean;
    animateIcons: boolean;
    enhance: boolean;
    fillAnimation: boolean;
    fixedHeader: boolean;
    hover: 'left' | 'right' | {
        direction?: 'left' | 'right';
        time?: number;
        timeout?: number;
    };
    iconSlide: boolean;
    itemGroups: any;
    navigateOnDrop: boolean;
    quickSwipe: boolean;
    sortable: boolean | {
        group?: boolean;
        handle?: boolean | 'left' | 'right';
        multilevel?: boolean;
    };
    sortDelay: number;
    stages: Array<any> | {
        left?: Array<any>;
        right?: Array<any>;
    };
    swipe: boolean | 'left' | 'right' | ((args: {
        target: HTMLElement;
        index: number;
        direction: 'left' | 'right';
    }, inst: any) => (boolean | 'left' | 'right'));
    swipeleft: () => void;
    swiperight: () => void;
    vibrate: boolean;
    undoText: string;
    backText: string;
    onItemTap: EventEmitter<{
        target: HTMLElement;
        domEvent: any;
        index: number;
        inst: any;
    }>;
    onItemAdd: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onItemRemove: EventEmitter<{
        target: HTMLElement;
        inst: any;
    }>;
    onNavEnd: EventEmitter<{
        level: number;
        direction: 'left' | 'right';
        list: HTMLElement;
        inst: any;
    }>;
    onNavStart: EventEmitter<{
        level: number;
        direction: 'left' | 'right';
        list: HTMLElement;
        inst: any;
    }>;
    onSlideEnd: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSlideStart: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSort: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSortChange: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSortStart: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSortEnd: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onSortUpdate: EventEmitter<{
        target: HTMLElement;
        index: number;
        inst: any;
    }>;
    onStageChange: EventEmitter<{
        target: HTMLElement;
        index: number;
        stage: any;
        inst: any;
    }>;
    options: MbscListviewOptions;
    inlineOptions(): MbscListviewOptions;
    inlineEvents(): MbscListviewOptions;
    cardContent: boolean;
    constructor(elem: ElementRef, zone: NgZone, lvService: MbscListviewService, optionService: MbscOptionsService);
    initControl(): void;
}
export declare class MbscListviewModule {
}
