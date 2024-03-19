import { createAction, props, UPDATE } from "@ngrx/store";
import { CLEAR_LIST, CLEAR_SELECTED, CLEAR_SELECTED_LIST, DELET, INSERT, INSERT_RANGE, INSERT_UNSHIFT, REFRESH_LIST, SET_LIST, SET_SELECTED, SET_SELECTED_LIST } from "src/app/core/constants/action-names";

export class BaseAction<T>{
    constructor(private actionPath: string) { }
    public readonly setList = createAction(this.actionPath + "/" + SET_LIST, props<{ data: T[] }>());
    public readonly clearList = createAction(this.actionPath + "/" +CLEAR_LIST );
    public readonly refreshList = createAction(this.actionPath + "/" + REFRESH_LIST);
    public readonly insert = createAction(this.actionPath + "/" + INSERT, props<{ data: T }>());
    public readonly unshift = createAction(this.actionPath + "/" + INSERT_UNSHIFT, props<{ data: T }>());
    public readonly delete = createAction(this.actionPath + "/" + DELET, props<{ data: T }>());
    public readonly update = createAction(this.actionPath + "/" + UPDATE, props<{ data: T }>());
    public readonly setSelected = createAction(this.actionPath + "/" + SET_SELECTED, props<{ data: T }>());
    public readonly clearSelected = createAction(this.actionPath + "/" + CLEAR_SELECTED);
    public readonly insertOrUpdateRange = createAction(this.actionPath + "/" + INSERT_RANGE, props<{ data: T[] }>());
    public readonly setSelectedWithType = createAction(this.actionPath + "/" + SET_SELECTED + "WithType", props<{ data: T, typeId: any }>());
    public readonly clearSelectedWithType = createAction(this.actionPath + "/" + CLEAR_SELECTED + "WithType");
    public readonly setSelectedList = createAction(this.actionPath+"/"+SET_SELECTED_LIST, props<{data:T[]}>());
    public readonly clearSelectedList = createAction(this.actionPath+"/"+CLEAR_SELECTED_LIST);


}