import { ApiError, UserCreateSchema } from "../../api";
import { ActionService, createErrorMessage } from "./ActionService";
import {
    DISPATCH_START_FETCH_USERS, DISPATCH_FETCH_USERS_RESULT,
    DISPATCH_FETCH_USERS_ERROR,
    ACTION_FETCH_USERS, ACTION_SERVER_ERROR, ACTION_CHECK_DEFAULT_USER
} from "../../constants";
import { ActionRegister } from "../../types";
import { reducer } from "../reducer/Reducer";

export class UsersActions implements ActionRegister {
    private actionService!: ActionService;

    public registerActions = (a: ActionService) => {
        this.actionService = a;

        this.actionService.register(ACTION_FETCH_USERS,
            async () => this.fetchUsers());
        this.actionService.register(ACTION_CHECK_DEFAULT_USER,
            async () => this.checkForDefaultUser());
    }

    private fetchUsers = async () => {
        reducer.dispatch({ type: DISPATCH_START_FETCH_USERS }, this.actionService.appState);

        try {
            const users = await this.actionService.service.getUsers();

            reducer.dispatch({ type: DISPATCH_FETCH_USERS_RESULT, payload: users }, this.actionService.appState)

        } catch (error) {
            reducer.dispatch({
                type: DISPATCH_FETCH_USERS_ERROR,
                payload: createErrorMessage(error as (ApiError | string))
            }, this.actionService.appState)
        }
    }

    private checkForDefaultUser = async () => {
        try {
            const users = await this.actionService.service.getUsers();
            if (!users || users.length == 0) {
                // we need to create a default user ...
                const userData: UserCreateSchema = {
                    username: "Default User"
                }
                await this.actionService.service.createUser(userData)
            }
        } catch (error) {
            this.actionService.executeAction({ type: ACTION_SERVER_ERROR, payload: error })
        }
    }
}