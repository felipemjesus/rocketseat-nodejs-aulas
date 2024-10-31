import { UniqueEntityId } from "./unique-entity-id"

export class Entity<Props> {
    private _id: UniqueEntityId
    protected props: any

    protected constructor(props: any, id?: UniqueEntityId) {
        this.props = props
        this._id = id ?? new UniqueEntityId()
    }

    get id() {
        return this._id
    }
}
