 interface ticket { 
    id:number,
    type:string,
    subject:string
    description:string,
    level:'L1' | 'L2' | 'other' | 'any'
  }; 

  export interface newTicket {
      subject: string,
      comment: {
        html_body: string
      },
      custom_fields?:{        
          id: number,
          value: string | null      
      }[]
      type?: string | null
      requester:{
        email: string,
        name?: string
      }
      email_ccs?: {
        email: string,
        name?: string
      }[]
  }

  export default ticket;

