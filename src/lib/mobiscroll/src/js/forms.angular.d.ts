import { MbscBase, MbscControlBase, NgZone, NgControl, ElementRef, EventEmitter, QueryList, OnInit, Observable, MbscInputService, MbscOptionsService, AfterViewInit, ChangeDetectorRef } from './frameworks/angular';
import { Form } from './classes/forms';
import { TextArea } from './classes/textarea';
import { Select } from './classes/select';
import { Button } from './classes/button';
import { CheckBox } from './classes/checkbox';
import { Switch } from './classes/switch';
import { Stepper } from './classes/stepper';
import { Progress } from './classes/progress';
import { Radio } from './classes/radio';
import { SegmentedItem } from './classes/segmented';
import { Slider } from './classes/slider';
import { Rating } from './classes/rating';
import { MbscFormOptions } from './classes/forms';
export { MbscFormOptions };
import { MbscInputBase, MbscFormValueBase, MbscFormBase, MbscInput } from './input.angular';
export { MbscInput };
export declare class MbscForm extends MbscBase implements OnInit {
    private _formService;
    private optionsObj;
    _instance: Form;
    options: MbscFormOptions;
    inputStyle: string;
    labelStyle: string;
    rootElem: ElementRef;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService);
    inlineOptions(): MbscFormOptions;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscTextarea extends MbscInputBase {
    protected _inputService: MbscInputService;
    _instance: TextArea;
    rows: number | string;
    constructor(initialElem: ElementRef, _formService: MbscOptionsService, _inputService: MbscInputService, _control: NgControl);
    initControl(): void;
}
export declare class MbscDropdown extends MbscFormValueBase {
    protected _inputService: MbscInputService;
    _instance: Select;
    label: string;
    icon: string;
    iconAlign: string;
    value: any;
    inputStyle: string;
    labelStyle: string;
    constructor(hostElem: ElementRef, formService: MbscOptionsService, _inputService: MbscInputService, control: NgControl);
    initControl(): void;
    writeValue(v: any): void;
}
export declare class MbscButton extends MbscFormBase {
    _instance: Button;
    _flat: boolean;
    _block: boolean;
    _outline: boolean;
    _classesObj: any;
    readonly cssClasses: any;
    classes: string;
    type: string;
    icon: string;
    flat: any;
    block: any;
    outline: any;
    constructor(hostElem: ElementRef, formService: MbscOptionsService);
    initControl(): void;
}
export declare class MbscCheckbox extends MbscFormValueBase {
    cdr: ChangeDetectorRef;
    _instance: CheckBox;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, cdr: ChangeDetectorRef, formService: MbscOptionsService, control: NgControl);
    initControl(): void;
    writeValue(v: any): void;
}
export declare class MbscSwitch extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Switch;
    options: MbscFormOptions;
    disabled: boolean;
    name: string;
    color: string;
    value: boolean;
    onChangeEmitter: EventEmitter<boolean>;
    _initElem: ElementRef;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: boolean): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscStepper extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Stepper;
    _readonly: boolean;
    readonly: any;
    options: MbscFormOptions;
    value: number;
    name: string;
    min: number;
    max: number;
    step: number;
    val: string;
    disabled: boolean;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<number>;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscProgress extends MbscControlBase implements OnInit {
    protected _formService: MbscOptionsService;
    protected _inheritedOptions: any;
    _instance: Progress;
    options: MbscFormOptions;
    value: number;
    max: number;
    icon: string;
    iconAlign: string;
    val: string;
    disabled: boolean;
    stepLabels: Array<number>;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    _initElem: ElementRef;
    constructor(hostElement: ElementRef, zone: NgZone, _formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscRadioService {
    private _name;
    name: string;
    private _multiSelect;
    multiSelect: boolean;
    private _valueSubject;
    onValueChanged(): Observable<any>;
    changeValue(v: any): void;
    private _color;
    color: string;
}
export declare class MbscRadioGroupBase extends MbscFormValueBase {
    _radioService: MbscRadioService;
    name: string;
    value: any;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
    writeValue(v: any): void;
}
export declare class MbscRadioGroup extends MbscRadioGroupBase {
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl);
}
export declare class MbscRadio extends MbscFormBase {
    private _radioService;
    _instance: Radio;
    readonly checked: boolean;
    name: string;
    modelValue: any;
    color: string;
    value: any;
    _colorClass: any;
    readonly colorClass: any;
    clicked(e: any): void;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService);
    initControl(): void;
    ngOnInit(): void;
}
export declare class MbscSegmentedGroup extends MbscRadioGroupBase {
    select: string;
    readonly multiSelect: boolean;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, radioService: MbscRadioService, control: NgControl);
    ngOnInit(): void;
}
export declare class MbscSegmented extends MbscFormBase {
    private _radioService;
    _instance: SegmentedItem;
    readonly isChecked: boolean;
    name: string;
    modelValue: any;
    multiSelect: boolean;
    icon: string;
    value: any;
    checked: any;
    checkedChange: EventEmitter<any>;
    clicked(e: any): void;
    readonly cssClass: string;
    constructor(hostElement: ElementRef, formService: MbscOptionsService, _radioService: MbscRadioService);
    initControl(): void;
    ngOnInit(): void;
}
export declare class MbscSlider extends MbscControlBase {
    private _formService;
    _instance: Slider;
    _lastValue: any;
    _dummy: Array<number>;
    readonly isMulti: boolean;
    readonly dummyArray: Array<number>;
    protected _inheritedOptions: any;
    _needsTimeout: boolean;
    options: MbscFormOptions;
    name: string;
    tooltip: boolean;
    highlight: boolean;
    live: boolean;
    valueTemplate: string;
    icon: string;
    val: string;
    max: number;
    min: number;
    step: number;
    disabled: boolean;
    stepLabels: Array<number>;
    value: any;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    onChangeEmitter: EventEmitter<any>;
    inputElements: QueryList<ElementRef>;
    constructor(hostElement: ElementRef, _formService: MbscOptionsService, zone: NgZone, control: NgControl);
    reInitialize(): void;
    setNewValue(v: any): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscRating extends MbscControlBase implements OnInit {
    protected formService: MbscOptionsService;
    _inheritedOptions: any;
    _instance: Rating;
    options: MbscFormOptions;
    name: string;
    min: number;
    max: number;
    step: number;
    disabled: boolean;
    empty: string;
    filled: string;
    _readonly: boolean;
    readonly: any;
    val: 'left' | 'right';
    template: string;
    value: number;
    onChangeEmitter: EventEmitter<number>;
    color: string;
    _colorClass: any;
    readonly colorClass: any;
    constructor(hostElem: ElementRef, zone: NgZone, formService: MbscOptionsService, control: NgControl);
    setNewValue(v: number): void;
    ngOnInit(): void;
    initControl(): void;
}
export declare class MbscFormGroup implements AfterViewInit {
    initialElem: ElementRef;
    collapsible: any;
    _open: boolean;
    open: boolean;
    inset: string;
    _instance: any;
    element: any;
    readonly instance: any;
    constructor(initialElem: ElementRef);
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
}
export declare class MbscFormGroupTitle {
}
export declare class MbscFormGroupContent {
}
export declare class MbscAccordion {
}
export declare class MbscFormsModule {
}
