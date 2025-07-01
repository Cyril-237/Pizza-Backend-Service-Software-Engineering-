import { FunctionalComponent, h } from "preact";
import { ShowAndCopyIdComponent } from "./ShowAndCopyIDComponent";
import { UserSchema } from "../api";
import { useContext } from "preact/hooks";
import { AppStateContext } from "../AppLogic";

interface UserProps  {
    id: string;
}

export const UserComponent : FunctionalComponent<UserProps> = ( { id } ) => {

    const { appState } = useContext(AppStateContext)

    const { users, loading, error } = appState.usersStore.value;

    if (loading) return <div>...</div>
    if (error) return <div>Error loading users ... {error}</div>

    const user : UserSchema = users.filter( u => u.id == id )[0];

    return <div>
                <ShowAndCopyIdComponent id={id} type="User-Id" content = "User-Id"/>
                {user == null ? "No User-Data!" : user.username }
            </div>
};
