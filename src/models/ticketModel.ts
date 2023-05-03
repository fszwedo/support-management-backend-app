 interface ticket { 
    id:number,
    type:string,
    subject:string,
    description:string,
    level:'L1' | 'L2' | 'other' | 'any',
    group_id: number
  }; 

  export interface newTicket {
      id?: number,
      subject: string,
      comment: {
        html_body: string
      },
      custom_fields?:{        
          id: number,
          value: string | null | string[]     
      }[]
      type?: string | null
      requester:{
        email: string,
        name?: string
      }
      tags? : string[]
      email_ccs?: {
        user_email: string,
        user_name: string,
        action: string
      }[]
  };

  export default ticket;

