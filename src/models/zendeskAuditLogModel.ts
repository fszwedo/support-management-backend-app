export interface auditLog {
    id: Number,
    created_at: string,
    author_id: Number,
    events: zendeskEvent[],
    ticket_id: Number
}

export interface zendeskEvent {
    id: Number,
    type: string,
    value?: string,
    field_name?: string,
    previous_value?: string|null
}
