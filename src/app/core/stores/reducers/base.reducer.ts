import { createReducer, on } from "@ngrx/store";
import { BaseAction } from "../actions/base.action";

export class BaseReducer<A>{
    initialList: { list: A[] } = {
        list: []
    };

    initialSelectedList: { list: A[] } = {
        list: []
    };
    initialSelected: { selected?: A } = {
        selected: undefined
    };

    initialSelectedWithType: {
        selected?: A;
        typeId: any;
    } = {
            selected: undefined,
            typeId: -1
        }

    constructor(private actions: BaseAction<A>) {

    }

    getListreducer() {
        return createReducer(this.initialList, on(this.actions.setList, (state, items) => {
            return {
                list: [...items.data]
            };
        }), on(this.actions.clearList, (state) => {
            return {
                list: []
            };
        }), on(this.actions.insert, (state, item) => {
            let currentList: A[] = [...state.list];
            currentList.push({ ...item.data });
            return {
                list: [...currentList]
            };
        }), on(this.actions.update, (state, item) => {
            
            let currentList: A[] = JSON.parse(JSON.stringify(state.list));
            let index = currentList.findIndex(x => x["id"] == item.data["id"]);
            if (index != -1) {
                currentList[index] = { ...item.data }
            }
            return {
                list: [...currentList]
            };
        }), on(this.actions.unshift, (state, item) => {
            let currentList: A[] = JSON.parse(JSON.stringify(state.list));
            currentList.unshift(item.data);
            return {
                list: [...currentList]
            };
        }), on(this.actions.refreshList, (state) => {
            return {
                list: [...state.list]
            }
        }));
    }

    getSelectedReducer() {
        return createReducer(this.initialSelected, on(this.actions.setSelected, (state, item) => {
            return {
                selected: { ...item.data }
            }
        }), on(this.actions.clearSelected, (state) => {
            return {
                selected: undefined
            }
        }));
    }

    getSelectedWithTypeReducer() {
        return createReducer(this.initialSelectedWithType, on(this.actions.setSelectedWithType, (state, item) => {
            return {
                selected: item.data,
                typeId: item.typeId
            }
        }), on(this.actions.clearSelectedWithType, (state) => {
            return {
                selected: undefined, typeId: -1
            }
        }));
    }


    getSelectedListReducer() {
        return createReducer(this.initialSelectedList, on(this.actions.setSelectedList, (state, items) => {
            return {
                list: [...items.data]
            }
        }), on(this.actions.clearSelectedList, (state) => {
            return {
                list: []
            }
        }));
    }

}