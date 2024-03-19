import { createFeatureSelector, createSelector  } from "@ngrx/store";


export class BaseSelector<T, B>{

    private readonly getListFeatureSelector;
    readonly getListSelector;
    private readonly getSelectedFeatureSelector;
    readonly getSelectedSelector;
    private readonly getSelectedFeatureAndType;
    readonly getSelectedAndTypeSelector;
    private readonly getSelectedListFeatureSelector;
    public readonly getSelectedListSelector;

    constructor(private selectorListName: string, private selectorSingleName, private selectedListSelectorName ) {
        this.getListFeatureSelector = createFeatureSelector<T>(this.selectorListName);
        this.getListSelector = createSelector(this.getListFeatureSelector, state => state);
        this.getSelectedFeatureSelector = createFeatureSelector<B>(this.selectorSingleName);
        this.getSelectedSelector = createSelector(this.getSelectedFeatureSelector, state => state);
        this.getSelectedFeatureAndType = createFeatureSelector<{ data: T, typeId: any }>(this.selectorSingleName + "WithType");
        this.getSelectedAndTypeSelector = createSelector(this.getSelectedFeatureAndType, state => state);
        this.getSelectedListFeatureSelector = createFeatureSelector(this.selectedListSelectorName);
        this.getSelectedListSelector = createSelector(this.getSelectedListFeatureSelector, state => state);

    }

}